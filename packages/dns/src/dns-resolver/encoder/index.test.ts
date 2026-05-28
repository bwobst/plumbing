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

  describe('encodes the header', () => {
    it('encodes the transaction ID', () => {
      expect(encoded.subarray(0, 2)).toEqual(Buffer.from([0xaa, 0xaa]))
    })

    it('encodes the flags', () => {
      expect(encoded.subarray(2, 4)).toEqual(Buffer.from([0x81, 0x80]))
    })

    it('encodes the counts', () => {
      expect(encoded.subarray(4, 6)).toEqual(Buffer.from([0x00, 0x01]))
      expect(encoded.subarray(6, 8)).toEqual(Buffer.from([0x00, 0x01]))
      expect(encoded.subarray(8, 10)).toEqual(Buffer.from([0x00, 0x00]))
      expect(encoded.subarray(10, 12)).toEqual(Buffer.from([0x00, 0x00]))
    })
  })

  describe('encodes the questions', () => {
    it('encodes the length-prefixed label', () => {
      expect(encoded.subarray(12, 24)).toEqual(
        Buffer.from([
          0x06, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x03, 0x63, 0x6f, 0x6d,
          0x00,
        ]),
      )
    })

    it('encodes the type', () => {
      expect(encoded.subarray(24, 26)).toEqual(Buffer.from([0x00, 0x01]))
    })

    it('encodes the class', () => {
      expect(encoded.subarray(26, 28)).toEqual(Buffer.from([0x00, 0x01]))
    })
  })

  // it('encodes the answers', () => {
  // expect(encoded.answers).toStrictEqual({
  //   name: 'google.com',
  //   type: 1,
  //   class: 1,
  //   ttl: 261,
  //   rdlength: 4,
  //   rdata: Buffer.from([142, 251, 41, 14]),
  // })
  // })
})
