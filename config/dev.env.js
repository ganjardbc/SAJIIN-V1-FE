"use strict";
const merge = require("webpack-merge");
const prodEnv = require("./prod.env");

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URL: '"http://localhost:8080/"',
  API_URL: '"https://internal.sajiin.com/"',
  SOCKET_URL: '"https://websocket.sajiin.com/"',
  PRINTER_URL: '"http://localhost:9999"'
});
