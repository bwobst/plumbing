# Web Internals From Scratch

A project that implements miniature versions of common web technologies to explore how they actually work.

See [docs/CURRICULUM.md](./docs/CURRICULUM.md) for the full learning path and [AGENTS.md](./AGENTS.md) for how to work with an AI tutor on this repo.

## Monorepo

This repo is a [pnpm](https://pnpm.io) workspace. Each package under `packages/*` is a TypeScript 6 project (`target` ES2025). Scripts run via [tsx](https://github.com/privatenumber/tsx) (no compile step).

| Package | Path            | Description                                |
| ------- | --------------- | ------------------------------------------ |
| `@dns`  | `packages/dns/` | DNS wire format, capture scripts, resolver |

### Commands

```bash
pnpm install          # install all workspace dependencies
pnpm lint             # lint and format check (Biome)
pnpm lint:fix         # apply safe lint and format fixes
pnpm typecheck        # typecheck every package
pnpm check            # lint + typecheck
```

### @dns scripts

```bash
pnpm exec tsx packages/dns/src/wire-format-parser/index.ts
```

Requires **Node 26** (see `engines` in root `package.json`). Use [fnm](https://github.com/Schniz/fnm) or similar: `fnm use 26`.

### Adding a package

1. Create `packages/<name>/` with `package.json`, `tsconfig.json`, and `src/`.
2. Set `"name": "@<scope>/<name>"` (or your chosen scope).
3. Add scripts with `tsx src/scripts/<name>.ts`.
