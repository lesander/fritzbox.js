const fritz = require('../index.js')
const options = require('../package.json').options
const fs = require('fs')
console.log(options)
fritz.getTamMessages(options)
.then((messages) => {
  console.log('Got ', messages.length, ' TAM messages.')
  fs.writeFileSync('tam.json', JSON.stringify(messages, null, 2))
})
.catch((error) => {
  console.log('Error:', error)
})
