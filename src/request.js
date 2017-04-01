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

const request = require('request-promise')
const requestNoPromise = require('request')
const fs = require('fs')

let fritzRequest = {}

/**
 * Send a request to the Fritz!Box.
 * @param  {string} path    Path to request
 * @param  {string} method  Request method
 * @param  {object} options Options object
 * @return {promise}        Body of response
 */
fritzRequest.request = (path, method, options, pipe = false, formData = false, formUrlEncoded = false) => {
  return new Promise(function (resolve, reject) {
    options.protocol = options.protocol || 'GET'

    // Make sure we have the required options.
    if (!options.server || options.server === '') {
      // We should probably check for more config settings..
      return reject('Missing login config.')
    }

    if (typeof options.removeSidFromUri === 'undefined') {
      options.removeSidFromUri = false
    }

    // Add SID to path if one has been given to us.
    if (options.sid && !options.removeSidFromUri) {
      path += '&sid=' + options.sid
    }

    // Set the options for the request.
    let requestOptions = {
      uri: options.protocol + '://' + options.server + path,
      method: method || 'GET',
      resolveWithFullResponse: true,
      rejectUnauthorized: false
    }

    if (formData) {
      requestOptions.formData = formData
    }

    if (formUrlEncoded) {
      requestOptions.form = formUrlEncoded
    }

    // Pipe a file to disk.
    if (pipe) {
      let stream = requestNoPromise(requestOptions).pipe(fs.createWriteStream(pipe))
      stream.on('finish', () => {
        return resolve('File has been saved to ' + pipe)
      })
    }

    // Execute HTTP(S) request.
    request(requestOptions)
    .then((response) => {
      return resolve(response)
    })
    .catch((error) => {
      console.log('[FritzRequest] Request failed.')
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
