const fritz = require('../index.js')
const options = require('../package.json').options
console.log(options)
fritz.getCalls(options)
.then((calls) => {
  console.log('Calls:',calls)
})
.catch((error) => {
  console.log('Error:',error)
})
