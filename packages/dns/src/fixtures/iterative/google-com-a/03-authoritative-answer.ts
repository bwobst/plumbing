/**
 * Hop 3 response: authoritative answer.
 * Query: 00-query → an authoritative nameserver (glue IP from hop 2)
 * Captured: dig @<auth-glue-ip> google.com A +norecurse
 * Sections: ancount>0 (A records in answers)
 *
 * Add once captured:
 *   export const decoded: DnsMessageResponse = { ... }
 *   export const wire = readFileSync(...)
 */

export {}
