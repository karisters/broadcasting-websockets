var fs = require("fs")

module.exports = {
  key: fs.readFileSync(__dirname + '/certs/key.pem', 'utf8'),
  cert: fs.readFileSync(__dirname + '/certs/server.crt', 'utf8'),
  type: 'tls',
  reconnect: true
}