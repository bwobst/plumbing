import { uint16ToDec } from '../../byte-view.js'

/**
 * Terminology:
 * - Buffer / subarray → bytes on the wire
 * - readUInt16BE() result → a uint16 or 16-bit field
 * - & / >> in comments → bits (which positions you keep or drop)
 */

const HEADER_LENGTH = 12

interface DnsMessage {
  header: {
    transactionId: string
    flags: {
      qr: number
      opcode: number
      aa: number
      tc: number
      rd: number
      ra: number
      rcode: number
    }
    qdcount: number
    ancount: number
    nscount: number
    arcount: number
  }
  questions: {
    name: string
    type: number
    class: number
    totalLength: number
  }
  answers: ResourceRecord
  additional?: ResourceRecord
}

interface ResourceRecord {
  name: string
  type: number
  class: number
  ttl: number // seconds
  rdlength: number // byte length of rdata
  rdata: Buffer // raw bytes (to be interpreted per type later)
}

/**
 * Example value: 0xAAAA
 */
const parseTransactionId = (buffer: Buffer) => {
  return `0x${buffer.toString('hex')}`
}

/**
 * Example value: 1000000110000000
 */
const parseFlags = (buffer: Buffer) => {
  const flags = buffer.readUInt16BE()

  return {
    qr: (flags >> 15) & 0b1, // query/response
    opcode: (flags >> 11) & 0b1111, // opcode
    aa: (flags >> 10) & 0b1, // authoritative answer
    tc: (flags >> 9) & 0b1, // truncated
    rd: (flags >> 8) & 0b1, // recursion desired
    ra: (flags >> 7) & 0b1, // recursion available
    rcode: (flags >> 3) & 0b1111, // reply code
  }
}

const parseIntFromBuff = (buffer: Buffer) => {
  return parseInt(buffer.toString('hex'), 16)
}

const parseHeader = (buffer: Buffer) => {
  return {
    transactionId: parseTransactionId(buffer.subarray(0, 2)),
    flags: parseFlags(buffer.subarray(2, 4)),
    qdcount: parseIntFromBuff(buffer.subarray(4, 6)),
    ancount: parseIntFromBuff(buffer.subarray(6, 8)),
    nscount: parseIntFromBuff(buffer.subarray(8, 10)),
    arcount: parseIntFromBuff(buffer.subarray(10, 12)),
  }
}

const parseQuestions = (buffer: Buffer) => {
  const MAX_ITERATIONS = 10
  let iteration = 0

  let index = 0
  let length = 0
  const labels: string[] = []
  let totalLength = 4 // Octet for type and octet for class

  do {
    iteration++

    if (iteration > MAX_ITERATIONS) {
      console.error('Reached max iterations. Bailing out.')
      break
    }

    length = parseIntFromBuff(buffer.subarray(index, index + 1))
    totalLength += length + 1 // +1 to account for length-prefix for each label

    const label = buffer
      .subarray(index + 1, index + length + 1)
      .toString('utf8')
    labels.push(label)

    index += length + 1
  } while (length > 0)

  return {
    name: labels.filter(Boolean).join('.'),
    type: parseIntFromBuff(buffer.subarray(index, index + 2)),
    class: parseIntFromBuff(buffer.subarray(index + 2, index + 4)),
    totalLength,
  }
}

const parseResourceRecord = (
  buffer: Buffer,
  fullBuffer: Buffer,
): ResourceRecord => {
  // Name pointer is indicated by the top two bits being `11`.
  const namePointerBytes = buffer.subarray(0, 2).readUInt16BE()
  const isNamePointer = namePointerBytes >> 14 === 0b11
  // console.log('isNamePointer', isNamePointer)

  // 0x3fff = [0x3f, 0xff] = 00111111 11111111
  const bitMask = 0x3fff

  const namePointerOffset = parseInt(
    uint16ToDec(namePointerBytes & bitMask),
    10,
  )

  const parsedQuestionByOffset = parseQuestions(
    fullBuffer.subarray(namePointerOffset),
  )

  return {
    name: parsedQuestionByOffset.name,
    type: parseIntFromBuff(buffer.subarray(2, 4)),
    class: parseIntFromBuff(buffer.subarray(4, 6)),
    ttl: parseIntFromBuff(buffer.subarray(6, 10)),
    rdlength: parseIntFromBuff(buffer.subarray(10, 12)),
    rdata: buffer.subarray(12),
  }
}

const decodeDnsMessage = async (buffer: Buffer): Promise<DnsMessage> => {
  const questions = parseQuestions(buffer.subarray(HEADER_LENGTH))

  return {
    header: parseHeader(buffer),
    questions,
    answers: parseResourceRecord(
      buffer.subarray(HEADER_LENGTH + questions.totalLength),
      buffer,
    ),
  }
}

export default decodeDnsMessage
