export interface DnsMessage {
  header: {
    transactionId: string
    flags: {
      qr: number
      opcode: number
      aa: number
      tc: number
      rd: number
      ra: number
      rcode: number
    }
    qdcount: number
    ancount: number
    nscount: number
    arcount: number
  }
  questions: {
    name: string
    type: number
    class: number
    totalLength: number
  }
  answers: ResourceRecord
  additional?: ResourceRecord
}

export interface ResourceRecord {
  name: string
  type: number
  class: number
  ttl: number // seconds
  rdlength: number // byte length of rdata
  rdata: Buffer // raw bytes (to be interpreted per type later)
}
