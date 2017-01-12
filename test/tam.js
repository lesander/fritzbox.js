const fritz = require('../index.js')
const options = require('../package.json').options
console.log(options)
fritz.getTamMessages(options)
.then((messages) => {
  console.log('TAM messages:', messages)
})
.catch((error) => {
  console.log('Error:', error)
})
