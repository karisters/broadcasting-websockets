var Controller = require('./lib/controller')
  , controller = new Controller()
  , tlsOptions = require('./config/tls')
  , server = require('https').createServer(tlsOptions)
  , io = require('engine.io').attach(server)

io.on('connection', function (socket) {
  socket.on('close', function (socket) {
    controller.removeClosedFromPool()
  })
  socket.on('message', function (message) {
    if (controller.socketIsSubscribed(socket)) {
      return
    }
    try {
      var parsedMessage = JSON.parse(message)
    } catch (e) {
      var parsedMessage = false
    }
    if (!parsedMessage) {
      return
    }
    controller.checkAuth(parsedMessage, function (err) {
      if (err) {
        controller.send(socket, null, false, err instanceof Error ? err.message : 'ID/Key are invalid')
        return
      }
      controller.subscribe(socket)
      controller.send(socket, null)
    })
  })
})

server.listen(process.env.PORT || 3000, function () {
  console.log('Server started')
})
