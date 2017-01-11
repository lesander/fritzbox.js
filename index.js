/**
 * Fritz!Box API
 * https://git.io/fritzbox
 */

const request = require('request-promise')
let fritz = {}


/**
 * Send a request to the Fritz!Box.
 * @param  {string} path    Path to request
 * @param  {string} method  Request method
 * @param  {object} options Options object
 * @return {promise}        Body of response
 */
fritz.request = (path, method, options) => {
  return new Promise(function(resolve, reject) {

    options.protocol = options.protocol || 'GET'

    // Set the options for the request.
    const requestOptions = {
      uri: options.protocol + '://' + options.server + path,
      method: method || 'GET',
      resolveWithFullResponse: true
    }

    // Execute HTTP(S) request.
    request(requestOptions)
    .then((response) => {
      return resolve(response)
    })
    .catch((error) => {
      console.log('[FritzBox.js] Request failed.', error)
      return reject(error)
    })

  })
}


/**
 * Login to the Fritz!Box and obtain a sessionID.
 * @param  {object} options Options object
 * @return {string}         sessionID
 */
fritz.getSessionID = (options) => {
  return new Promise(function(resolve, reject) {

    // Request a challenge.
    fritz.request('/login_sid.lua', 'GET', options)

    // Solve the presented challenge.
    .then((response) => {
      const challenge = response.body.match('<Challenge>(.*?)</Challenge>')[1]

      const buffer = Buffer(challenge + '-' + options.password, 'UTF-16LE')
      const challengeResponse = challenge + '-' + require('crypto').createHash('md5').update(buffer).digest('hex')
      const path = "/login_sid.lua?username=" + options.username + "&response=" + challengeResponse

      return fritz.request(path, 'GET', options)
    })

    // Obtain the SID.
    .then((response) => {
      const sessionID = response.body.match("<SID>(.*?)</SID>")[1]

      if (sessionID === '0000000000000000') return false

      return resolve(sessionID)
    })

    // Catch errors.
    .catch((error) => {
      console.log('[FritzBox.js] getSessionID failed.', error)
      return reject(error)
    })

  })
}


/**
 * Export Fritz.
 */
module.exports = fritz
