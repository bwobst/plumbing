import type { DnsMessageRequest } from '../interfaces.js'

/**
 * Query that elicits `mockDnsMessage` in response.ts — same transaction ID and
 * question section; header flags/counts differ (qr=0, no answer sections).
 */
export const mockDnsMessage: DnsMessageRequest = {
  header: {
    transactionId: '0xaaaa',
    flags: {
      qr: 0,
      opcode: 0,
      aa: 0,
      tc: 0,
      rd: 1,
      ra: 0,
      rcode: 0,
    },
    qdcount: 1,
    ancount: 0,
    nscount: 0,
    arcount: 0,
  },
  questions: {
    name: 'google.com',
    class: 1,
    type: 1,
    totalLength: 16,
  },
}

/** Header + question only (28 bytes). Matches response.ts through byte 27. */
export const mockRequestWire = Buffer.from([
  0xaa, 0xaa, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x06, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x03, 0x63, 0x6f, 0x6d, 0x00,
  0x00, 0x01, 0x00, 0x01,
])
