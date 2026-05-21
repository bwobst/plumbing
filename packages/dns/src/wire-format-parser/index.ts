import fs from 'node:fs/promises'

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
    rcode: (flags >> 3) & 0b1111, // reply code
  }
}

const parseIntFromBuff = (buff: Buffer) => {
  return parseInt(buff.toString('hex'), 16)
}

const parseHeader = (buff: Buffer) => {
  return {
    id: parseTransactionId(buff.subarray(0, 2)),
    flags: parseFlags(buff.subarray(2, 4)),
    qdcount: parseIntFromBuff(buff.subarray(4, 6)),
    ancount: parseIntFromBuff(buff.subarray(6, 8)),
    nscount: parseIntFromBuff(buff.subarray(8, 10)),
    arcount: parseIntFromBuff(buff.subarray(10, 12)),
  }
}

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

  const parsed = {
    header: parseHeader(dnsResponseFile.subarray(0, 12)),
    questions: 'TODO',
    answers: 'TODO',
    authority: 'TODO',
    additional: 'TODO',
  }

  console.log(JSON.stringify(parsed, null, 2))
}

main()
