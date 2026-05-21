import fs from 'node:fs/promises'

/**
 * Checks if header ID matches 0xAAAA
 *
 * @param headerBuffer Buffer
 * @returns bool
 */
const verifyHeaderID = (dnsResponseBufferHeader: Buffer) => {
  return dnsResponseBufferHeader.toString('hex') === 'aaaa'
}

/**
 * 1000000110000000
 *
 * @param dnsResponseBufferFlags
 * @returns
 */
const parseFlags = (dnsResponseBufferFlags: Buffer) => {
  const flags = dnsResponseBufferFlags.readUInt16BE()

  return {
    qr: (flags >> 15) & 0b1,        // query/response
    opcode: (flags >> 11) & 0b1111, // opcode
    aa: (flags >> 10) & 0b1,        // authoritative answer
    tc: (flags >> 9) & 0b1,         // truncated
    rd: (flags >> 8) & 0b1,         // recursion desired
    ra: (flags >> 7) & 0b1,         // recursion available
    rcode: null,                    // reply code
  }
}

/**
 *         [TxId][Flgs]                                 [    "google"   ]    ["com" ]
 * <Buffer aa aa 81 80 00 01 00 01 00 00 00 00 06 67 6f 6f 67 6c 65 03 63 6f 6d 00 00 01 00 01 c0 0c 00 01 00 01 00 00 01 05 00 04 8e fb 29 0e>
 *
 * Flags: <Buffer 81 80> =>
 */

const main = async () => {
  const dnsResponseFile = await fs.readFile(
    'packages/dns/fixtures/response.bin',
  )

  const fullBuffer = Buffer.from(dnsResponseFile)
  const buffer = {
    full: fullBuffer,
    header: fullBuffer.subarray(0, 2),
    body: fullBuffer.subarray(2),
  }

  const hasValidHeaderID = verifyHeaderID(buffer.header)

  const flags = parseFlags(buffer.body.subarray(0, 2))
  console.log(flags)
}

main()
