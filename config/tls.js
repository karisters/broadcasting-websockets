var fs = require("fs")

module.exports = {
  key: fs.readFileSync(__dirname + '/certs/key.pem', 'utf8'),
  cert: fs.readFileSync(__dirname + '/certs/server.crt', 'utf8')
//  requestCert: false,
//  rejectUnauthorized: false
}