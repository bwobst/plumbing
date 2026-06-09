import type { DnsMessageRequest } from '@dns/interfaces.js'

/**
 * google.com, type A (1), RD=0 — reused at every hop of the walk.
 * The question section is identical each time; only the destination nameserver IP changes.
 * (Transaction ID may differ per send at runtime — fixtures pin it for reproducible tests.)
 */
export const query: DnsMessageRequest = {
  header: {
    transactionId: '0xaaaa',
    flags: {
      qr: 0,
      opcode: 0,
      aa: 0,
      tc: 0,
      rd: 0,
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

/** Header + question only (28 bytes). RD=0 (flags 0x0000). */
export const queryWire = Buffer.from([
  0xaa, 0xaa, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x06,
  0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x03, 0x63, 0x6f, 0x6d, 0x00, 0x00, 0x01,
  0x00, 0x01,
])
