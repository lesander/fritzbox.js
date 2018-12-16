const fritz = require('../index.js')
const options = require('./env.js')

async function update () {
  const updateAvailable = await fritz.updateAvailable(options)
  if (updateAvailable.error) {
    console.log('Error:', updateAvailable.error.message)
    process.exit(1)
  } else {
    console.log((updateAvailable === true) ? 'There is an update available for Fritz!OS.' : 'Fritz!OS is up-to-date.')
  }
}
update()
