/**
 * @module fritzFormat
 * @ignore
 */

let fritzFormat = {}

const csvjson = require('csvjson')
const convert = require('xml-to-json-promise')

/**
 * Format a raw calls array to a more readable array.
 * @private
 * @param  {Array} calls
 * @return {Array}
 */
fritzFormat.calls = (calls) => {
  let formattedCalls = []
  for (var i in calls) {
    formattedCalls[i] = {
      type: fritzFormat.callType(calls[i].Type),
      date: fritzFormat.date(calls[i].Date),
      name: calls[i].Name,
      duration: calls[i].Duration,
      number: calls[i].Number,
      numberSelf: calls[i].NumberSelf,
      extension: calls[i].Extension
    }
  }
  return formattedCalls
}

/**
 * Format calls CSV to object.
 * @private
 * @param  {string} csvData
 * @return {Object}
 */
fritzFormat.callsCsvToJson = (csvData) => {
  // Replace the CSV column titles with the English format.
  let lines = csvData.split('\n')
  lines[1] = 'Type;Date;Name;Telephone number;Extension;Telephone Number;Duration'
  csvData = lines.join('\n')

  // We remove the separator definition and shorten some column titles, so that
  // the csv to json module can parse them correctly.
  let parsableCsvData = csvData
                        .replace('sep=;', '')
                        .replace('Extension;Telephone number', 'Extension;NumberSelf')
                        .replace('Telephone number', 'Number')
                        .trim()

  // Format the CSV to a json object and return the result.
  const formattedBody = csvjson.toObject(parsableCsvData, {delimiter: ';'})
  return formattedBody
}

/**
 * Format tam messages.
 * @private
 * @param  {Object} messages
 * @return {Object}
 */
fritzFormat.tamMessages = (messages) => {
  let formattedMessages = []

  for (var i in messages) {
    formattedMessages[i] = {
      tamId: messages[i].tam,
      messageId: messages[i].index,
      date: fritzFormat.date(messages[i].date),
      name: messages[i].name,
      duration: messages[i].duration,
      number: messages[i].number,
      numberSelf: messages[i].called_pty,
      path: messages[i].path,
      inPhonebook: fritzFormat.boolean(messages[i].inBook),
      isNewMessage: messages[i].new
    }
  }

  return formattedMessages
}

/**
 * Get the human-understandable type of a call.
 * @private
 * @param  {string} type 1-4
 * @return {string}
 */
fritzFormat.callType = (type) => {
  return type
         .replace('1', 'incoming')
         .replace('2', 'missed')
         .replace('3', 'unknown')
         .replace('4', 'outgoing')
}

/**
 * Format dd.mm.yy hh:mm to a Date string.
 * @private
 * @param  {string} rawDate
 * @return {string}
 */
fritzFormat.date = (rawDate) => {
  // get vars from dd.mm.yy hh:mm format.
  let parts = rawDate.split(' ')
  let date = parts[0]
  let time = parts[1]

  let dateParts = date.split('.')
  let day = dateParts[0]
  let month = dateParts[1]
  let year = '20' + dateParts[2]

  let timeParts = time.split(':')
  let hours = timeParts[0]
  let minutes = timeParts[1]

  const formattedDate = new Date(year, month, day, hours, minutes).toString()
  return formattedDate
}

/**
 * Convert 1's and 0's to booleans.
 * @private
 * @param  {number} number
 * @return {boolean}
 */
fritzFormat.boolean = (number) => {
  if (number === 1) return true
  return false
}

/**
 * Convert XML to JSON object.
 * @private
 * @param  {string} xml
 * @return {Object}
 */
fritzFormat.xmlToObject = async (xml) => {
  const object = await convert.xmlDataToJSON(xml)
  return object
}

/**
 * Format an ugly phonebook object to a sane object.
 * @private
 * @param  {Object} object
 * @return {Object}
 */
fritzFormat.phonebook = (phonebook) => {
  let formattedPhonebook = []
  for (var i in phonebook) {
    formattedPhonebook[i] = {
      uniqueId: phonebook[i].uniqueid[0],
      name: phonebook[i].person[0].realName[0],
      numbers: [],
      category: phonebook[i].category[0]
    }

    const numbers = phonebook[i].telephony[0].number
    for (var n in numbers) {
      let number = numbers[n]
      formattedPhonebook[i].numbers[n] = {
        number: number._,
        type: number.$.type,
        priority: number.$.prio,
        quickdial: number.$.quickdial
      }
    }

    if (phonebook[i].services[0].email) {
      formattedPhonebook[i].email = phonebook[i].services[0].email[0]._
    }
    if (phonebook[i].mod_time) {
      formattedPhonebook[i].lastModified = phonebook[i].mod_time[0]
    }
    if (phonebook[i].setup[0].ringTone) {
      formattedPhonebook[i].ringtone = phonebook[i].setup[0].ringTone[0]
    }
  }

  return formattedPhonebook
}

// Export fritzFon.

module.exports = fritzFormat
