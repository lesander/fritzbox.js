/**
 * @module fritzRequest
 * @ignore
 */

import fetch from 'node-fetch'
import https from 'https'
import FormData from 'form-data'

const httpsAgent = new https.Agent({
  // Disable SSL verification since the Fritz.box endpoint is not secure enough
  // The certificate uses a weak Diffie-Hellman key and is vulnerable to a Logjam Attack
  rejectUnauthorized: false
})
let fritzRequest = {}
export default fritzRequest
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
  console.debug('PATH: ' + path)
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

  if (options.sid && options.removeSidFromUri !== true && options.noAuth !== true) {
    // Add SID to path if one has been given to us.
    body['sid'] = options.sid
  }

  if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    const encodedForm = []
    for (const property in body) {
      const encodedKey = encodeURIComponent(property)
      const encodedValue = encodeURIComponent(body[property])
      encodedForm.push(`${encodedKey}=${encodedValue}`)
    }
    body = encodedForm.join('&')
  } else if (headers['Content-Type'] === 'multipart/form-data') {
    const form = new FormData()
    for (const property in body) {
      form.append(property, body[property])
    }
    body = form
  }

  if (method === 'GET') {
    for (const key in body) {
      if (!path.endsWith('&') || !path.endsWith('?')) {
        path += '&'
      }
      path += `${key}=${body[key]}`
    }
    body = undefined
  }

  // Set the options for the request.
  const uri = `${options.protocol}://${options.server}${path}`
  console.debug('uri: ', uri, 'headers: ', headers, 'method: ', method, 'body: ', body)
  // Execute HTTP(S) request.
  const fetchResponse = await fetch(uri, {
    headers: headers,
    method: method || 'GET',
    body: body,
    agent: httpsAgent
  })
  if (fetchResponse.ok) {
    const response = {
      body: await fetchResponse.text(),
      headers: fetchResponse.headers
    }
    console.debug('response fetch', response)
    return response
  } else {
    return fritzRequest.findFailCause(fetchResponse)
  }
}

/**
 * Find the cause of a failed request.
 *
 * @private
 * @param  {Response} response HTTP request response
 * @return {string}          Detailed error message
 */
fritzRequest.findFailCause = (response) => {
  switch (response.status) {
    case 403:
      return { error: { message: 'Not authenticated correctly for communication with Fritz!Box.' } }
    case 404:
      return { error: { message: 'Requested page does not exist on the Fritz!Box.' } }
    case 500:
      return { error: { message: 'The Fritz!Box encountered an internal server error.' } }
    default:

      if (response.message) {
        return { error: { message: response.statusText } }
      }

      return { error: { message: 'Encountered an unexpected error.', raw: response } }
  }
}

// <3 Circular dependencies...
// https://stackoverflow.com/a/32428290/1878974
import fritzLogin from './login.js'

