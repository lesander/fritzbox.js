
/** @module fritzLogin */

let fritzLogin = {}
module.exports = fritzLogin

/**
 * Login to the Fritz!Box and obtain a sessionId.
 * @param  {Object} options - FritzBox.js options object.
 * @return {string} Returns a sessionId if successful.
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
  const buffer = Buffer.from(challenge + '-' + options.password, 'UTF-16LE')
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

// <3 Circular dependencies...
// https://stackoverflow.com/a/32428290/1878974
const fritzRequest = require('./request.js')
