import fritz from '../index.js'
import pckJson from '../package.json' assert {type:'json'}

async function device () {
  const device = await fritz.getDeviceByName('Pixel-6', pckJson.options)
  if (device.error) {
    console.log('Error:', device.error.message)
    process.exit(1)
  } else {
    console.log('Device is connected to the LAN', device)
  }
}

device()
