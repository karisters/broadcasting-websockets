var pool = {}
  , DbService = require('./db-service')

setInterval(function () {
  console.log(Object.keys(pool).length)
}, 4000)

function Controller() {
  var self = this
  this.db = new DbService(function () {
    self.db.setListeners(function (msg) {
      self.sendToAll(msg)
    })
  })
}

Controller.prototype.checkAuth = function (msg, cb) {
  if (!(typeof msg == 'object' && 'id' in msg && 'key' in msg)) {
    cb(new Error('Message is malformed'))
    return
  }
  this.db.getAuth(msg.id, msg.key, function (err, result) {
    if (err) {
      cb(new Error('Could not fetch record'))
      return;
    }
    cb(result.rowCount == 0)
  })
}

Controller.prototype.subscribe = function (socket) {
  pool[socket.uuid] = socket
}

Controller.prototype.removeClosedFromPool = function () {
  var self = this
  Object.keys(pool).forEach(function (socketId) {
    if (!pool[socketId].connected) {
      self.removeFromPool(pool[socketId].uuid)
    }
  })
}

Controller.prototype.removeFromPool = function (id) {
  delete pool[id]
}

Controller.prototype.sendToAll = function (msg) {
  var self = this
  Object.keys(pool).forEach(function (socketId) {
    if (pool[socketId].connected)
      pool[socketId].send('message', msg)
  })
}

Controller.prototype.socketIsSubscribed = function (socket) {
  return socket.uuid in pool
}

module.exports = Controller