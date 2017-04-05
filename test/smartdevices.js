const fritz = require('../index.js')
const options = require('../package.json').options

async function devices () {
  const devices = await fritz.getSmartDevices(options)
  if (devices.error) {
    console.log('Error:', devices.error.message)
    process.exit(1)
  }
  console.log('Got ' + devices.length + ' DECT Smart Home devices.')
}

devices()
