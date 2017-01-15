const fritz = require('../index.js')
const options = require('../package.json').options
const fs = require('fs')
console.log(options)
fritz.getCalls(options)
.then((calls) => {
  console.log('Got array of ', calls.length, ' calls.')
  fs.writeFileSync('calls.json', JSON.stringify(calls, null, 2))
})
.catch((error) => {
  console.log('Error:', error)
})
