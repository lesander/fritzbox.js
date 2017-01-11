const fritz = require('../index.js')
const options = require('../package.json').options
console.log(options)
fritz.getSmartDevices(options)
.then((devices) => {
  console.log('Devices:',devices)
})
.catch((error) => {
  console.log('Error:',error)
})
