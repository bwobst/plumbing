import dgram from 'node:dgram'
import decodeDnsMessage from './decoder.js'
import encodeDnsMessage from './encoder.js'
import { query } from './fixtures/iterative/google-com-a/00-query.js'

const ROOT_NAME_SERVER_IP = '170.247.170.2' // b.root-servers.net, operated by University of Southern California, Information Sciences Institute
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
  socket.send(message, PORT, ROOT_NAME_SERVER_IP)
}

const message = encodeDnsMessage(query)
sendMessage(message)
