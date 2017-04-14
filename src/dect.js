/**
 * Fritz!Box DECT and Smart Home functions.
 * @module fritzDect
 */

let fritzDect = {}

const fritzLogin = require('./login.js')
const fritzRequest = require('./request.js')
const fritzSystem = require('./system.js')

/**
 * Get all smart devices and groups.
 *
 * @param  {Object} options - FritzBox.js options object.
 * @return {Array} An array of all found smart devices.
 */
fritzDect.getSmartDevices = async (options) => {
  const path = '/myfritz/areas/homeauto.lua?ajax_id=1&cmd=getData'
  const response = await fritzRequest.request(path, 'GET', options)

  if (response.error) return response

  return JSON.parse(response.body).devices
}

/**
 * Toggle a Fritz DECT switch on or off.
 * @param  {integer} deviceId - The Id of the smart home device.
 * @param  {integer} value    - Turn on (1) or off (0).
 * @param  {Object} options   - FritzBox.js options object.
 * @return {Object} An object with message and deviceId.
 */
fritzDect.toggleSwitch = async (deviceId, value, options) => {
  const version = await fritzSystem.getVersionNumber(options)
  if (version.error) return version

  let response

  if (version >= 683) {
    // Post 06.83 uses a POST request.

    if (!options.sid) {
      options.sid = await fritzLogin.getSessionId(options)
      if (options.sid.error) return options.sid
    }

    const path = '/myfritz/areas/homeauto.lua'
    const form = {
      sid: options.sid,
      ajax_id: Math.floor(Math.random() * 10000, 2),
      cmd: 'switchChange',
      cmdValue: value,
      deviceId: deviceId
    }
    response = await fritzRequest.request(path, 'POST', options, false, false, form)
  } else {
    // Pre 06.83 used a GET request.
    const path = '/myfritz/areas/homeauto.lua?ajax_id=' +
               Math.floor(Math.random() * 10000, 2) +
               '&cmd=switchChange&cmdValue=' +
               value + '&deviceId=' + deviceId
    response = await fritzRequest.request(path, 'GET', options)
  }

  if (response.error) return response

  const responseObject = JSON.parse(response.body)

  if (responseObject.status !== 'switchStateChangedSend') {
    return { error: { message: 'Switch state not changed.' } }
  }

  return { message: 'Set switch to given state.', deviceId: responseObject.deviceId }
}

// Export fritzDect.

module.exports = fritzDect
