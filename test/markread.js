const fritz = require('../index.js')
const options = require('../package.json').options
console.log(options)
fritz.markTamMessageAsRead(15, options)
.then((messages) => {
  console.log('Marked message as read.')
  console.log(messages)
})
.catch((error) => {
  console.log('Error:', error)
})
