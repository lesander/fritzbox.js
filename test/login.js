import fritz  from '../index.js'
import pckJson from '../package.json' assert { type: 'json'}

async function login () {
  const sessionId = await fritz.getSessionId(pckJson.options)
  if (sessionId.error) {
    console.log('Error:', sessionId.error.message)
    process.exit(1)
  } else {
    console.log('SID:', sessionId)
  }
}
login()
