import { describe, expect, it } from 'vitest'
import decodeDnsMessage from './decoder.js'
import {
  decoded as comReferralExpected,
  wire as comReferralWire,
} from './fixtures/iterative/google-com-a/02-com-referral.js'
import {
  decoded as authoritativeExpected,
  wire as authoritativeWire,
} from './fixtures/iterative/google-com-a/03-authoritative-answer.js'
import {
  decoded as recursiveExpected,
  wire as recursiveWire,
} from './fixtures/recursive/google-com-a/01-answer.js'

describe('decodeDnsMessage', () => {
  describe('recursive/google-com-a/01-answer', () => {
    const decoded = decodeDnsMessage(recursiveWire)

    it('decodes the full response packet', () => {
      expect(decoded).toEqual(recursiveExpected)
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

  describe('iterative/google-com-a/02-com-referral', () => {
    const decoded = decodeDnsMessage(comReferralWire)

    it('decodes the full response packet', () => {
      expect(decoded).toEqual(comReferralExpected)
    })

    it('decodes the header', () => {
      expect(decoded.header).toStrictEqual({
        transactionId: '0xaaaa',
        flags: {
          qr: 1,
          opcode: 0,
          aa: 0,
          tc: 0,
          rd: 0,
          ra: 0,
          rcode: 0,
        },
        qdcount: 1,
        ancount: 0,
        nscount: 4,
        arcount: 8,
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

    it('decodes the first authority record', () => {
      expect(decoded.answers).toStrictEqual({
        name: 'google.com',
        type: 2,
        class: 1,
        ttl: 172800,
        rdlength: 6,
        rdata: Buffer.from([0x03, 0x6e, 0x73, 0x32, 0xc0, 0x0c]),
      })
    })
  })

  describe('iterative/google-com-a/03-authoritative-answer', () => {
    const decoded = decodeDnsMessage(authoritativeWire)

    it('decodes the full response packet', () => {
      expect(decoded).toEqual(authoritativeExpected)
    })

    it('decodes the header', () => {
      expect(decoded.header).toStrictEqual({
        transactionId: '0xaaaa',
        flags: {
          qr: 1,
          opcode: 0,
          aa: 1,
          tc: 0,
          rd: 0,
          ra: 0,
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
        ttl: 300,
        rdlength: 4,
        rdata: Buffer.from([142, 251, 215, 174]),
      })
    })
  })
})
