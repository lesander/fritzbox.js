const fritz = require('../index.js')
const options = require('../package.json').options

async function activecalls () {
  const calls = await fritz.getActiveCalls(options)

  if (calls.error) {
    console.log('Error:', calls.error.message)
    process.exit(1)
  }

  console.log('Currently there are/is ' + calls.length + ' active call(s).')
}
activecalls()
