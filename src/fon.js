/**
 * Fritz!Fon functions.
 * @module fritzFon
 */

let fritzFon = {}

const fritzLogin = require('./login.js')
const fritzRequest = require('./request.js')
const fritzFormat = require('./format.js')
const fritzSystem = require('./system.js')

const net = require('net')
const events = require('events')

/**
 * Get the history of telephone calls.
 * @param  {Object} options - FritzBox.js options object.
 * @return {Array} Array of telephone call history.
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
 * @param  {Object} options - FritzBox.js options object.
 * @return {Array} Array with TAM messages.
 */
fritzFon.getTamMessages = async (options) => {
  const version = await fritzSystem.getVersionNumber(options)

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
 * @param  {string} messagePath - The remote file path of the message.
 * @param  {string} localPath   - The local file path to save the message to.
 * @param  {Object} options     - FritzBox.js options object.
 * @return {Object} Returns an object with a message.
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
 * @param  {number} messageId   - The Id of the message to mark as read.
 * @param  {Object} options     - FritzBox.js options object.
 * @param  {number} [tamId=0]   - The Telephone Answering Machine Id
 * @return {boolean} Returns true when the message was marked as read.
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
 * @param  {number} phoneNumber - The phonenumber to dial, including any extension.
 * @return {Object} Returns an object with a message.
 */
fritzFon.dialNumber = async (phoneNumber, options) => {
  if (typeof phoneNumber !== 'string' && typeof phoneNumber !== 'number') {
    return { error: { message: 'Invalid phone number given.' } }
  }

  const path = '/fon_num/foncalls_list.lua?xhr=1' +
               '&dial=' + phoneNumber
  const response = await fritzRequest.request(path, 'GET', options)

  if (response.error) return response

  if (JSON.parse(response.body).err !== 0) {
    return { error: { message: 'An error occured while ringing the number.' } }
  }

  return { message: 'Ringing. Please pick up your designated handset now.' }
}

/**
 * Get any active calls.
 * @param  {Object} options - FritzBox.js options object.
 * @return {Array} Returns an array of active calls.
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
 * @param  {number} phonebookId - Id of the phonebook to use.
 * @param  {Object} options     - FritzBox.js options object.
 * @return {Array} Returns an array of contact objects.
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
 * Receive events for incoming and outgoing calls.
 *
 * Enable the callmonitor on your Fritz!Box by dialing `#96*5*` and disable with `#96*4*`
 * Set `options.callmonitorport` to `1012` or a custom port.
 *
 * This is an implementation of Thorsten Basse's Fritz!Box Call Monitor
 *
 * @memberof fritzFon
 * @param  {Object} options - FritzBox.js options object.
 * @return {EventEmitter} Returns an event emitter for you to catch events with.
 */
var CallMonitor = function (options) {
  let self = this
  this.call = {}

  /**
   * Convert a Fritz!Box date to Epoch time string.
   * @private
   * @param  {string} string
   * @return {number}
   */
  const convertDate = (string) => {
    let d = string.match(/[0-9]{2}/g)
    let result = ''
    result += '20' + d[2] + '-' + d[1] + '-' + d[0]
    result += ' ' + d[3] + ':' + d[4] + ':' + d[5]
    return Math.floor(new Date(result).getTime() / 1000)
  }

  /**
   * Parse a data buffer to a readable message.
   * @private
   * @param  {Buffer} buffer
   * @return {string}
   */
  const parseMessage = (buffer) => {
    let message = buffer.toString()
                  .toLowerCase()
                  .replace(/[\n\r]$/, '')
                  .replace(/;$/, '')
                  .split(';')
    message[0] = convertDate(message[0])
    return message
  }

  // Open a connection to the Fritz!Box call monitor.
  const port = options.callmonitorport || 1012
  const client = net.createConnection(port, options.server)

  client.addListener('error', (error) => {
    let errorMessage

    switch (error.code) {
      case 'ENETUNREACH':
        errorMessage = `Cannot reach ${error.address}:${error.port}`
        break
      case 'ECONNREFUSED':
        errorMessage = `Connection refused on ${error.address}:${error.port}`
        break
      default:
        errorMessage = `Unknown error`
        break
    }

    self.emit('error', { message: errorMessage, code: error.errno, raw: error })
  })

  // Listen for data on the opened connection.
  client.addListener('data', (chunk) => {
    const data = parseMessage(chunk)

    switch (data[1]) {
      // Handle an incoming call
      case 'ring':
        self.call[data[2]] = {
          type: 'inbound',
          start: data[0],
          caller: data[3],
          called: data[4]
        }
        self.emit('inbound', {
          time: data[0],
          caller: data[3],
          called: data[4]
        })
        break

      // Handle an outbound call
      case 'call':
        self.call[data[2]] = {
          type: 'outbound',
          start: data[0],
          extension: data[3],
          caller: data[4],
          called: data[5]
        }
        self.emit('outbound', {
          time: data[0],
          extension: data[3],
          caller: data[4],
          called: data[5]
        })
        break

      // Handle a pick-up event
      case 'connect':
        self.call[data[2]]['connect'] = data[0]
        self.emit('connected', {
          time: data[0],
          extension: self.call[data[2]]['extension'],
          caller: self.call[data[2]]['caller'],
          called: self.call[data[2]]['called']
        })
        break

      // Handle the end of a call
      case 'disconnect':
        self.call[data[2]].disconnect = data[0]
        self.call[data[2]].duration = parseInt(data[3], 10)
        let call = self.call[data[2]]
        delete (self.call[data[2]])
        self.emit('disconnected', call)
        break
    }
  })

  // Listen for the end signal on the opened connections.
  client.addListener('end', () => {
    client.end()
  })
}

CallMonitor.prototype = new events.EventEmitter()
fritzFon.CallMonitor = CallMonitor

// Export fritzFon.

module.exports = fritzFon
