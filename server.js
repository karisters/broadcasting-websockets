var Controller = require('./lib/controller')
  , controller = new Controller()
  , uuid = require('node-uuid')
  , tlsOptions = require('./config/tls')
  , nssocket = require('nssocket')
  , port = require('./config')[process.env.NODE_ENV || 'development']['port']
  , handler = function (socket) {
    socket.uuid = uuid.v4()
    socket.on('error', function (r) {
      console.log(r)
    })
    socket.on('close', function () {
      controller.removeClosedFromPool()
    })
    socket.data('auth', function (authData) {
      if (controller.socketIsSubscribed(socket)) {
        return
      }
      controller.checkAuth(authData, function (err) {
        if (err) {
          socket.send('auth', {
            result: false,
            reason: err instanceof Error ? err.message : 'ID/Key are invalid'
          })
          return
        }
        controller.subscribe(socket)
        socket.send('auth', {
          result: true
        })
      })
    })
  }


process.on('uncaughtException', function (err) {
  console.error(err.stack);
  console.log("Node NOT Exiting...");
});

var tlsServer = nssocket.createServer(tlsOptions, handler)
tlsServer.listen(port)
