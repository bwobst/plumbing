import { describe, expect, it } from 'vitest'
import type { DnsMessage } from '../interfaces.js'
import encodeDnsMessage from './index.js'

describe('encodeDnsMessage', async () => {
  const mockDnsMessage: DnsMessage = {
    header: {
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
    },
    questions: {
      name: 'google.com',
      class: 1,
      type: 1,
      totalLength: 16,
    },
    answers: {
      name: 'google.com',
      type: 1,
      class: 1,
      ttl: 261,
      rdlength: 4,
      rdata: Buffer.from([142, 251, 41, 14]),
    },
  }

  const encoded = await encodeDnsMessage(mockDnsMessage)

  it('encodes the header', () => {
    expect(encoded.subarray(0, 5)).toEqual(
      Buffer.from([0xaa, 0xaa, 0x81, 0x80]),
    )
  })
})
