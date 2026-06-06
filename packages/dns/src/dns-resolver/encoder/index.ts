import type { DnsMessage, ResourceRecord } from '../interfaces.js'

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
  const result =
    (flags.qr << 15) |
    (flags.opcode << 14) |
    (flags.aa << 10) |
    (flags.tc << 9) |
    (flags.rd << 8) |
    (flags.ra << 7) |
    (flags.rcode << 4)

  return Buffer.from(result.toString(16), 'hex')
}

const encodeCount = (count: number) => {
  return Buffer.from((count & 0xffff).toString(16).padStart(4, '0'), 'hex')
}

const encodeHeader = (header: DnsMessage['header']) => {
  return Buffer.concat([
    encodeTransactionId(header.transactionId),
    encodeFlags(header.flags),
    encodeCount(header.qdcount),
    encodeCount(header.ancount),
    encodeCount(header.nscount),
    encodeCount(header.arcount),
  ])
}

const encodeName = (name: string) => {
  return Buffer.concat([
    ...name.split('.').map((label) =>
      Buffer.concat([
        // length of next label
        Buffer.from((label.length & 0xff).toString(16).padStart(2, '0'), 'hex'),
        Buffer.from(label),
      ]),
    ),
    Buffer.from((0x00).toString(16).padStart(2, '0'), 'hex'), // null byte
  ])
}

const encodeQuestions = (questions: DnsMessage['questions']) => {
  return Buffer.concat([
    encodeName(questions.name),
    encodeCount(questions.type),
    encodeCount(questions.class),
  ])
}

const encodeResoureRecord = (
  resourceRecord: ResourceRecord,
  offset: number,
) => {
  const name = Buffer.from([
    0b11000000, // top two bits indicate that it's a name pointer
    offset,
  ])

  const type = Buffer.from([0x00, resourceRecord.type])

  const clss = Buffer.from([0x00, resourceRecord.class])

  const ttl = Buffer.alloc(4)
  ttl.writeUInt32BE(resourceRecord.ttl)

  const rdlength = Buffer.alloc(2)
  rdlength.writeUint16BE(resourceRecord.rdlength)

  return Buffer.concat([name, type, clss, ttl, rdlength, resourceRecord.rdata])
}

const encodeAnswers = (
  answers: DnsMessage['answers'],
  headerLength: number,
) => {
  return encodeResoureRecord(answers, headerLength)
}

const encodeDnsMessage = async (dnsMessage: DnsMessage): Promise<Buffer> => {
  const header = encodeHeader(dnsMessage.header)
  const questions = encodeQuestions(dnsMessage.questions)
  const answers = encodeAnswers(dnsMessage.answers, header.length)

  return Buffer.concat([header, questions, answers])
}

export default encodeDnsMessage
