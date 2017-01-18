const fritz = require('../index.js')
const options = require('../package.json').options
fritz.getActiveCalls(options)
.then((calls) => {
  console.log(calls)
})
.catch((error) => {
  console.log('Error:', error)
})
