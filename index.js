/**
 * FritzBox.js
 * https://git.io/fritzbox
 * Licensed under the MIT License.
 * Copyright (c) 2017 Sander Laarhoven All Rights Reserved.
 */

const fritzConfig = {
  version: require('./package.json').version,
  debug: require('./package.json').options.debug
}
const fritzRequest = require('./src/request.js')
const fritzLogin = require('./src/login.js')
const fritzFon = require('./src/fon.js')
const fritzDect = require('./src/dect.js')
const fritzWlan = require('./src/wlan.js')

const fritz = Object.assign({}, fritzConfig, fritzRequest, fritzLogin, fritzFon, fritzDect, fritzWlan)

module.exports = fritz
