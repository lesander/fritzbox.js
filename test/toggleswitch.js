const fritz = require('../index.js')
const options = require('../package.json').options

const id = process.argv[2]
const state = process.argv[3]

function toggle (id, value) {
  fritz.toggleSwitch(id, value, options)
  .then((result) => {
    console.log('Switch toggle:', result)
  })
  .catch((error) => {
    console.log('Error:', error)
  })
}
toggle(id, state)
