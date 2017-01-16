/**
 * FritzBox.js
 * https://git.io/fritzbox
 * Licensed under the MIT License.
 * Copyright (c) 2017 Sander Laarhoven All Rights Reserved.
 */

let fritzFon = {}

const fritzLogin = require('./login.js')
const fritzRequest = require('./request.js')
const fritzFormat = require('./format.js')

/**
 * Get the history of telephone calls.
 * @param  {object} options Options object
 * @return {Promise}        Object with telephony calls.
 */
fritzFon.getCalls = (options) => {
  return new Promise(function (resolve, reject) {
    fritzLogin.getSessionId(options)

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
      return fritzFormat.callsCsvToJson(response.body)
    })

    .then((calls) => {
      return resolve(fritzFormat.calls(calls))
    })

    .catch((error) => {
      console.log('[FritzFon] getCalls failed.')
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
    fritzLogin.getSessionId(options)

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
      return fritzFormat.tamMessages(JSON.parse(response.body).tamcalls)
    })

    .then((messages) => {
      return resolve(messages)
    })

    .catch((error) => {
      console.log('[FritzFon] getTamMessages failed.')
      return reject(error)
    })
  })
}

/**
 * Download a message from the Telephone Answering Machine (TAM).
 * @param  {string} messagePath
 * @param  {string} localPath
 * @param  {object} options
 * @return {Promise}
 */
fritzFon.downloadTamMessage = (messagePath, localPath, options) => {
  return new Promise(function (resolve, reject) {
    fritzLogin.getSessionId(options)
    .then((sid) => {
      options.sid = sid
      const path = '/myfritz/cgi-bin/luacgi_notimeout' +
                   '?cmd=tam&script=/http_file_download.lua' +
                   '&cmd_files=' + messagePath
      return fritzRequest.request(path, 'GET', options, localPath)
    })

    .then((response) => {
      return resolve(response)
    })

    .catch((error) => {
      console.log('[FritzFon] getTamMessages failed.')
      return reject(error)
    })
  })
}

/**
 * Mark a message as read.
 * @param  {number} messageId
 * @param  {object} options
 * @param  {number} [tamId=0]
 * @return {promise}
 */
fritzFon.markTamMessageAsRead = (messageId, options, tamId = 0) => {
  return new Promise(function (resolve, reject) {
    fritzLogin.getSessionId(options)
    .then((sid) => {
      options.sid = sid
      const path = '/fon_devices/tam_list.lua?useajax=1' +
                   '&TamNr=' + tamId +
                   '&idx=' + messageId
      return fritzRequest.request(path, 'GET', options)
    })

    .then((response) => {
      if (response.body === '{"state":1,"cur_idx":1}') {
        return resolve(true)
      } else {
        return reject(false)
      }
    })

    .catch((error) => {
      console.log('[FritzFon] markTamMessageAsRead failed.')
      return reject(error)
    })
  })
}

/**
 * Dial the given number.
 * @param  {number} phoneNumber
 * @return {promise}
 */
fritzFon.dialNumber = (phoneNumber, options) => {
  return new Promise(function (resolve, reject) {
    fritzLogin.getSessionId(options)
    .then((sid) => {
      options.sid = sid
      const path = '/fon_num/foncalls_list.lua?xhr=1' +
                   '&dial=' + phoneNumber
      return fritzRequest.request(path, 'GET', options)
    })

    .then((response) => {
      if (JSON.parse(response.body).err === 0) {
        return resolve('Ringing.. Please pick up your designated handset now.')
      }
      return reject('An error occured while ringing the number.')
    })

    .catch((error) => {
      console.log('[FritzFon] dialNumber failed.')
      return reject(error)
    })
  })
}

/**
 * Download the given telephone book.
 * @param  {number} phonebookId
 * @param  {object} options
 * @return {promise}
 */
fritzFon.downloadPhonebook = (phonebookId = 0, options) => {
  return new Promise(function (resolve, reject) {
    fritzLogin.getSessionId(options)
    .then((sid) => {
      options.sid = sid
      options.removeSidFromUri = true
      const formData = {
        sid: options.sid,
        PhonebookId: phonebookId,
        PhonebookExportName: 'Phonebook',
        PhonebookExport: ''
      }
      return fritzRequest.request('/cgi-bin/firmwarecfg', 'POST', options, false, formData)
    })

    .then((response) => {
      return fritzFormat.xmlToJson(response.body)
    })

    .then((object) => {
      return resolve(fritzFormat.phonebook(object.phonebooks.phonebook[0].contact))
    })

    .catch((error) => {
      console.log('[FritzFon] downloadPhonebook failed.')
      return reject(error)
    })
  })
}

/**
 * Export fritzFon.
 */

module.exports = fritzFon
