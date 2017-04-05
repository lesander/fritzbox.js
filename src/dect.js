/**
 * FritzBox.js
 * Licensed under the MIT License.
 * Copyright (c) 2017 Sander Laarhoven All Rights Reserved.
 *
 * Compiled using Babel (https://babeljs.io)
 * and Browserify (http://browserify.org/)
 *
 * Human readable source-code available on GitHub.
 * https://git.io/fritzbox
 */

let fritzDect = {}

const fritzLogin = require('./login.js')
const fritzRequest = require('./request.js')

/**
 * Get all smart devices and groups.
 * @param  {object} options
 * @return {object}
 */
fritzDect.getSmartDevices = async (options) => {
  const path = '/myfritz/areas/homeauto.lua?ajax_id=1&cmd=getData'
  const response = await fritzRequest.request(path, 'GET', options)

  if (response.error) return response

  return JSON.parse(response.body).devices
}

/**
 * Toggle a Fritz DECT switch on or off.
 * @param  {integer} deviceId
 * @param  {integer} value    1 (on) or 0 (off)
 * @param  {object} options
 * @return {object}
 */
fritzDect.toggleSwitch = async (deviceId, value, options) => {
  const version = await fritzLogin.getVersionNumber(options)
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

/**
 * Export fritzDect.
 */

module.exports = fritzDect
