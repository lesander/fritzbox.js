/**
 * FritzBox.js
 * Licensed under the MIT License.
 * Copyright (c) 2017 Sander Laarhoven All Rights Reserved.
 *
 * Source-code available on GitHub.
 * https://git.io/fritzbox
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

const fritz = Object.assign(
  {}, fritzConfig, fritzSystem, fritzLogin,
  fritzFon, fritzDect, fritzWlan
)

process.on('unhandledRejection', function (reason, r) {
  console.log('\x1b[31m[FritzBox.js] Encountered unhandled Promise rejection.\n' +
              'The script has been stopped. See the full stack trace below for more information.\n' +
              'If you think this has to do with FritzBox.js directly,\n' +
              'please do no hesitate to open an issue on GitHub.\n')
  console.log(reason, r)
  process.exit(1)
})

module.exports = fritz
