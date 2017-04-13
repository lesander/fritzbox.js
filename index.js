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

const dir = 'src'
const fritzRequest = require('./' + dir + '/request.js')
const fritzLogin = require('./' + dir + '/login.js')
const fritzFon = require('./' + dir + '/fon.js')
const fritzDect = require('./' + dir + '/dect.js')
const fritzWlan = require('./' + dir + '/wlan.js')
const fritzMonitor = require('./' + dir + '/callmonitor.js')

const fritz = Object.assign(
  {}, fritzConfig, fritzRequest, fritzLogin,
  fritzFon, fritzDect, fritzWlan, fritzMonitor
)

process.on('unhandledRejection', function (reason, r) {
  console.log('[FritzBox.js] Encountered unhandled Promise rejection')
  console.log(reason, r)
})

module.exports = fritz
