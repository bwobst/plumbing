import { describe, expect, it } from 'vitest'
import encodeDnsMessage from './encoder.js'
import {
  mockDnsMessage,
  mockRequestWire,
} from './fixtures/request.recursion.js'

describe('encodeDnsMessage', () => {
  const encoded = encodeDnsMessage(mockDnsMessage)

  it.skip('encodes the full request packet', () => {
    expect(encoded).toEqual(mockRequestWire)
  })

  describe('encodes the header', () => {
    it('encodes the transaction ID', () => {
      expect(encoded.subarray(0, 2)).toEqual(Buffer.from([0xaa, 0xaa]))
    })

    it('encodes the flags', () => {
      expect(encoded.subarray(2, 4)).toEqual(Buffer.from([0x01, 0x00]))
    })

    it('encodes the counts', () => {
      expect(encoded.subarray(4, 6)).toEqual(Buffer.from([0x00, 0x01])) // qdcount
      expect(encoded.subarray(6, 8)).toEqual(Buffer.from([0x00, 0x00])) // ancount
      expect(encoded.subarray(8, 10)).toEqual(Buffer.from([0x00, 0x00])) // nscount
      expect(encoded.subarray(10, 12)).toEqual(Buffer.from([0x00, 0x00])) // arcount
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
})
