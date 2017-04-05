const fritz = require('../index.js')
const options = require('../package.json').options

async function login () {
  const sessionId = await fritz.getSessionId(options)
  if (sessionId.error) {
    console.log('Error:', sessionId.error.message)
    process.exit(1)
  } else {
    console.log('SID:', sessionId)
  }
}
login()
