const fritz = require('../index.js')
const options = require('./env.js')

async function log () {
  const systemLog = await fritz.getSystemLog(options)
  if (systemLog.error) {
    console.log('Error:', systemLog.error.message)
    process.exit(1)
  } else {
    console.log('System log has', systemLog.length, 'entries.')
  }
}
log()
