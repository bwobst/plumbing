import fs from 'node:fs/promises'
import {
  buffToBin,
  buffToDec,
  buffToHex,
  uint8ToBin,
  uint8ToDec,
  uint8ToHex,
  uint16ToBin,
  uint16ToDec,
  uint16ToHex,
} from '../byte-view.js'

interface ResourceRecord {
  name: string
  type: number
  class: number
  ttl: number // seconds
  rdlength: number // byte length of rdata
  rdata: string // raw bytes (to be interpreted per type later)
}

const readDnsResponseFile = async (path: string) => {
  return fs.readFile(path)
}

/**
 * Example value: 0xAAAA
 */
const parseTransactionId = (buffer: Buffer) => {
  return `0x${buffer.toString('hex').toUpperCase()}`
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
    id: parseTransactionId(buffer.subarray(0, 2)),
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
  let totalLength = 4 // Two bytes for type and two bytes for class

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

const parseResourceRecord = (buffer: Buffer) => {
  console.log('parseResourceRecord', {
    buffer,
    bin: buffToBin(buffer),
  })

  // Name pointer is indicated by the two left-most bits being `11`.
  const namePointerBytes = buffer.subarray(0, 2).readUInt16BE()
  const isNamePointer = namePointerBytes >> 14 === 0b11
  console.log('isNamePointer', isNamePointer)
}

/**
 * Example: <Buffer aa aa 81 80 00 01 00 01 00 00 00 00 06 67 6f 6f 67 6c 65 03 63 6f 6d 00 00 01 00 01 c0 0c 00 01 00 01 00 00 01 05 00 04 8e fb 29 0e>
 *                  [TxId][Flgs][Qstn][Ansr][Auth][Addl][            "google.com"         ] [Type][Clss][                    Answers                  ]
 *                  [              Header              ][                  Questions                   ]
 */
const main = async () => {
  const dnsResponseFile = await readDnsResponseFile(
    'packages/dns/fixtures/response.bin',
  )

  const HEADER_LENGTH = 12

  const questions = parseQuestions(dnsResponseFile.subarray(HEADER_LENGTH)) // No end parameter because we don't yet know how many bytes long the questions section is.
  const answers = parseResourceRecord(
    dnsResponseFile.subarray(HEADER_LENGTH + questions.totalLength),
  )

  const parsed = {
    header: parseHeader(dnsResponseFile.subarray(0, HEADER_LENGTH)),
    questions,
    answers,
    authority: 'TODO',
    additional: 'TODO',
  }

  // console.log('parsed:', JSON.stringify(parsed, null, 2))
}

main()
