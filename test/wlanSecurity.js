const fritz = require('../index.js')
const options = require('../package.json').options

async function wlanSecurity () {
  const network = await fritz.getWlanNetwork(options)
  const security = await fritz.getWlanSecurity(options)

  if (network.error) {
    console.log('Error:', network.error.message)
    process.exit(1)
  }

  if (security.error) {
    console.log('Error:', security.error.message)
    process.exit(1)
  }

  console.log(`WLAN Info:\n` +
    `\tSSID: ${security.ssid}\n` +
    `\tPSK: ${security.psk}\n` +
    `\tHidden ${network.hiddenSSID}`)
}

wlanSecurity()
