import { describe, expect, it } from 'vitest'
import decodeDnsMessage from './decoder.js'
import {
  decoded as expected,
  wire,
} from './fixtures/recursive/google-com-a/01-answer.js'

describe('decodeDnsMessage', () => {
  const decoded = decodeDnsMessage(wire)

  it('decodes the full response packet', () => {
    expect(decoded).toEqual(expected)
  })

  it('decodes the header', () => {
    expect(decoded.header).toStrictEqual({
      transactionId: '0xaaaa',
      flags: {
        qr: 1,
        opcode: 0,
        aa: 0,
        tc: 0,
        rd: 1,
        ra: 1,
        rcode: 0,
      },
      qdcount: 1,
      ancount: 1,
      nscount: 0,
      arcount: 0,
    })
  })

  it('decodes the questions', () => {
    expect(decoded.questions).toStrictEqual({
      name: 'google.com',
      class: 1,
      type: 1,
      totalLength: 16,
    })
  })

  it('decodes the answers', () => {
    expect(decoded.answers).toStrictEqual({
      name: 'google.com',
      type: 1,
      class: 1,
      ttl: 261,
      rdlength: 4,
      rdata: Buffer.from([142, 251, 41, 14]),
    })
  })
})
