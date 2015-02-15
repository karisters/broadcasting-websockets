var pg = require('pg')
  , config = require('../config')[process.env.NODE_ENV || 'development']
  , connectionString = 'postgres://' + config['db']['user']
    + ':' + config['db']['password'] + '@' + config['db']['host'] + '/' + config['db']['dbname']

function DbService(cb) {
  this.client = null;
  var self = this
  pg.connect(connectionString, function (error, client) {
    if (error) {
      console.log('Error connecting to DB')
      process.exit()
    }
    client.query("LISTEN new_message");
    self.client = client
    cb()
  })
}

DbService.prototype.getAuth = function (id, key, cb) {
  this.client.query('SELECT * FROM users WHERE id=$1 AND key=$2', [parseInt(id) || 0, key], cb)
}

DbService.prototype.setListeners = function (cb) {
  this.client.on('notification', function (msg) {
    if ('channel' in msg && msg.channel == 'new_message' && 'payload' in msg) {
      cb(msg.payload)
    }
  });
}

module.exports = DbService