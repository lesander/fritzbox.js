/**
 * FritzBox.js
 * Licensed under the MIT License.
 * Copyright (c) 2017 Sander Laarhoven All Rights Reserved.
 *
 * Source-code available on GitHub.
 * https://git.io/fritzbox
 */

let fritzMonitor = {}

const net = require('net')
const events = require('events')

/**
 * Implementation of Thorsten Basse's Fritz!Box Call Monitor
 *
 * Licensed under the MIT License
 * Copyright (c) 2013 Thorsten Basse <himself@tagedieb.com>
 * https://github.com/tbasse/fritzbox-callmonitor
 *
 * @param  {Object} options
 * @return {EventEmitter}
 */
fritzMonitor.callMonitor = (options) => {
  let self = this
  this.call = {}

  /**
   * Convert a Fritz!Box date to Epoch time string.
   * @param  {String} string
   * @return {Number}
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
   * @param  {Buffer} buffer
   * @return {String}
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

  // Listen for the end signal on the opened connection.s
  client.addListener('end', () => {
    client.end()
  })
}

/**
 * Export fritzMonitor.
 */

fritzMonitor.callMonitor.prototype = new events.EventEmitter()
module.exports = fritzMonitor
