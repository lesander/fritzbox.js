/** @module fritzWlan */

let fritzWlan = {}
module.exports = fritzWlan

const fritzRequest = require('./request.js')
const fritzLogin = require('./login.js')

const jsdom = require('jsdom')
const { JSDOM } = jsdom

/**
 * Obtain a DOM object of the wireless security page.
 * @param  {Object} options - FritzBox.js options object.
 * @return {Object} JSDOM instance
 * @ignore
 */
fritzWlan.getWirelessSecurityPage = async (options) => {
  // Obtain an SID first if none is yet set.
  if (!options.sid) {
    options.sid = await fritzLogin.getSessionId(options)
    if (options.sid.error) return options.sid
  }

  // Prepare the POST form.
  const form = {
    page: 'wKey',
    sid: options.sid
  }
  options.removeSidFromUri = true

  const requestResult = await fritzRequest.request('/data.lua', 'POST', options, false, false, form)
  if (requestResult.error) return requestResult

  // Unfortunately, this section of Fritz!Box's interface is not modernized yet.
  // We're using JSDOM to parse the contents of the html result.
  const dom = new JSDOM(requestResult.body)
  return dom
}

/**
 * Check if the Fritz!Box's WLAN interface is password protected or not.
 * @param  {Object} options - FritzBox.js options object.
 * @return {boolean}
 */
fritzWlan.isWlanEncrypted = async (options) => {
  const dom = await fritzWlan.getWirelessSecurityPage(options)
  const selectedLevel = dom.window.document.querySelector('input[name=SecLevel][checked=checked]').value
  return (selectedLevel === 'wpa')
}

/**
 * Get the network key (PSK) of the Fritz!Box WLAN.
 * @param  {Object} options - FritzBox.js options object.
 * @return {string} Returns the PSK.
 */
fritzWlan.getWlanKey = async (options) => {
  const dom = await fritzWlan.getWirelessSecurityPage(options)
  const key = dom.window.document.querySelector('input[name=pskvalue]').value
  return key
}

/**
 * Get the type of WPA which is used by the Fritz!Box.
 * @param  {Object} options - FritzBox.js options object.
 * @return {string} wpa2|wpamixed
 */
fritzWlan.getWlanWPAType = async (options) => {
  const dom = await fritzWlan.getWirelessSecurityPage(options)
  const WPATypeSelect = dom.window.document.querySelector('select[name=wpa_type]')
  const selectedWPAType = WPATypeSelect.querySelector('option[selected]').value
  return selectedWPAType
}
