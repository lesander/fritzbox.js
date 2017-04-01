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
 * @return {Promise}
 */
fritzDect.getSmartDevices = (options) => {
  return new Promise(function (resolve, reject) {
    fritzLogin.getSessionId(options)

    // Use the session id to obtain the list of registered smart devices.
    .then((sid) => {
      options.sid = sid
      return fritzRequest.request('/myfritz/areas/homeauto.lua?ajax_id=1&cmd=getData', 'GET', options)
    })

    .then((response) => {
      if (response.statusCode !== 200) {
        return reject(fritzRequest.findFailCause(response))
      }
      return response
    })

    .then((response) => {
      return resolve(JSON.parse(response.body).devices)
    })

    .catch((error) => {
      console.log('[FritzDect] getSmartDevices failed.')
      return reject(error)
    })
  })
}

/**
 * Toggle a Fritz DECT switch on or off.
 * @param  {integer} deviceId
 * @param  {integer} value    1 (on) or 0 (off)
 * @param  {object} options
 * @return {Promise}
 */
fritzDect.toggleSwitch = (deviceId, value, options) => {
  return new Promise(function (resolve, reject) {
    fritzLogin.getSessionId(options)

    .then((sid) => {
      options.sid = sid
      let path = '/myfritz/areas/homeauto.lua?ajax_id=' +
                 Math.floor(Math.random() * 1000, 2) +
                 '&cmd=switchChange&cmdValue=' +
                 value + '&deviceId=' + deviceId
      return fritzRequest.request(path, 'GET', options)
    })

    .then((response) => {
      if (response.statusCode !== 200) {
        return reject(fritzRequest.findFailCause(response))
      }
      return response
    })

    .then((response) => {
      return resolve(response.body)
    })

    .catch((error) => {
      console.log('[FritzDect] toggleSwitch failed.')
      return reject(error)
    })
  })
}

/**
 * Export fritzDect.
 */

module.exports = fritzDect
