const fritz = require('../index.js')
const options = require('../package.json').options
const fs = require('fs')

async function getCounterInfo () {
  const sessionId = await fritz.getSessionId(options)
  options.sid = sessionId

  const counterInfo = await fritz.getCounter(options)

  if (counterInfo.error) {
    console.log('Error:', counterInfo.error.message)
    process.exit(1)
  }

  fs.writeFileSync('counterInfo.json', JSON.stringify(counterInfo, null, 2))
}

getCounterInfo()
