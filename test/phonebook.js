import fritz from '../index.js'
import pckJson from '../package.json' assert {type:'json'}
const phonebookId = 0

async function getPhonebook () {
  const phonebook = await fritz.getPhonebook(phonebookId, pckJson.options)

  if (phonebook.error) {
    console.log('Error: ', phonebook.error.message)
    process.exit(1)
  }

  console.log('Got ', phonebook.length, ' contacts.')
}

getPhonebook()
