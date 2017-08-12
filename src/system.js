
/** @module fritzSystem */

let fritzSystem = {}
module.exports = fritzSystem

const fritzRequest = require('./request.js')
const fritzFormat = require('./format.js')

/**
 * Get the version of a Fritz!Box without authentication.
 * @param  {Object} options - FritzBox.js options object.
 * @return {string} The Fritz!OS version as a string (e.g. `'06.83'`)
 */
fritzSystem.getVersion = async (options) => {
  options.noAuth = true
  const rawXml = await fritzRequest.request('/jason_boxinfo.xml', 'GET', options)
  if (rawXml.error) return rawXml

  const object = await fritzFormat.xmlToObject(rawXml.body)
  const fullVersion = object['j:BoxInfo']['j:Version'][0]

  let parts = fullVersion.split('.')
  const OSVersion = parts[1] + '.' + parts[2]
  return OSVersion
}

/**
 * Get the version of a Fritz!Box without authentication.
 * @param  {Object}  options server protocol
 * @return {number} The Fritz!OS version cast as an integer (e.g. `683`)
 */
fritzSystem.getVersionNumber = async (options) => {
  const version = await fritzSystem.getVersion(options)
  if (version.error) return version
  const versionNumber = parseInt(version.replace('.', ''))
  return versionNumber
}
