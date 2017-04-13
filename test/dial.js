const fritz = require('../index.js')
const options = require('../package.json').options

const number = process.argv[2]
console.log(number)

if (!number) throw Error('no number given')

async function dial () {
  console.log('dialing..')
  const status = await fritz.dialNumber(number, options)
  console.log(status)
  if (status.error) {
    console.log('Error:', status.error.message)
  } else {
    console.log(status.message)
  }
}

dial()
