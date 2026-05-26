import type { DnsMessage } from '../interfaces.js'

/**
 * Example input: 0xaaaa
 * Example output: <Buffer aa aa>
 */
const encodeTransactionId = (transactionId: string) => {
  return Buffer.from(transactionId.replace('0x', ''), 'hex')
}

/**
 * Example input: { qr: 1, opcode: 0, aa: 0, tc: 0, rd: 1, ra: 1, rcode: 0 }
 * Example output: <Buffer 81 80>
 */
const encodeFlags = (flags: DnsMessage['header']['flags']) => {
  let binaryString = ''

  binaryString += flags.qr
  binaryString += String(flags.opcode).padStart(4, '0')
  binaryString += flags.aa
  binaryString += flags.tc
  binaryString += flags.rd
  binaryString += flags.ra
  binaryString += '0000' // Hardcoded for: Z (reserved), answer authenticated, non-authenticated data
  binaryString += String(flags.rcode).padStart(3, '0') // TODO: The hardcoded length of 3 isn't correct for all cases

  return Buffer.from(parseInt(binaryString, 2).toString(16), 'hex')
}

const encodeHeader = (header: DnsMessage['header']) => {
  return Buffer.concat([
    encodeTransactionId(header.transactionId),
    encodeFlags(header.flags),
  ])
}

const encodeDnsMessage = async (dnsMessage: DnsMessage): Promise<Buffer> => {
  return Buffer.concat([
    encodeHeader(dnsMessage.header),
    // encodeQuestions(),
    // encodeAnswers(),
  ])
}

export default encodeDnsMessage
