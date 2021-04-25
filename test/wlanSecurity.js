const fritz = require('../index.js')
const options = require('../package.json').options

async function wlanSecurity () {
  const info = await fritz.getWlanSecurity(options)

  if (info.error) {
    console.log('Error:', info.error.message)
    process.exit(1)
  }

  console.log(`WLAN Info:\n` +
    `\tSSID: ${info.ssid}\n` +
    `\tPSK: ${info.psk}`)
}

wlanSecurity()
