const fritz = require('../index.js')
const options = require('../package.json').options

async function wlanSecurity () {
  const calls = await fritz.getWlanSecurity(options)

  if (calls.error) {
    console.log('Error:', calls.error.message)
    process.exit(1)
  }

  console.log(`WLAN Info:\n` +
    `\tSSID: ${calls.ssid}\n` +
    `\tPSK: ${calls.psk}`)
}

wlanSecurity()
