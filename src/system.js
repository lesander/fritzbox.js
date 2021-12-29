
/** @module fritzSystem */

let fritzSystem = {}
module.exports = fritzSystem

const fritzRequest = require('./request.js')
const fritzFormat = require('./format.js')

const counterInfoRegex = new RegExp(/\{(.*?)\}}/)

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

/**
 * Get the online counter information
 * @param  {Object}  options counter options
 * @return {number} The parsed object with counter information
 */
fritzSystem.getCounter = async (options) => {
  if (options.sid) {
    options.noAuth = true
  }

  const response = await fritzRequest.request(
    '/data.lua',
    'POST',
    options,
    false,
    false,
    {
      xhr: 1,
      page: 'netCnt',
      sid: options.sid
    }
  )
  if (response.error) return response

  const counterInfoRegexResult = counterInfoRegex.exec(response.body)
  let counterInfo = counterInfoRegexResult[0]

  if (!counterInfo) {
    return { error: { message: 'Could not find counter information', raw: response } }
  }

  try {
    return JSON.parse(counterInfo)
  } catch (e) {
    return { error: { message: 'Could not parse information', raw: response } }
  }
}
