const fritz = require('../index.js')
const options = require('../package.json').options
console.log(options)
const messagePath = '\/data\/tam\/rec\/rec.0.005'
fritz.downloadTamMessage(messagePath, options)
.then((message) => {
  console.log('TAM message:', message.headers)
})
.catch((error) => {
  console.log('Error:', error)
})
