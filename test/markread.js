const fritz = require('../index.js')
const options = require('../package.json').options
const messageId = 20

async function markasread () {
  const status = await fritz.markTamMessageAsRead(messageId, options)
  if (status.error) {
    console.log('Error:', status.error.message)
    process.exit(1)
  }

  console.log('Marked message as read', status)
}

markasread()
