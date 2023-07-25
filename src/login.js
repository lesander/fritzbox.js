
/** @module fritzLogin */

let fritzLogin = {}
export default fritzLogin

/**
 * Login to the Fritz!Box and obtain a sessionId.
 * @param  {Object} options - FritzBox.js options object.
 * @return {string} Returns a sessionId if successful.
 */
fritzLogin.getSessionId = async (options) => {
  // If a session ID is already set, we return that value!
  if (options.sid) return options.sid

  // Request a challenge for us to solve.
  const response = await fritzRequest.request('/login_sid.lua?version=2', 'GET', options)

  // Return the response error if one has presented itself.
  if (response.error) return response

  // Solve the challenge.
  const challenge = response.body.match('<Challenge>(.*?)</Challenge>')[1]
  const challengeAnswer = await solveChallenge(challenge, options)

  // Send our answer to the Fritz!Box.
  const path = '/login_sid.lua?version=2'
  const params = {
    username: options.username,
    response: challengeAnswer
  }
  const formBody = []
  for (const property in params) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(params[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  }

  const responseChallenge = await fritzRequest.request(path, 'POST', options, formBody.join("&"), headers)

  if (responseChallenge.error) return responseChallenge
  
  // Extract the session ID.
  const sessionIdMatch = responseChallenge.body.match('<SID>(.*?)</SID>')
  if (!sessionIdMatch || !sessionIdMatch[1]) {
    return { error: { message: 'Failed to retrieve session ID from Fritz!Box.' } }
  }
  const sessionId = sessionIdMatch[1]

  // Determine if the login worked.
  if (sessionId === '0000000000000000') {
    return { error: { message: 'Could not login to Fritz!Box. Invalid login?' } }
  }

  return sessionId
}

async function solveChallenge (challenge, options) {
  const challengeSplit = challenge.split('$')
  if (challengeSplit[0] === '2') {
    // pbkdf encryption FRITZ!OS 7.24 and later
    const iter1 = parseInt(challengeSplit[1])
    const salt1 = parseHexToIntArray(challengeSplit[2])
    const iter2 = parseInt(challengeSplit[3])
    const salt2 = challengeSplit[4]

    let hash1 = Crypto.pbkdf2Sync(options.password, salt1, iter1, 32, 'sha256')
    let hash2 = Crypto.pbkdf2Sync(hash1, parseHexToIntArray(salt2), iter2, 32, 'sha256')

    return `${salt2}$${hash2.toString('hex').trim()}`
  } else {
    // MD5 encryption
    const buffer = Buffer.from(challenge + '-' + options.password, 'UTF-16LE')
    return challenge + '-' + Crypto.createHash('md5').update(buffer).digest('hex')
  }
}

function parseHexToIntArray (hexNumber) {
  if (hexNumber.length % 2 !== 0) throw new Error('String has an invalid length for a hex string')
  let intArray = []
  for (let iIndex = 0; iIndex < hexNumber.length; iIndex += 2) {
    try {
      intArray.push(parseInt(hexNumber.substr(iIndex, 2), 16))
    } catch (exception) {
      throw new Error('Invalid hex string')
    }
  }
  return new Uint8Array(intArray)
}

// <3 Circular dependencies...
// https://stackoverflow.com/a/32428290/1878974
import fritzRequest from './request.js'
import Crypto from 'crypto'
import Buffer from 'node:buffer'
