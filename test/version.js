import fritz from '../index.js'
import pckJson from '../package.json' assert {type:'json'}

async function version () {
  const version = await fritz.getVersion(pckJson.options)
  if (version.error) {
    console.log('Error:', version.error.message)
    process.exit(1)
  } else {
    console.log('FritzBox runs on version', version)
  }
}

version()
