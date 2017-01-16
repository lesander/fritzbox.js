/**
 * FritzBox.js
 * https://git.io/fritzbox
 * Licensed under the MIT License.
 * Copyright (c) 2017 Sander Laarhoven All Rights Reserved.
 */

let fritzFormat = {}

const csvjson = require('csvjson')
const parseString = require('xml2js').parseString

/**
 * Format a raw calls array to a more readable array.
 * @param  {array} calls
 * @return {array}
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
 * @param  {string} csvData
 * @return {object}
 */
fritzFormat.callsCsvToJson = (csvData) => {
  let parsableCsvData = csvData
                        .replace('sep=;', '')
                        .replace('Extension;Telephone number', 'Extension;NumberSelf')
                        .replace('Telephone number', 'Number')
                        .trim()
  const formattedBody = csvjson.toObject(parsableCsvData, {delimiter: ';'})
  return formattedBody
}

/**
 * [tamMessages description]
 * @param  {[type]} messages [description]
 * @return {[type]}          [description]
 */
fritzFormat.tamMessages = (messages) => {
  let formattedMessages = []
  for (var i in messages) {
    formattedMessages[i] = {
      tamID: messages[i].tam,
      messageID: messages[i].index,
      date: fritzFormat.date(messages[i].date),
      name: messages[i].name,
      duration: messages[i].duration,
      number: messages[i].number,
      numberSelf: messages[i].called_pty,
      path: messages[i].path,
      inPhoneBook: fritzFormat.boolean(messages[i].inBook),
      new: messages[i].new
    }
  }
  return formattedMessages
}

/**
 * Get the human-understandable type of a call.
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
 * @param  {number} number
 * @return {boolean}
 */
fritzFormat.boolean = (number) => {
  if (number === 1) return true
  return false
}

/**
 * Convert XML to JSON object.
 * @param  {string} tmpPath
 * @return {promise}
 */
fritzFormat.xmlToJson = (xml) => {
  return new Promise(function (resolve, reject) {
    parseString(xml, (error, result) => {
      if (error) return reject(error)
      return resolve(result)
    })
  })
}

/**
 * Format an ugly phonebook object to a sane object.
 * @param  {object} object
 * @return {object}
 */
fritzFormat.phonebook = (phonebook) => {
  let formattedPhonebook = []
  for (var i in phonebook) {
    formattedPhonebook[i] = {
      uniqueid: phonebook[i].uniqueid[0],
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

/**
 * Export fritzFon.
 */

module.exports = fritzFormat
