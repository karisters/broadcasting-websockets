var pool = {}
  , DbService = require('./db-service')

function Controller() {
  var self = this
  this.db = new DbService(function () {
    self.db.setListeners(function (msg) {
      self.sendToAll(msg)
    })
  })
}

Controller.prototype.send = function (socket) {
  var args = Array.prototype.slice.apply(arguments)
    , message = args[1]
    , packet = {
      auth: typeof args[2] == 'undefined' ? true : args[2],
      reason: typeof args[3] == 'undefined' ? '' : args[3]
    }

  if (message !== null) {
    packet.message = message || ''
  }

  socket.send(JSON.stringify(packet));
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
  pool[socket.id] = socket
}

Controller.prototype.removeClosedFromPool = function () {
  var self = this
  Object.keys(pool).forEach(function (socketId) {
    if (pool[socketId].readyState == 'closed') {
      self.removeFromPool(pool[socketId].id)
    }
  })
}

Controller.prototype.removeFromPool = function (id) {
  delete pool[id]
}

Controller.prototype.closeSocket = function (socket) {
  var socketId = socket.id
  pool[socketId].close()
  this.removeFromPool(socketId)
}

Controller.prototype.sendToAll = function (msg) {
  var self = this
  Object.keys(pool).forEach(function (socketId) {
    if (pool[socketId].readyState == 'open')
      self.send(pool[socketId], msg)
  })
}

Controller.prototype.socketIsSubscribed = function (socket) {
  return socket.id in pool
}

module.exports = Controller