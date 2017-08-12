const fritz = require('../index.js')
const options = require('../package.json').options
const messagePath = '/data/tam/rec/rec.0.020'
const localPath = './test/rec20.wav'

async function download () {
  const status = await fritz.downloadTamMessage(messagePath, localPath, options)

  if (status.error) {
    console.log('Error:', status.error.message)
    process.exit(1)
  }

  console.log(status.message)
}
download()
