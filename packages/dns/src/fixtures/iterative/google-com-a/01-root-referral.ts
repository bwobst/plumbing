import type { DnsMessageResponse } from '../../../interfaces.js'

/**
 * Hop 1 response: root → TLD referral.
 * Query: 00-query → 170.247.170.2 (b.root-servers.net)
 * Captured: dig @170.247.170.2 google.com A +norecurse
 * Sections: ancount=0, nscount=13, arcount=12
 *
 * TODO: Once the decoder exposes authority and additional sections, move the
 * NS and glue records out of `answers` — they belong in those sections on the wire.
 */
export const decoded: DnsMessageResponse = {
  header: {
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
    nscount: 13,
    arcount: 12,
  },
  questions: {
    name: 'google.com',
    class: 1,
    type: 1,
    totalLength: 16,
  },
  answers: {
    name: 'com',
    type: 2,
    class: 1,
    ttl: 172800,
    rdlength: 20,
    rdata: Buffer.from([
      0x01, 0x61, 0x0c, 0x67, 0x74, 0x6c, 0x64, 0x2d, 0x73, 0x65, 0x72, 0x76,
      0x65, 0x72, 0x73, 0x03, 0x6e, 0x65, 0x74, 0x00,
    ]),
  },
}

/**
 * Raw wire bytes — save capture alongside this file as `01-root-referral.bin`,
 * then export as `wire` via readFileSync.
 */
