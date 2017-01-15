const fritz = require('../index.js')
const options = require('../package.json').options
console.log(options)
const messagePath = '/data/tam/rec/rec.0.005'
const localPath = './test/rec05.wav'
fritz.downloadTamMessage(messagePath, localPath, options)
.then((message) => {
  console.log(message)
})
.catch((error) => {
  console.log('Error:', error)
})
