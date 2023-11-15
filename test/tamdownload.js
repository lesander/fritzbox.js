import fritz from '../index.js'
import pckJson from '../package.json' assert {type:'json'}
const messagePath = '/data/tam/rec/rec.0.000'
const localPath = './test/rec20.wav'

async function download () {
  const status = await fritz.downloadTamMessage(messagePath, localPath, pckJson.options)

  if (status.error) {
    console.log('Error:', status.error.message)
    process.exit(1)
  }

  console.log(status.message)
}
download()
