const fritz = require('../index.js')
const options = require('./env.js')

async function key () {
  const key = await fritz.getWlanKey(options)
  if (key.error) {
    console.log('Error:', key.error.message)
    process.exit(1)
  } else {
    console.log('The WLAN key of this Fritz!Box is', key)
  }
}
key()
