/**
 * FritzBox.js
 * https://git.io/fritzbox
 * Licensed under the MIT License.
 * Copyright (c) 2017 Sander Laarhoven All Rights Reserved.
 */

const request = require('request-promise')

let fritzRequest = {}

/**
 * Send a request to the Fritz!Box.
 * @param  {string} path    Path to request
 * @param  {string} method  Request method
 * @param  {object} options Options object
 * @return {promise}        Body of response
 */
fritzRequest.request = (path, method, options) => {
  return new Promise(function (resolve, reject) {
    options.protocol = options.protocol || 'GET'

    // Add SID to path if one has been given to us.
    if (options.sid) {
      path += '&sid=' + options.sid
    }

    // Set the options for the request.
    const requestOptions = {
      uri: options.protocol + '://' + options.server + path,
      method: method || 'GET',
      resolveWithFullResponse: true,
      rejectUnauthorized: false
    }

    // Execute HTTP(S) request.
    request(requestOptions)
    .then((response) => {
      return resolve(response)
    })
    .catch((error) => {
      console.log('[FritzRequest] Request failed.', error)
      return reject(error)
    })
  })
}

/**
 * Find the cause of a failed request.
 * @param  {object} response HTTP request response
 * @return {string}          Detailed error message
 */
fritzRequest.findFailCause = (response) => {
  console.log('[FritzRequest] HTTP response code was ' + response.statusCode)

  if (response.statusCode === 403) {
    return 'Not authenticated correctly for communication with Fritz!Box.'
  }

  if (response.statusCode === 500) {
    return 'The Fritz!Box encountered an internal server error.'
  }

  if (response.statusCode === 404) {
    return 'Requested page does not exist on the Fritz!Box.'
  }

  return 'Encountered an unexpected error.'
}

/**
 * Export fritzRequest.
 */

module.exports = fritzRequest
