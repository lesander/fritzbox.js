/** @module fritzWlan */

let fritzWlan = {}
module.exports = fritzWlan

const fritzRequest = require('./request.js')
const fritzLogin = require('./login.js')

const jsdom = require('jsdom')
const { JSDOM } = jsdom

/**
 * Get the network key (PSK)
 * @param  {Object} options - FritzBox.js options object.
 * @return {string} Returns the PSK.
 */
fritzWlan.getWlanKey = async (options) => {
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
  const key = dom.window.document.querySelector('input[name=pskvalue]').value
  return key
}
