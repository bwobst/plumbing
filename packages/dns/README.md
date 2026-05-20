# @dns

DNS learning utilities — wire-format parsing, capture scripts, and (eventually) a recursive resolver.

## Scripts

From the repo root:

```bash
pnpm dns:parse-response    # load fixtures/response.bin and print hex
pnpm dns:capture-response  # send a UDP query and save response.bin
```

From this package:

```bash
pnpm parse-response
pnpm capture-response
pnpm capture-response 1.1.1.1 53   # optional resolver host and port
```
