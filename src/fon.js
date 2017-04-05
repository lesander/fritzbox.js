/**
 * FritzBox.js
 * Licensed under the MIT License.
 * Copyright (c) 2017 Sander Laarhoven All Rights Reserved.
 *
 * Compiled using Babel (https://babeljs.io)
 * and Browserify (http://browserify.org/)
 *
 * Human readable source-code available on GitHub.
 * https://git.io/fritzbox
 */

let fritzFon = {}

const fritzLogin = require('./login.js')
const fritzRequest = require('./request.js')
const fritzFormat = require('./format.js')

/**
 * Get the history of telephone calls.
 * @param  {object} options Options object
 * @return {object}        Object with telephony calls.
 */
fritzFon.getCalls = async (options) => {
  const path = '/fon_num/foncalls_list.lua?csv='
  const response = await fritzRequest.request(path, 'GET', options)

  if (response.error) return response

  const csvCalls = response.body
  const jsonCalls = await fritzFormat.callsCsvToJson(csvCalls)

  const formattedCalls = fritzFormat.calls(jsonCalls)

  return formattedCalls
}

/**
 * Get Telephone Answering Machine (TAM) Messages.
 * @param  {object} options Options object
 * @return {object}        Object with messages
 */
fritzFon.getTamMessages = async (options) => {
  const version = await fritzLogin.getVersionNumber(options)

  if (version.error) return version

  let tamMessages

  if (version >= 683) {
    /* The following works with Fritz!Box OS 6.83 and newer. */

    // Get a session ID for the POST request first.
    if (!options.sid) {
      options.sid = await fritzLogin.getSessionId(options)
      if (options.sid.error) return options.sid
    }

    // Prepare request options
    options.removeSidFromUri = true
    const path = '/myfritz/areas/calls.lua'
    const form = {
      sid: options.sid,
      ajax_id: 1234
    }

    const response = await fritzRequest.request(path, 'POST', options, false, false, form)
    if (response.error) return response
    let calls = JSON.parse(response.body).calls

    // Filter only TAM messages.
    tamMessages = []
    for (var call in calls) {
      if (calls[call].tam_data) {
        tamMessages.push(calls[call].tam_data)
      }
    }
  } else {
    /* The following works with Fritz!Box OS 6.53 and lower. */

    const path = '/myfritz/areas/answer.lua?ajax_id=1'
    const response = await fritzRequest.request(path, 'GET', options)
    if (response.error) return response

    tamMessages = JSON.parse(response.body).tamcalls
  }

  // Fortunately, the returned objects remain somewhat the same.
  const formtattedTamMessages = fritzFormat.tamMessages(tamMessages)

  return formtattedTamMessages
}

/**
 * Download a message from the Telephone Answering Machine (TAM).
 * @param  {string} messagePath
 * @param  {string} localPath
 * @param  {object} options
 * @return {string}
 */
fritzFon.downloadTamMessage = async (messagePath, localPath, options) => {
  const path = '/myfritz/cgi-bin/luacgi_notimeout' +
               '?cmd=tam&script=/http_file_download.lua' +
               '&cmd_files=' + messagePath
  const response = await fritzRequest.request(path, 'GET', options, localPath)

  if (response.error) return response

  if (response.headers['content-type'] !== 'audio/x-wav') {
    return { error: { message: 'Did not receive wav audio file', raw: response } }
  }

  return { message: 'Saved tam message to ' + localPath }
}

/**
 * Mark a message as read.
 * @param  {number} messageId
 * @param  {object} options
 * @param  {number} [tamId=0]
 * @return {boolean}
 */
fritzFon.markTamMessageAsRead = async (messageId, options, tamId = 0) => {
  const path = '/fon_devices/tam_list.lua?useajax=1' +
               '&TamNr=' + tamId +
               '&idx=' + messageId
  const response = await fritzRequest.request(path, 'GET', options)

  if (response.error) return response

  if (response.body !== '{"state":1,"cur_idx":1}') {
    return { error: { message: 'Message not marked as read.', raw: response.body } }
  }

  return true
}

/**
 * Dial the given number.
 * @param  {number} phoneNumber
 * @return {object}
 */
fritzFon.dialNumber = async (phoneNumber, options) => {
  const path = '/fon_num/foncalls_list.lua?xhr=1' +
               '&dial=' + phoneNumber
  const response = await fritzRequest.request(path, 'GET', options)

  if (response.error) return response

  if (JSON.parse(response.body).err !== 0) {
    return { error: 'An error occured while ringing the number.' }
  }

  return { message: 'Ringing. Please pick up your designated handset now.' }
}

/**
 * Get any active calls.
 * @param  {object} options
 * @return {prototype}
 */
fritzFon.getActiveCalls = async (options) => {
  if (!options.sid) {
    options.sid = await fritzLogin.getSessionId(options)
    if (options.sid.error) return options.sid
  }

  options.removeSidFromUri = true
  const form = {
    page: 'overview',
    sid: options.sid
  }
  const response = await fritzRequest.request('/data.lua', 'POST', options, false, false, form)
  if (response.error) return response

  const activeCalls = JSON.parse(response.body).data.foncalls.activecalls

  return activeCalls
}

/**
 * Download the given telephone book.
 * @param  {number} phonebookId
 * @param  {object} options
 * @return {promise}
 */
fritzFon.getPhonebook = async (phonebookId = 0, options) => {
  if (!options.sid) {
    options.sid = await fritzLogin.getSessionId(options)
    if (options.sid.error) return options.sid
  }

  options.removeSidFromUri = true
  const formData = {
    sid: options.sid,
    PhonebookId: phonebookId,
    PhonebookExportName: 'Phonebook',
    PhonebookExport: ''
  }
  const path = '/cgi-bin/firmwarecfg'
  const response = await fritzRequest.request(path, 'POST', options, false, formData)

  if (response.error) return response

  const contacts = response.body
  const contactsJson = await fritzFormat.xmlToObject(contacts)

  const contactsObject = contactsJson.phonebooks.phonebook[0].contact
  const formattedContacts = fritzFormat.phonebook(contactsObject)

  return formattedContacts
}

/**
 * Export fritzFon.
 */

module.exports = fritzFon
