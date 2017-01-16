const fritz = require('../index.js')
const options = require('../package.json').options
console.log(options)
const phonebookId = 0
const localPath = '/Users/sander/Desktop/phonebook-0.json'
fritz.downloadPhonebook(phonebookId, localPath, options)
.then((message) => {
  console.log(JSON.stringify(message, null, 2))
})
.catch((error) => {
  console.log('Error:', error)
})
