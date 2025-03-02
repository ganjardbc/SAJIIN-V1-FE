'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URL: '"http://localhost:8080/"',
  API_URL: '"https://api.sajiin.id/"',
  API_URL_V2: '"http://localhost:8081/"',
  SOCKET_URL: '"https://websocket.sajiin.id/"',
  PRINTER_URL: '"http://localhost:9999"',
  X_API_KEY: '"597e9fd7f4f7288b4148094d936c2de3e2c5b8ddb66c22412751257ea7f0c80e"'
})
