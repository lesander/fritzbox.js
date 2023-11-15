import fritz from '../index.js'
import pckJson from '../package.json' assert {type:'json'}

const number = process.argv[2]

async function dial () {
  const status = await fritz.dialNumber(number, pckJson.options)
  if (status.error) {
    console.log('Error: ' + status.error.message)
    process.exit(1)
  } else {
    console.log(status.message)
  }
}

dial()
