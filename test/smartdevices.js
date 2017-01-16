const fritz = require('../index.js')
const options = require('../package.json').options
console.log(options)
fritz.getSmartDevices(options)
.then((devices) => {
  console.log('Got ', devices.length, ' DECT Smart Home devices.')
})
.catch((error) => {
  console.log('Error:', error)
})
