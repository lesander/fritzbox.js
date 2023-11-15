import fritz from '../index.js'
import pckJson from '../package.json' assert {type:'json'}

async function devices () {
  const data = await fritz.getSmartDevices(pckJson.options)
  if (data.error) {
    console.log('Error:', data.error.message)
    process.exit(1)
  }
  console.log('Got ' + data.devices.length + ' DECT Smart Home devices.')
}

devices()
