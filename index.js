/**
 * Fritz!Box API
 * https://git.io/fritzbox
 */

const request = require('request-promise')
const csvjson = require('csvjson')
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

    // Add SID to path if one has been given to us.
    if (options.sid) {
      path += '&sid=' + options.sid
    }

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
 * Get a list of telephone calls.
 * @param  {object} options Options object
 * @return {Promise}        Object with telephony calls.
 */
fritz.getCalls = (options) => {
  return new Promise(function(resolve, reject) {

    fritz.getSessionID(options)

    // Request all Fritz!Fon calls.
    .then((sid) => {
      options.sid = sid
      return fritz.request('/fon_num/foncalls_list.lua?csv=', 'GET', options)
    })

    // Check response.
    .then((response) => {
      // TODO: check body response.
      return response
    })

    // Format returned csv.
    .then((response) => {
      let csv = response.body
                .replace('sep=;', '')
                .replace('Extension;Telephone number', 'Extension;NumberSelf')
                .replace('Telephone number', 'Number')
                .trim()
      let formattedBody = csvjson.toObject(csv, {delimiter: ';'})
      return resolve(formattedBody)
    })

    // Catch errors.
    .catch((error) => {
      console.log('[FritzBox.js] getCalls failed.', error)
      return reject(error)
    })

  })
}

/**
 * Export Fritz.
 */
module.exports = fritz
