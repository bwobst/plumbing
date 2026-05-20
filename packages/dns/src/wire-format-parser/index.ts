import fs from 'node:fs/promises'

const main = async () => {
  const dnsResponseFile = await fs.readFile(
    'packages/dns/fixtures/response.bin',
  )

  const dnsResponseBuffer = Buffer.from(dnsResponseFile)

  console.log(dnsResponseBuffer)
}

main()
