/**
 * FritzBox.js
 * https://git.io/fritzbox
 * Licensed under the MIT License.
 * Copyright (c) 2017 Sander Laarhoven All Rights Reserved.
 */

let fritzFon = {}

const fritzLogin = require('./login.js')
const fritzRequest = require('./request.js')

const csvjson = require('csvjson')

/**
 * Get the history of telephone calls.
 * @param  {object} options Options object
 * @return {Promise}        Object with telephony calls.
 */
fritzFon.getCalls = (options) => {
  return new Promise(function (resolve, reject) {
    fritzLogin.getSessionID(options)

    .then((sid) => {
      options.sid = sid
      return fritzRequest.request('/fon_num/foncalls_list.lua?csv=', 'GET', options)
    })

    .then((response) => {
      if (response.statusCode !== 200) {
        return reject(fritzRequest.findFailCause(response))
      }
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
      console.log('[FritzFon] getCalls failed.', error)
      return reject(error)
    })
  })
}

/**
 * Get Telephone Answering Machine (TAM) Messages.
 * @param  {object} options Options object
 * @return {Promise}        Object with messages
 */
fritzFon.getTamMessages = (options) => {
  return new Promise(function (resolve, reject) {
    fritzLogin.getSessionID(options)

    // Use the session id to get a list of the last TAM messages.
    .then((sid) => {
      options.sid = sid
      return fritzRequest.request('/myfritz/areas/answer.lua?ajax_id=1', 'GET', options)
    })

    .then((response) => {
      if (response.statusCode !== 200) {
        return reject(fritzRequest.findFailCause(response))
      }
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
fritzFon.downloadTamMessage = (messagePath, options) => {
  return new Promise(function (resolve, reject) {
    fritzLogin.getSessionID(options)
    .then((sid) => {
      options.sid = sid
      const path = '/myfritz/cgi-bin/luacgi_notimeout' +
                   '?cmd=tam&script=/http_file_download.lua' +
                   '&cmd_files=' + messagePath
      return fritzRequest.request(path, 'GET', options)
    })

    .then((response) => {
      if (response.statusCode !== 200) {
        return reject(fritzRequest.findFailCause(response))
      }
      return response
    })

    .then((response) => {
      return resolve(response)
    })

    .catch((error) => {
      console.log('[FritzFon] getTamMessages failed.', error)
      return reject(error)
    })
  })
}

/**
 * Export fritzFon.
 */

module.exports = fritzFon
