const fritz = require('../index.js')
const options = require('../package.json').options
const fs = require('fs')

async function tam () {
  const messages = await fritz.getTamMessages(options)

  if (messages.error) {
    console.log('Error:', messages.error.message)
    process.exit(1)
  }

  console.log('Got ', messages.length, ' TAM messages.')

  let newTam = 0

  for (var tam in messages) {
    if (messages[tam].isNewMessage) {
      newTam++
      console.log(messages[tam])
    }
  }

  console.log('There are/is ', newTam, ' new TAM message(s).')

  fs.writeFileSync('tam.json', JSON.stringify(messages, null, 2))
}

tam()
