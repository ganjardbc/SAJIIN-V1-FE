'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URL: '"http://localhost:8080/"',
  API_URL: '"http://localhost:8000/"',
  SOCKET_URL: '"https://websocket.sajiin.id/"',
  PRINTER_URL: '"http://localhost:9999"',
})
