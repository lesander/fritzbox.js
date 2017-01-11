const fritz = require('../index.js')
const options = require('../package.json').options
fritz.getSessionID(options)
.then((sid) => {
  console.log(sid)
})
