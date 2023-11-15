import fritz from '../index.js'
import pckJson from '../package.json' assert {type:'json'}
const messageId = 20

async function markasread () {
  const status = await fritz.markTamMessageAsRead(messageId, pckJson.options)
  if (status.error) {
    console.log('Error:', status.error.message)
    process.exit(1)
  }

  console.log('Marked message as read', status)
}

markasread()
