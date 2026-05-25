import fs from 'node:fs/promises'
import path from 'node:path'
import decodeDnsMessage from './index.js'

/**
 * Example: <Buffer aa aa 81 80 00 01 00 01 00 00 00 00 06 67 6f 6f 67 6c 65 03 63 6f 6d 00 00 01 00 01 c0 0c 00 01 00 01 00 00 01 05 00 04 8e fb 29 0e>
 *                  [TxId][Flgs][Qstn][Ansr][Auth][Addl][            "google.com"         ] [Type][Clss][                    Answers                  ]
 *                  [              Header              ][                  Questions                   ]
 */
const main = async () => {
  const decoded = await decodeDnsMessage(
    await fs.readFile(path.join(import.meta.dirname, 'fixtures/response.bin')),
  )

  console.log('decoded', JSON.stringify(decoded, null, 2))
}

main()
