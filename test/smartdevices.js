import fritz from '../index.js'
import pckJson from '../package.json' assert {type:'json'}

async function devices () {
  const devices = await fritz.getSmartDevices(pckJson.options)
  if (devices.error) {
    console.log('Error:', devices.error.message)
    process.exit(1)
  }
  console.log('Got ' + devices.length + ' DECT Smart Home devices.')
}

devices()
