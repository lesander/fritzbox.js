/**
 * @module fritzRequest
 * @ignore
 */

import fetch from 'node-fetch';
import request from 'request-promise'
import requestNoPromise from 'request'
import fs  from 'fs'
import https from'https';

const httpsAgent = new https.Agent({
    //Disable SSL verification since the Fritz.box endpoint is not secure enough
    //The certificate uses a weak Diffie-Hellman key and is vulnerable to a Logjam Attack
      rejectUnauthorized: false,
    });
let fritzRequest = {}
export default  fritzRequest

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
fritzRequest.request = async (path, method, options, pipe = false, formData = false, formUrlEncoded = false, params, headers) => {
  console.log("PATH: " + path)
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
  if (!params) {
    params = {};
  }

  // Add SID to path if one has been given to us.
  if (options.sid && options.removeSidFromUri !== true && options.noAuth !== true) {
    params['sid'] = options.sid
  }

  let body;
  if (method === 'POST') {
    body = params
  }  else {
      for (const key in params) {
          if (!path.endsWith('&') || !path.endsWith('?')) {
              path += '&'
          }
          path += `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      };
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
  if (false) {
    let stream = requestNoPromise(requestOptions).pipe(fs.createWriteStream(pipe))
    stream.on('finish', () => {
      return { message: 'File has been saved to ' + pipe }
    })
  }

  // Execute HTTP(S) request.
  try {
    // response = await request(requestOptions)
    console.log(requestOptions.uri)
    console.log(method)
    console.log(body)

    const response =  await fetch(requestOptions.uri, {
      headers: headers,
      method: method || 'GET',
      body: body,
      agent: httpsAgent
    })
    const xmlResponse = await response.text();
    
    return xmlResponse
  } catch (error) {
    return fritzRequest.findFailCause(error)
  }

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
import fritzLogin from './login.js'

