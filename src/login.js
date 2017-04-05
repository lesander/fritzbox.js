/**
 * FritzBox.js
 * Licensed under the MIT License.
 * Copyright (c) 2017 Sander Laarhoven All Rights Reserved.
 *
 * Source-code available on GitHub.
 * https://git.io/fritzbox
 */

let fritzLogin = {}
module.exports = fritzLogin

/**
 * Login to the Fritz!Box and obtain a sessionId.
 * @param  {object} options Options object
 * @return {string}         sessionId
 */
fritzLogin.getSessionId = async (options) => {
  // If a session ID is already set, we return that value!
  if (options.sid) return options.sid

  // Request a challenge for us to solve.
  const response = await fritzRequest.request('/login_sid.lua', 'GET', options)

  // Return the response error if one has presented itself.
  if (response.error) return response

  // Solve the challenge.
  const challenge = response.body.match('<Challenge>(.*?)</Challenge>')[1]
  const buffer = Buffer(challenge + '-' + options.password, 'UTF-16LE')
  const challengeAnswer = challenge + '-' + require('crypto').createHash('md5').update(buffer).digest('hex')

  // Send our answer to the Fritz!Box.
  const path = '/login_sid.lua?username=' + options.username + '&response=' + challengeAnswer
  const challengeResponse = await fritzRequest.request(path, 'GET', options)

  if (challengeResponse.error) return challengeResponse

  // Extract the session ID.
  const sessionId = challengeResponse.body.match('<SID>(.*?)</SID>')[1]

  // Determine if the login worked.
  if (sessionId === '0000000000000000') {
    return { error: 'Could not login to Fritz!Box. Invalid login?' }
  }

  return sessionId
}

/**
 * Get the version of a Fritz!Box without authentication.
 * @param  {Object}  options server protocol
 * @return {String}  '06.83'
 */
fritzLogin.getVersion = async (options) => {
  options.noAuth = true
  const rawXml = await fritzRequest.request('/jason_boxinfo.xml', 'GET', options)
  if (rawXml.error) return rawXml

  const object = await fritzFormat.xmlToObject(rawXml.body)
  const fullVersion = object['j:BoxInfo']['j:Version'][0]

  let parts = fullVersion.split('.')
  const OSVersion = parts[1] + '.' + parts[2]
  return OSVersion
}

/**
 * Get the version of a Fritz!Box without authentication.
 * @param  {object}  options server protocol
 * @return {Number}          '683'
 */
fritzLogin.getVersionNumber = async (options) => {
  const version = await fritzLogin.getVersion(options)
  if (version.error) return version
  const versionNumber = parseInt(version.replace('.', ''))
  return versionNumber
}

/**
 * <3 Circular dependencies...
 * https://stackoverflow.com/a/32428290/1878974
 */
const fritzRequest = require('./request.js')
const fritzFormat = require('./format.js')
