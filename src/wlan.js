/**
 * @module fritzWlan
 */

import fritzRequest from './request.js'

const fritzWlan = {}
/**
 * Get the name of the connected devices connected to the LAN
 * @return {Array<string>} The connected devices to the LAN as an array.
 */
fritzWlan.getDevices = async (options) => {
  const path = `/data.lua`
  const params = {
    xhr: 1,
    page: 'netDev',
    xhrId: 'cleanup',
    useajax: '1'
  }

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }

  const response = await fritzRequest.request(path, 'POST', options, params, headers)

  if (response.error) return response

  return JSON.parse(response.body).data
}

fritzWlan.getDeviceByName = async (deviceName, options) => {
  const deviceData = await fritzWlan.getDevices(options)
  const activeDevices = deviceData.active
  const passiveDevices = deviceData.passiv

  for (let activeDevice in activeDevices) {
    if (activeDevices[activeDevice].name === deviceName) {
      return activeDevices[activeDevice]
    }
  }
  for (let passivDevice in passiveDevices) {
    if (activeDevices[passivDevice].name === deviceName) {
      return activeDevices[passivDevice]
    }
  }

  return {
    error: {message: 'Device could not be found', raw: deviceData}
  }
}

fritzWlan.resetDevice = async (deviceName, options) => {
  const device = await fritzWlan.getDeviceByName(deviceName, options)

  if (device.error) {
    return device;
  }

  const path = `/data.lua`
  const params = {
    xhr: '1',
    dev_name: device.name,
    internetdetail: 'unlimited',
    allow_pcp_and_upnp: 'off',
    static_dhcp: 'off',
    dev: device.UID,
    btn_reset_dev: '',
    page: 'edit_device'
  }

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }

  const response = await fritzRequest.request(path, 'POST', options, params, headers)

  if (response.error) return response

  return JSON.parse(response.body)
}

export default fritzWlan
