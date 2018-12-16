const fritz = require('../index.js')
const options = require('../package.json').options
const phonebookId = 0

async function getPhonebook () {
  const phonebook = await fritz.getPhonebook(phonebookId, options)

  if (phonebook.error) {
    console.log('Error:', phonebook.error.message)
    process.exit(1)
  }

  console.log('Got', phonebook.length, 'contact(s).')
  if (phonebook.length > 0) {
    console.log('Name of first contact is', phonebook[0].name)
  }
}

getPhonebook()
