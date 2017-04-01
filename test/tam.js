const fritz = require('../index.js')
const options = require('../package.json').options
const fs = require('fs')

async function tam() {
  const messages = await fritz.getTamMessages(options)

  if (messages.error) {
    console.log('Error:', messages.error.message)
    process.exit(1)
  }

  console.log('Got ', messages.length, ' TAM messages.')
  fs.writeFileSync('tam.json', JSON.stringify(messages, null, 2))

}

tam()
