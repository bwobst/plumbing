import dgram from 'node:dgram'
import decodeDnsMessage from './decoder/index.js'
import encodeDnsMessage from './encoder/index.js'
import { mockDnsMessage } from './fixtures/request.js'

const ADDRESS = '8.8.8.8'
const PORT = 53

const socket = dgram.createSocket('udp4')

socket.on('connect', (...args) => {
  console.log(`Connected to UDP socket. ${JSON.stringify(args)}`)
})

socket.on('close', (...args) => {
  console.log(`UDP socket closed. ${JSON.stringify(args)}`)
})

socket.on('error', (...args) => {
  console.log(`UDP socket connection error. ${JSON.stringify(args)}`)
})

socket.on('message', (msg, rinfo) => {
  const decoded = decodeDnsMessage(msg)
  console.log(JSON.stringify({ decoded, rinfo }))
  process.exit(0)
})

const sendMessage = (message: Buffer) => {
  console.log('Sending message', message)
  socket.send(message, PORT, ADDRESS)
}

const message = encodeDnsMessage(mockDnsMessage)
sendMessage(message)
