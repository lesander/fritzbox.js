const fritz = require('../index.js')
const options = require('./env.js')

const id = 17
const state = 1

async function toggle () {
  const result = await fritz.toggleSwitch(id, state, options)
  if (result.error) {
    console.log('Error:', result.error.message)
    process.exit(1)
  }

  console.log('Toggled switch:', result)
}
toggle()
