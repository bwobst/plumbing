# @dns

DNS learning utilities — wire-format parsing, capture scripts, and (eventually) a recursive resolver.

## Scripts

### Tests

```bash
pnpm test                              # all workspace packages
pnpm test:coverage                     # all packages, with coverage
pnpm --filter @dns test                # this package only
pnpm --filter @dns test:coverage       # this package, with coverage
pnpm --filter @dns test:watch          # watch mode
```

Tests live next to source as `*.test.ts`. Step 1 **Done when** criteria belong in `src/wire-format-parser/index.test.ts` (see curriculum spec).

### One-time script execution

```bash
pnpm exec tsx packages/dns/src/wire-format-parser/index.ts
```

### Automatically re-run script on change

```bash
pnpm exec tsx watch packages/dns/src/wire-format-parser/index.ts
```
