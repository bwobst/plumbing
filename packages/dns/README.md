# @dns

DNS learning utilities — wire-format parsing, capture scripts, and (eventually) a recursive resolver.

## Scripts

### One-time script execution

```bash
pnpm exec tsx packages/dns/src/wire-format-parser/index.ts
```

### Automatically re-run script on change

```bash
pnpm exec tsx watch packages/dns/src/wire-format-parser/index.ts
```
