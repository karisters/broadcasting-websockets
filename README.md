#Broadcasting messenger

Installation
------------

Install dependencies with `npm`:

``` bash
$ npm install
```

Generate certificates for TLS:

``` bash
$ cd config/certs
$ openssl req -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem
$ openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out server.crt
```