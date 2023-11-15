import fritz from '../index.js'
import pckJson from '../package.json' assert {type: 'json'}

let monitor = new fritz.CallMonitor(pckJson.options)

function handler (type, call) {
  console.log(type, '\n', call)
}

monitor.on('inbound', (call) => {
  handler('incoming', call)
})

monitor.on('outbound', (call) => {
  handler('outgoing', call)
})

monitor.on('connected', (call) => {
  handler('connected', call)
})

monitor.on('disconnected', (call) => {
  handler('connection ended', call)
})

monitor.on('error', (error) => {
  handler('error', error)
  process.exit(1)
})
