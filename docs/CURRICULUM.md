# Web Infrastructure — Self-Directed Curriculum

A hands-on curriculum for deepening web development knowledge by building infrastructure systems from scratch. Each project targets a real system that developers interact with daily but rarely understand at the implementation level.

**Start here:** [Project 1 · DNS Resolver](./1-networking-fundamentals/1-dns-resolver.md), implemented in Node.js under [`packages/dns/`](../packages/dns/).

---

## Methodology — Guided Spec

For each project, you receive a **guided spec** rather than implementation code: enough detail to know what to build and how to verify it, but the design and implementation decisions belong to you.

Each build step includes:

- **Goal** — what this step accomplishes in one sentence
- **Inputs & outputs** — data shapes, not code
- **Key questions** — things to answer before writing a line
- **Done when** — a checklist verifiable with a real tool or console output
- **Watch out** — the one thing that most commonly trips people up

When you get stuck on a specific bug, concept, or decision between approaches, bring it to Claude and work through it together. Implementation code is not volunteered unprompted.

---

## Layer 1 — Networking Fundamentals

### [Project 1 · DNS Resolver](./1-networking-fundamentals/1-dns-resolver.md)

### [Project 2 · TCP Server](./1-networking-fundamentals/2-tcp-server.md)

### [Project 3 · HTTP/1.1 Server](./1-networking-fundamentals/3-http-server.md)

---

## Layer 2 — Traffic & Routing

### [Project 4 · Load Balancer](./2-traffic-routing/4-load-balancer.md)

### [Project 5 · Reverse Proxy](./2-traffic-routing/5-reverse-proxy.md)

### [Project 6 · API Gateway](./2-traffic-routing/6-api-gateway.md)

---

## Layer 3 — Caching & Content Delivery

### [Project 7 · CDN (Content Delivery Simulation)](./3-caching-content-delivery/7-cdn.md)

### [Project 8 · HTTP Cache Layer](./3-caching-content-delivery/8-http-cache-layer.md)

### [Project 9 · Key-Value Store](./3-caching-content-delivery/9-key-value-store.md)

---

## Layer 4 — Reliability & Observability

### [Project 10 · Circuit Breaker](./4-reliability-observability/10-circuit-breaker.md)

### [Project 11 · Metrics Collector](./4-reliability-observability/11-metrics-collector.md)

### [Project 12 · Distributed Tracing](./4-reliability-observability/12-distributed-tracing.md)

---

## Layer 5 — Data & Storage

### [Project 13 · Write-Ahead Log](./5-data-storage/13-write-ahead-log.md)

### [Project 14 · Message Queue](./5-data-storage/14-message-queue.md)

### [Project 15 · Object Storage](./5-data-storage/15-object-storage.md)

---

## Suggested Learning Path

| Phase | Projects | Focus |
|-------|----------|-------|
| **Start** | DNS Resolver → TCP Server → HTTP/1.1 Server | How bytes become requests |
| **Build up** | Load Balancer → Reverse Proxy → API Gateway | How requests get routed |
| **Go deep** | Key-Value Store → CDN → HTTP Cache Layer | How data is served efficiently |
| **Harden** | Circuit Breaker → Metrics Collector → Distributed Tracing | How systems stay reliable |
| **Persist** | Write-Ahead Log → Message Queue → Object Storage | How data survives restarts |

Each project builds on the mental models of the ones before it. The DNS resolver and TCP server are the recommended starting point — everything else runs on top of what you build there.
