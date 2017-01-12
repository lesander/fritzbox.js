/**
 * FritzBox.js
 * https://git.io/fritzbox
 * Licensed under the MIT License.
 * Copyright (c) 2017 Sander Laarhoven All Rights Reserved.
 */

const fritzRequest = require('./request.js')

let fritzLogin = {}

/**
 * Login to the Fritz!Box and obtain a sessionID.
 * @param  {object} options Options object
 * @return {string}         sessionID
 */
fritzLogin.getSessionID = (options) => {
  return new Promise(function (resolve, reject) {
    // Request a challenge.
    fritzRequest.request('/login_sid.lua', 'GET', options)

    // Solve the presented challenge.
    .then((response) => {
      const challenge = response.body.match('<Challenge>(.*?)</Challenge>')[1]

      const buffer = Buffer(challenge + '-' + options.password, 'UTF-16LE')
      const challengeResponse = challenge + '-' + require('crypto').createHash('md5').update(buffer).digest('hex')
      const path = '/login_sid.lua?username=' + options.username + '&response=' + challengeResponse

      return fritzRequest.request(path, 'GET', options)
    })

    // Obtain the SID.
    .then((response) => {
      const sessionID = response.body.match('<SID>(.*?)</SID>')[1]

      if (sessionID === '0000000000000000') {
        throw new Error('Could not login to Fritz!Box. Invalid login?')
        return false
      }

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
 * Export fritzLogin.
 */

module.exports = fritzLogin
