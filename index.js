/**
 * FritzBox.js
 * Licensed under the MIT License.
 * Copyright (c) 2017 Sander Laarhoven All Rights Reserved.
 *
 * Source-code available on GitHub.
 * https://git.io/fritzbox
 */
import pckJson from './package.json' assert { type: 'json'}
const fritzConfig = {
  version: pckJson.version,
  debug: pckJson.options.debug
}

import fritzLogin from './src/login.js'
import fritzSystem from './src/system.js'
import fritzFon from './src/fon.js'
import fritzDect from './src/dect.js'
import fritzWlan from './src/wlan.js'

const fritz = Object.assign(
  {}, fritzConfig, fritzSystem, fritzLogin,
  fritzFon, fritzDect, fritzWlan
)

process.on('unhandledRejection', function (reason, r) {
  console.error('\x1b[31m[FritzBox.js] Encountered unhandled Promise rejection.\n' +
              'The script has been stopped. See the full stack trace below for more information.\n' +
              'If you think this has to do with FritzBox.js directly,\n' +
              'please do no hesitate to open an issue on GitHub.\n')
  console.error(reason, r)
  process.exit(1)
})

export default fritz
