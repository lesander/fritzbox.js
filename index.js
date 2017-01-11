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

    .then((sid) => {
      options.sid = sid
      return fritz.request('/fon_num/foncalls_list.lua?csv=', 'GET', options)
    })

    .then((response) => {
      // TODO: check body response.
      return response
    })

    .then((response) => {
      let csv = response.body
                .replace('sep=;', '')
                .replace('Extension;Telephone number', 'Extension;NumberSelf')
                .replace('Telephone number', 'Number')
                .trim()
      let formattedBody = csvjson.toObject(csv, {delimiter: ';'})
      return resolve(formattedBody)
    })

    .catch((error) => {
      console.log('[FritzBox.js] getCalls failed.', error)
      return reject(error)
    })

  })
}


/**
 * Get all smart devices and groups.
 * @param  {object} options
 * @return {Promise}
 */
fritz.getSmartDevices = (options) => {
  return new Promise(function(resolve, reject) {

    fritz.getSessionID(options)

    .then((sid) => {
      options.sid = sid
      return fritz.request('/myfritz/areas/homeauto.lua?ajax_id=1&cmd=getData', 'GET', options)
    })

    .then((response) => {
      // TODO: check body response.
      return response
    })

    .then((response) => {
      return resolve(response.body)
    })

    .catch((error) => {
      console.log('[FritzBox.js] getSmartDevices failed.', error)
      return reject(error)
    })

  })
}


/**
 * Toggle a Fritz DECT switch on or off.
 * @param  {integer} deviceID
 * @param  {integer} value    1 (on) or 0 (off)
 * @param  {object} options
 * @return {Promise}
 */
fritz.toggleSwitch = (deviceID, value, options) => {
  return new Promise(function(resolve, reject) {

    fritz.getSessionID(options)
    .then((sid) => {
      options.sid = sid
      let path = '/myfritz/areas/homeauto.lua?ajax_id='+Math.floor(Math.random()*1000,2)+'&cmd=switchChange&cmdValue=' +
                 value + '&deviceId=' + deviceID
      return fritz.request(path, 'GET', options)
    })

    .then((response) => {
      // TODO: check body response.
      return response
    })

    .then((response) => {
      return resolve(response.body)
    })

    .catch((error) => {
      console.log('[FritzBox.js] toggleSwitch failed.', error)
      return reject(error)
    })

  })
}


/**
 * Get Telephone Answering Machine (TAM) Messages.
 * @param  {object} options Options object
 * @return {Promise}        Object with messages
 */
fritz.getTamMessages = (options) => {
  return new Promise(function(resolve, reject) {

    fritz.getSessionID(options)
    .then((sid) => {
      options.sid = sid
      return fritz.request('/myfritz/areas/answer.lua?ajax_id=1', 'GET', options)
    })

    .then((response) => {
      // TODO: check body response.
      return response
    })

    .then((response) => {
      return resolve(response.body)
    })

    .catch((error) => {
      console.log('[FritzBox.js] getTamMessages failed.', error)
      return reject(error)
    })

  })
}


/**
 * Download a message from the Telephone Answering Machine (TAM).
 * @param  {string} messagePath
 * @param  {object} options
 * @return {Promise}
 */
fritz.downloadTamMessage = (messagePath, options) => {
  return new Promise(function(resolve, reject) {

    fritz.getSessionID(options)
    .then((sid) => {
      options.sid = sid
      const path = '/myfritz/cgi-bin/luacgi_notimeout' +
                   '?cmd=tam&script=/http_file_download.lua' +
                   '&cmd_files=' + messagePath
      return fritz.request(path, 'GET', options)
    })

    .then((response) => {
      // TODO: check body response.
      return response
    })

    .then((response) => {
      return resolve(response)
    })

    .catch((error) => {
      console.log('[FritzBox.js] getTamMessages failed.', error)
      return reject(error)
    })

  })

}


/**
 * Export Fritz.
 */
module.exports = fritz
