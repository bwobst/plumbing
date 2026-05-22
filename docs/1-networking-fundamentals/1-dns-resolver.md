### Project 1 · DNS Resolver

> Walk the DNS hierarchy, cache results, understand TTL.

**Recommended stack:** Node.js (built-in `dgram` for UDP)

#### Step 1 — Parse a response

**Goal:** Decode a raw response buffer into a structured JavaScript object.

**Inputs & outputs:**
- Input: raw response Buffer
- Output: `{ id, flags, questions: [...], answers: [{ name, type, class, ttl, rdata }], ... }`

**Key questions:**
- How do you read a 16-bit big-endian integer from a Buffer at a given offset?
- What is DNS message compression, and how does a pointer (0xC0 prefix) work?
- How many answer records does the ANCOUNT field tell you to expect?

**Done when:**
- Querying `example.com` returns at least one answer with `type: "A"` and a valid IPv4 address string
- You can also parse the TTL as a number (seconds)

**Watch out:** DNS name compression uses 2-byte pointers that jump to an earlier offset in the *same packet*. If you parse names linearly without following pointers, you'll get garbage for most real-world responses.

---

#### Step 2 — Send a raw UDP DNS query

**Goal:** Construct a valid DNS query packet by hand and send it to a public resolver.

**Inputs & outputs:**
- Input: a domain name string (e.g. `"example.com"`) and a record type (`A`)
- Output: a raw UDP response buffer from `8.8.8.8:53`

**Key questions:**
- What is the wire format of a DNS message? (RFC 1035 §4)
- What fields live in the header, and what are their sizes in bits?
- How is a domain name encoded as a sequence of labels?

**Done when:**
- You can send a query and `console.log` a non-empty Buffer back
- The first two bytes of the response match the ID you sent

**Watch out:** DNS labels are length-prefixed, not dot-separated on the wire. `example.com` becomes `\x07example\x03com\x00` — the trailing null byte is required.

---

#### Step 3 — Walk the hierarchy (iterative resolution)

**Goal:** Resolve a domain from the root servers down without relying on a forwarder.

**Inputs & outputs:**
- Input: domain name string
- Output: resolved IP address(es), reached via root → TLD → authoritative nameserver

**Key questions:**
- What are the root server IP addresses, and where do you hardcode them?
- What response code and section tell you to follow a referral vs. accept a final answer?
- What is the difference between a REFERRAL (no answer, authority section populated) and a NOERROR with answers?

**Done when:**
- Running your resolver against `dig` output for the same domain produces identical A records
- The console shows each hop: root → TLD nameserver → authoritative nameserver → answer

**Watch out:** Authoritative servers often return glue records (A records for the nameservers themselves) in the Additional section. If you ignore those, you'll have to do an extra lookup just to contact the nameserver — follow the glue when it's present.

---

#### Step 4 — Add a TTL-aware cache

**Goal:** Cache resolved records and serve them from cache until TTL expires.

**Inputs & outputs:**
- Input: a query for a domain you've already resolved
- Output: cached answer with remaining TTL (not the original TTL)

**Key questions:**
- Should you store the absolute expiry timestamp or the original TTL? Which makes remaining-TTL calculation easier?
- What is your cache key? Just the domain, or domain + record type?
- What should happen on a cache miss after the TTL expires?

**Done when:**
- A second query for the same domain returns instantly and logs `[cache hit]`
- After waiting for the TTL to expire (test with a low-TTL domain), the next query triggers a fresh lookup
- The returned TTL decrements correctly across repeated queries

**Watch out:** Store the expiry time (`Date.now() + ttl * 1000`), not the original TTL. Returning a stale TTL value on cache hits is a common off-by-one that violates RFC 1035 §3.2.1.
