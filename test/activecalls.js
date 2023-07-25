import fritz from '../index.js'
import pckJson from '../package.json' assert {type:'json'}

async function activecalls () {
  const calls = await fritz.getActiveCalls(pckJson.options)

  if (calls.error) {
    console.log('Error:', calls.error.message)
    process.exit(1)
  }

  console.log('Currently there are/is ' + calls.length + ' active call(s).')
}
activecalls()
