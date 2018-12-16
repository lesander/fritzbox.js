
/** @module fritzSystem */

let fritzSystem = {}
module.exports = fritzSystem

const fritzRequest = require('./request.js')
const fritzFormat = require('./format.js')

/**
 * Get all the publicly available Fritz!Box information in raw format.
 *
 * The structure of the object returned can change depending on the Fritz!OS
 * version. Use fritzSystem specific functions (when available)
 * or getBoxInfo if you require backwards-compatibility.
 * @param  {Object} options - FritzBox.js options object.
 * @return {Object}
 */
fritzSystem.getRawBoxInfo = async (options) => {
  // Request the xml file.
  options.noAuth = true
  const rawXml = await fritzRequest.request('/jason_boxinfo.xml', 'GET', options)
  if (rawXml.error) return rawXml

  // Convert the xml object to json.
  const object = await fritzFormat.xmlToObject(rawXml.body)

  return object
}

/**
 * Get all the publicly available Fritz!Box information.
 *
 * This function is backwards-compatible and returns a
 * predefined set of readable key-value pairs.
 * @param  {Object} options - FritzBox.js options object.
 * @return {Object}
 */
fritzSystem.getBoxInfo = async (options) => {
  const rawBoxInfo = await fritzSystem.getRawBoxInfo(options)

  // j:UpdateConfig probably is AVM's version numbering of the
  // format of this XML file.

  let boxInfo = {
    'name': rawBoxInfo['j:BoxInfo']['j:Name'][0],
    'serialnumber': rawBoxInfo['j:BoxInfo']['j:Serial'][0],
    'manufacturer': rawBoxInfo['j:BoxInfo']['j:OEM'][0],
    'version': {
      'software': rawBoxInfo['j:BoxInfo']['j:Version'][0],
      'hardware': rawBoxInfo['j:BoxInfo']['j:HW'][0],
      'hardware_revision': rawBoxInfo['j:BoxInfo']['j:Revision'][0]
    },
    'configuration': {
      'language': rawBoxInfo['j:BoxInfo']['j:Lang'][0],
      'annex': rawBoxInfo['j:BoxInfo']['j:Annex'][0],
      'country': rawBoxInfo['j:BoxInfo']['j:Country'][0]
    }
  }

  return boxInfo
}

/**
 * Get the version of a Fritz!Box without authentication.
 * @param  {Object} options - FritzBox.js options object.
 * @return {string} The Fritz!OS version as a string (e.g. `'06.83'`)
 */
fritzSystem.getVersion = async (options) => {
  const boxInfo = await fritzSystem.getBoxInfo(options)

  const fullVersion = boxInfo['version']['software']

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
 * Get the system name of the Fritz!Box.
 * @param  {Object} options - FritzBox.js options object.
 * @return {string} The Fritz!Box system name.
 */
fritzSystem.getName = async (options) => {
  const boxInfo = await fritzSystem.getBoxInfo(options)

  const systemName = boxInfo['name']
  return systemName
}
