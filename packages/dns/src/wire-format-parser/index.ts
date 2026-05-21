import fs from 'node:fs/promises'

const readDnsResponseFile = async (path: string) => {
  return fs.readFile(path)
}

const dnsResponseToBufferSections = (buff: Buffer) => {
  const fullBuffer = Buffer.from(buff)

  return {
    full: fullBuffer,
    header: fullBuffer.subarray(0, 11),
    questions: 'TBD',
    answers: 'TBD',
    authority: 'TBD',
    additional: 'TBD',
  }
}

/**
 * Example value: 0xAAAA
 */
const parseTransactionId = (buff: Buffer) => {
  return `0x${buff.toString('hex').toUpperCase()}`
}

/**
 * Example value: 1000000110000000
 */
const parseFlags = (buff: Buffer) => {
  const flags = buff.readUInt16BE()

  return {
    qr: (flags >> 15) & 0b1, // query/response
    opcode: (flags >> 11) & 0b1111, // opcode
    aa: (flags >> 10) & 0b1, // authoritative answer
    tc: (flags >> 9) & 0b1, // truncated
    rd: (flags >> 8) & 0b1, // recursion desired
    ra: (flags >> 7) & 0b1, // recursion available
    rcode: 'TODO', // reply code
  }
}

const parseHeader = (buff: Buffer) => {
  return {
    id: parseTransactionId(buff.subarray(0, 2)),
    flags: parseFlags(buff.subarray(0, 2)),
  }
}

// const parseQuestions = (buff: Buffer) => {
//   return 'TBD'
// }

// const parseAnswers = (buff: Buffer) => {
//   return 'TBD'
// }

// const parseAuthority = (buff: Buffer) => {
//   return 'TBD'
// }

// const parseAdditional = (buff: Buffer) => {
//   return 'TBD'
// }

/**
 *         [TxId][Flgs]                                 [    "google"   ]    ["com" ]
 * <Buffer aa aa 81 80 00 01 00 01 00 00 00 00 06 67 6f 6f 67 6c 65 03 63 6f 6d 00 00 01 00 01 c0 0c 00 01 00 01 00 00 01 05 00 04 8e fb 29 0e>
 *
 * Flags: <Buffer 81 80> =>
 */

const main = async () => {
  const dnsResponseFile = await readDnsResponseFile(
    'packages/dns/fixtures/response.bin',
  )

  const bufferSections = dnsResponseToBufferSections(dnsResponseFile)

  const parsed = {
    header: parseHeader(bufferSections.header),
    // questions: parseQuestions(bufferSections.questions),
    // answers: parseAnswers(bufferSections.answers),
    // authority: parseAuthority(bufferSections.authority),
    // additional: parseAdditional(bufferSections.additional),
  }

  console.log('parsed', parsed)
}

main()
