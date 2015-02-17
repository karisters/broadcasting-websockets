var nssocket = require('nssocket')
  , connected = 0
  , toSend = 1000
  , msgs = 0
  , t
  , tlsOptions = require('../config/tls')
  , f = function () {
//    if (connected < toSend) {
    var outbound = new nssocket.NsSocket(tlsOptions)

    setTimeout(function () {
//    console.log(outbound.connected)
      if (outbound.connected)
        outbound.send('auth', { id: 1, key: 'ab:ab:ab:ab:ab:ab'})
    }, 3000)

    outbound.data('message', function (msg) {
      msgs++;
//        console.log('Message received %s', msg.toString())
    })

    outbound.data('auth', function (msg) {
      connected++;
//        console.log('Auth result %s', JSON.stringify(msg))
    })

    outbound.on('error', function (r) {
      console.log('error happened')
    })

    outbound.connect(3000);
//    outbound.connect(3000, '98.158.179.83');

//      t = setTimeout(f, 10)
//
//    } else {
//      clearTimeout(t)
//    }
  }

for (var i = 0; i < toSend; i++) {
  setTimeout(f, 1000);
}

process.on('uncaughtException', function (err) {
//  console.error(err.stack);
  console.log("error happened: %s", err.message);
});

setInterval(function () {
  console.log(connected, msgs)
}, 3000)