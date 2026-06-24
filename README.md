
# DorkShift — Semantic Dork Mutation Engine

**One input → 20–80 ready-to-use dorks, translated into correct syntax for 12 platforms simultaneously.**

DorkShift is a client-side single-page web application. It takes a seed dork or a secret category and generates a complete mutation pack — all semantic variants of that dork, each translated into the correct search syntax for 12 platforms. It understands semantic intent, not just syntax: `DB_PASSWORD`, `database_password`, `db_pass`, `DbPassword`, and `DATABASE_PASSWD` are all recognised as the same secret class, and DorkShift generates variants for all of them.

No backend. No database. No API calls. Everything runs in the browser. No installation required — it's a ready-to-use website hosted on GitHub Pages.

## Key Features

- **Semantic vocabulary expansion** — single keyword → dozens of semantically equivalent variants
- **5 mutation strategies** — case, separator, synonym, framework-specific, file extension
- **12 platform translations** — Google, GitHub, Shodan, Censys, X/Twitter, LinkedIn, Pastebin, VirusTotal, URLscan, FOFA, grep.app, PublicWWW
- **30 secret categories** — from DB credentials to SSL certs, each with curated keyword sets
- **Target injection** — prefix `d:example.com`, `o:acme`, `r:user/repo`, or `h:10.0.0.0/8` to get correct native operators injected per platform
- **Auto-classifier** — debounced intent detection suggests the correct category as you type
- **10 pre-built templates** — one-click load category + platform + mutation configs
- **One-click launch URLs** — every dork opens its pre-built search URL in a new tab
- **Copy-all & export** — copy per-platform lists or download as .txt
- **Shareable URLs** — full state encoded into a URL parameter
- **Explicit RUN trigger** — compute on demand, not on every keystroke

## Quick Start (Hosted)

No installation needed. Open the site in your browser:

```
https://itzneel05.github.io/DorkShift/
```

Start by typing a seed dork, selecting a category, and clicking RUN.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React + Vite |
| Styling | Tailwind CSS |
| Export | FileSaver.js |
| Hosting | GitHub Pages |
| Backend | None (fully client-side) |

## Local Development

```bash
git clone https://github.com/itzneel05/DorkShift.git
cd sdme
npm install
npm run dev
```

Open the URL printed by Vite (typically `http://localhost:5173`).

## Build

```bash
npm run build
```

Produces a static build in `dist/`.

## Project Structure

```
sdme/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── public/
├── src/
│   ├── main.jsx
│   ├── App.jsx                      # Root state + pipeline orchestration
│   ├── data/
│   │   ├── categories.json          # 30 categories w/ keywords + severity
│   │   ├── platforms.json           # 12 platforms w/ operators + target types
│   │   ├── mutations.json           # 5 mutation strategies w/ config schemas
│   │   ├── frameworks.json          # Framework-specific patterns (10 frameworks)
│   │   └── templates.json           # 10 pre-built template packs
│   ├── engine/
│   │   ├── parser.js                # Tokenise raw dork input
│   │   ├── intentClassifier.js      # Classify input against category keywords
│   │   ├── vocabularyEngine.js      # Expand keywords into semantic variants
│   │   ├── mutationEngine.js        # Apply mutation strategies
│   │   ├── platformTranslator.js    # Translate dorks per-platform + inject targets
│   │   └── outputFormatter.js       # Shape results for rendering
│   ├── components/
│   │   ├── SelectionPane.jsx        # Target input, seed input, classifier banner
│   │   ├── CategoryList.jsx         # Searchable flat category list
│   │   ├── PlatformList.jsx         # Toggleable platform list w/ relevance dimming
│   │   ├── RecipePane.jsx           # Template dropdown + mutation strategies
│   │   ├── StrategyStep.jsx         # Toggleable, collapsible strategy row
│   │   ├── TemplateDropdown.jsx     # Template selector w/ hover preview
│   │   ├── OutputPane.jsx           # Results browser w/ tabs, sort, summary
│   │   ├── DorkRow.jsx              # Dork display w/ copy + launch actions
│   │   └── RunButton.jsx            # RUN / RUNNING trigger
│   └── utils/
│       ├── urlBuilder.js            # Build platform search URLs
│       ├── deduplicator.js          # Deduplication strategies
│       ├── scorer.js                # Dork relevance scoring
│       └── shareUrl.js              # State encode/decode for URL sharing
```

## Design Principles

- **Flat panels, no shadows** — border-radius 0–4px max
- **Minimal colour** — ≤10 tokens, reserved for state/meaning
- **No decorative animation** — transitions ≤150ms, functional only
- **Monospace-forward** — JetBrains Mono for code, sans for UI chrome
- **3-pane layout** — Selection, Recipe, Output (CyberChef-inspired)

## Documentation

Additional documentation is available as Markdown files in the project root:

| File | Description |
|------|-------------|
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | System design, data flow, and component diagrams |
| [`WHY.md`](./WHY.md) | Problem statement, audience, and rationale |
| [`USE_CASES.md`](./USE_CASES.md) | Real-world scenarios and walkthroughs |
| [`USER_MANUAL.md`](./USER_MANUAL.md) | Step-by-step usage guide |
| [`FEATURES.md`](./FEATURES.md) | Feature-by-feature breakdown |
| [`FAQ.md`](./FAQ.md) | Frequently asked questions |
| [`GLOSSARY.md`](./GLOSSARY.md) | Project-specific terminology |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | How to contribute |

## License

MIT
