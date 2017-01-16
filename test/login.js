const fritz = require('../index.js')
const options = require('../package.json').options
fritz.getSessionId(options)
.then((sid) => {
  console.log('SID:', sid)
})
.catch((error) => {
  console.log('Error:', error)
})
