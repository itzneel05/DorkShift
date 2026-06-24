
## Why DorkShift Exists

### The Problem

Security research and asset discovery often require searching across multiple platforms — Google, GitHub, Shodan, Censys, Pastebin, and more. Each platform has its own search syntax. A single search term like `DB_PASSWORD` needs to become:
- `DB_PASSWORD` on Google (plain keyword)
- `"DB_PASSWORD" language:env` on GitHub (repo search with qualifiers)
- `"DB_PASSWORD" port:5432` on Shodan (service + port query)
- `services.service_name:DB_PASSWORD` on Censys (CenQL syntax)
- And so on, for 12 platforms.

That's not one query. That's 20–80 queries, every time.

### Who Feels It

- **Security researchers** running OSINT and discovery workflows
- **Penetration testers** building reconnaissance playbooks
- **DevOps engineers** auditing their own exposure surface
- **Bug bounty hunters** casting wide nets across platforms

### Why Alternatives Fall Short

- Manual query construction is slow, error-prone, and doesn't scale.
- Platform-specific tools (e.g. only GitHub search) miss entire categories of exposure.
- Simple synonym lists don't account for per-platform syntax differences.
- Existing generators produce flat keyword lists — they don't understand semantic equivalence.

### What DorkShift Solves

DorkShift knows that `DB_PASSWORD`, `database_password`, `db_pass`, `DbPassword`, and `DATABASE_PASSWD` all belong to the same semantic class. It generates all of them — not just the one you typed — and translates each into correct syntax for every platform you select.

**One input → 20–80 ready-to-use search queries, each with a one-click launch URL.** No backend, no setup, no per-platform syntax memorisation.
