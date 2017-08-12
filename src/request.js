/**
 * @module fritzRequest
 * @ignore
 */

const request = require('request-promise')
const requestNoPromise = require('request')
const fs = require('fs')

let fritzRequest = {}
module.exports = fritzRequest

/**
 * Send a request to the Fritz!Box.
 *
 * @private
 * @param  {string}   path            Path to request
 * @param  {string}   method          Request method
 * @param  {Object}   options         Options object
 * @param  {string}   pipe
 * @param  {Object}   formData
 * @param  {boolean}  formUrlEncoded
 * @return {Object}                    Request response object
 */
fritzRequest.request = async (path, method, options, pipe = false, formData = false, formUrlEncoded = false) => {
  options.protocol = options.protocol || 'https'

  // Make sure we have the required options.
  if (!options.server || options.server === '') {
    // We should probably check for more config settings..
    return { error: 'Missing login config.' }
  }

  // Obtain a session id if none was given to us.
  if (!options.sid && !path.includes('/login_sid.lua') && options.noAuth !== true) {
    const sessionId = await fritzLogin.getSessionId(options)
    if (sessionId.error) return sessionId
    options.sid = sessionId
  }

  if (typeof options.removeSidFromUri === 'undefined') {
    options.removeSidFromUri = false
  }

  // Add SID to path if one has been given to us.
  if (options.sid && options.removeSidFromUri !== true && options.noAuth !== true) {
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
      return { message: 'File has been saved to ' + pipe }
    })
  }

  // Execute HTTP(S) request.
  let response = null
  try {
    response = await request(requestOptions)
  } catch (error) {
    return fritzRequest.findFailCause(error)
  }

  /*
  if (response.statusCode !== 200) {
    console.log('is not 200')
    return fritzRequest.findFailCause(response)
  }
  */

  return response
}

/**
 * Find the cause of a failed request.
 *
 * @private
 * @param  {Object} response HTTP request response
 * @return {string}          Detailed error message
 */
fritzRequest.findFailCause = (response) => {
  switch (response.statusCode) {
    case 403:
      return { error: { message: 'Not authenticated correctly for communication with Fritz!Box.' } }
    case 404:
      return { error: { message: 'Requested page does not exist on the Fritz!Box.' } }
    case 500:
      return { error: { message: 'The Fritz!Box encountered an internal server error.' } }
    default:

      if (response.message) {
        return { error: { message: response.message } }
      }

      return { error: { message: 'Encountered an unexpected error.', raw: response } }
  }
}

// <3 Circular dependencies...
// https://stackoverflow.com/a/32428290/1878974
const fritzLogin = require('./login.js')
