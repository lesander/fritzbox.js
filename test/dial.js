const fritz = require('../index.js')
const options = require('../package.json').options
const number = '***REMOVED***'
fritz.dialNumber(number, options)
.then((status) => {
  console.log('Now calling.', status)
})
.catch((error) => {
  console.log('Error', error)
})
