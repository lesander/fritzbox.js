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
const fritzLogin = require('./' + dir + '/login.js')
const fritzSystem = require('./' + dir + '/system.js')
const fritzFon = require('./' + dir + '/fon.js')
const fritzDect = require('./' + dir + '/dect.js')
const fritzWlan = require('./' + dir + '/wlan.js')
const fritzMonitor = require('./' + dir + '/callmonitor.js')

const fritz = Object.assign(
  fritzFon, fritzDect, fritzWlan, fritzMonitor
  {}, fritzConfig, fritzSystem, fritzLogin,
)

process.on('unhandledRejection', function (reason, r) {
  console.log('[FritzBox.js] Encountered unhandled Promise rejection')
  console.log(reason, r)
})

module.exports = fritz
