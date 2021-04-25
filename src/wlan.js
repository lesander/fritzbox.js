/**
 * @module fritzWlan
 */

let fritzWlan = {}

const fritzRequest = require('./request.js')

fritzWlan.getWlanNetwork = async (options) => {
  const form = {
    page: 'wSet'
  }

  const response = await fritzRequest.request('/data.lua', 'POST', options, false, false, form)
  if (response.error) return response

  return JSON.parse(response.body).data.wlanSettings
}

fritzWlan.getWlanSecurity = async (options) => {
  const form = {
    page: 'wKey'
  }

  const response = await fritzRequest.request('/data.lua', 'POST', options, false, false, form)
  if (response.error) return response

  return JSON.parse(response.body).data.wlan
}

module.exports = fritzWlan
