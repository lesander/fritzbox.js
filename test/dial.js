const fritz = require('../index.js')
const options = require('../package.json').options

const number = process.argv[2]

async function dial () {
  const status = await fritz.dialNumber(number, options)
  if (status.error) {
    console.log('Error: ' + status.error.message)
    process.exit(1)
  } else {
    console.log(status.message)
  }
}

dial()
