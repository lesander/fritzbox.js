const fritz = require('../index.js')
const options = require('../package.json').options
const fs = require('fs')

async function calls () {
  const calls = await fritz.getCalls(options)
  if (calls.error) {
    console.log('Error:', calls.error.message)
    process.exit(1)
  } else {
    console.log('Got array of ', calls.length, ' calls.')
    fs.writeFileSync('calls.json', JSON.stringify(calls, null, 2))
  }
}

calls()
