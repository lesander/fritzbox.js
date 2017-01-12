const fritz = require('../index.js')
const options = require('../package.json').options
console.log(options)

function toggle (id, value) {
  fritz.toggleSwitch(id, value, options)
  .then((result) => {
    console.log('Switch toggle:', result)
  })
  .catch((error) => {
    console.log('Error:', error)
  })
}

function on () {
  toggle(16, 1)
}

function off () {
  toggle(16, 0)
}

setTimeout(off, 2000)
setTimeout(on, 2000)
setTimeout(off, 2000)
