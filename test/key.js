const fritz = require('../index.js')
const options = require('./env.js')

async function key () {
  const key = await fritz.getWlanKey(options)

  const hasPassword = await fritz.isWlanEncrypted(options)
  if (hasPassword.error) {
    console.log('Error:', hasPassword.error.message)
    process.exit(1)
  } else {
    console.log((hasPassword) ? 'The WLAN of this Fritz!Box is password protected.' : 'The WLAN of this Fritz!Box is not password protected.')
  }

  if (key.error) {
    console.log('Error:', key.error.message)
    process.exit(1)
  } else {
    console.log('The WLAN key of this Fritz!Box is', key)
  }

  const method = await fritz.getWlanWPAType(options)
  if (method.error) {
    console.log('Error:', method.error.message)
    process.exit(1)
  } else {
    console.log('The WLAN encryption method of this Fritz!Box is', method)
  }
}
key()
