const fritz = require('../index.js')
const options = require('../package.json').options
const phonebookId = 0
const localPath = '/Users/sander/Desktop/phonebook-0.json'
fritz.getPhonebook(phonebookId, options)
.then((phonebook) => {
  console.log('Got ', phonebook.length, ' contacts.')
})
.catch((error) => {
  console.log('Error:', error)
})
