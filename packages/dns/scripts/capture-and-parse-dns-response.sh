# !/bin/bash

# This script demonstrates how to capture and parse raw DNS response bytes.

# Send a query and capture the raw response bytes to a file
dig +norecurse google.com A

# Then capture the actual bytes:
python3 -c "
import socket, struct

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.settimeout(3)

# Minimal valid A query for google.com, ID=0xAAAA, RD=1
query = bytes.fromhex('aaaa0100000100000000000006676f6f676c6503636f6d0000010001')
sock.sendto(query, ('8.8.8.8', 53))
resp, _ = sock.recvfrom(512)

with open('response.bin', 'wb') as f:
    f.write(resp)

print('Captured', len(resp), 'bytes')
print('Hex:', resp.hex())
"
