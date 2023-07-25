import fritz from '../index.js'
import pckJson from '../package.json' assert {type:'json'}
import fs from 'fs'

async function calls () {
  const calls = await fritz.getCalls(pckJson.options)
  if (calls.error) {
    console.log('Error:', calls.error.message)
    process.exit(1)
  } else {
    console.log('Got array of ', calls.length, ' calls.')
    fs.writeFileSync('calls.json', JSON.stringify(calls, null, 2))
  }
}

calls()
