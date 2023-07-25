/**
 * @module fritzRequest
 * @ignore
 */

import fetch from 'node-fetch';
import https from 'https';

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
 * @param  {string}       path            Path to request
 * @param  {string}       method          Request method
 * @param  {Object}       options         Options object
 * @param  {HeadersInit}  headers
 * @param  {Object}       body
 * @param  {string}       pipe
 * @return {Object}                    Request response object
 */
fritzRequest.request = async (path, method, options, body = {}, headers = {}) => {
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
  if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    const formBody = []
    for (const property in body) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(body[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    body = formBody.join("&")
  } else if (options.sid && options.removeSidFromUri !== true && options.noAuth !== true) {
    // Add SID to path if one has been given to us.
    body['sid'] = options.sid
  }

  if (method === 'POST') {

  }  else if (method === 'GET'){
    for (const key in body) {
      if (!path.endsWith('&') || !path.endsWith('?')) {
        path += '&'
      }
      path += `${key}=${body[key]}`
    }
    body = undefined;
  }

  // Set the options for the request.
  const uri = options.protocol + '://' + options.server + path
  console.log('headers: ', headers)
  console.log('method: ', method)
  console.log('body: ', body)
  // Execute HTTP(S) request.
  try {
    const fetchResponse =  await fetch(uri, {
      headers: headers,
      method: method || 'GET',
      body: body,
      agent: httpsAgent
    })
    const response = {
      body: await fetchResponse.text()
    }
    console.log('response fetch', response)
    return response
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

