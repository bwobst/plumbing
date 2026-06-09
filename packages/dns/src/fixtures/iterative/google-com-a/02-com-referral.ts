/**
 * Hop 2 response: TLD → authoritative referral.
 * Query: 00-query → a .com TLD nameserver (glue IP from hop 1)
 * Captured: dig @<tld-glue-ip> google.com A +norecurse
 * Sections: ancount=0, nscount>0, arcount>0 (expected)
 *
 * Add once captured:
 *   export const decoded: DnsMessageResponse = { ... }
 *   export const wire = readFileSync(...)
 */

export {}
