
# DorkShift — Semantic Dork Mutation Engine

**One input → 20–80 ready-to-use search queries, translated into correct syntax for 12 platforms simultaneously.**

DorkShift is a client-side single-page web application for security research, exposure discovery, and asset visibility. It takes a seed dork or a category of interest and generates a complete mutation pack — all semantic variants of that search term, each translated into the correct search syntax for 12 platforms. It understands semantic intent, not just syntax: `DB_PASSWORD`, `database_password`, `db_pass`, `DbPassword`, and `DATABASE_PASSWD` are all recognised as the same semantic class, and DorkShift generates variants for all of them.

No backend. No database. No API calls. Everything runs in the browser. No installation required — it's a ready-to-use website hosted on GitHub Pages.

## Key Features

- **Semantic vocabulary expansion** — single keyword → dozens of semantically equivalent variants
- **5 mutation strategies** — case, separator, synonym, framework-specific, file extension
- **12 platform translations** — Google, GitHub, Shodan, Censys, X/Twitter, LinkedIn, Pastebin, VirusTotal, URLscan, FOFA, grep.app, PublicWWW
- **30 detection categories** — from database credentials to SSL certificates, each with curated keyword sets
- **Target injection** — prefix `d:example.com`, `o:acme`, `r:user/repo`, or `h:10.0.0.0/8` to get correct native operators injected per platform
- **Auto-classifier** — debounced intent detection suggests the relevant category as you type
- **10 pre-built templates** — one-click load category + platform + mutation configs
- **One-click launch URLs** — every query opens its pre-built search URL in a new tab
- **Copy-all & export** — copy per-platform lists or download as .txt
- **Shareable URLs** — full state encoded into a URL parameter
- **Explicit RUN trigger** — compute on demand, not on every keystroke

## Quick Start (Hosted)

No installation needed. Open the site in your browser:

```
https://itzneel05.github.io/DorkShift/
```

Start by typing a search term, selecting a category, and clicking RUN.

## Responsible Use

DorkShift is intended for authorised security research, defensive auditing, OSINT investigation, bug bounty programs, CTF learning environments, and exposure validation. Users are responsible for complying with applicable laws, platform terms of service, and authorisation requirements.

DorkShift does not:
- Scan, crawl, or probe any system
- Validate or exploit discovered credentials
- Collect or exfiltrate data
- Send network requests during query generation

The only network action is opening a pre-built search URL in a new tab when the user clicks the launch button.

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
│   │   ├── parser.js                # Tokenise raw search input
│   │   ├── intentClassifier.js      # Classify input against category keywords
│   │   ├── vocabularyEngine.js      # Expand keywords into semantic variants
│   │   ├── mutationEngine.js        # Apply mutation strategies
│   │   ├── platformTranslator.js    # Translate queries per-platform + inject targets
│   │   └── outputFormatter.js       # Shape results for rendering
│   ├── components/
│   │   ├── SelectionPane.jsx        # Target input, seed input, classifier banner
│   │   ├── CategoryList.jsx         # Searchable flat category list
│   │   ├── PlatformList.jsx         # Toggleable platform list w/ relevance dimming
│   │   ├── RecipePane.jsx           # Template dropdown + mutation strategies
│   │   ├── StrategyStep.jsx         # Toggleable, collapsible strategy row
│   │   ├── TemplateDropdown.jsx     # Template selector w/ hover preview
│   │   ├── OutputPane.jsx           # Results browser w/ tabs, sort, summary
│   │   ├── DorkRow.jsx              # Query display w/ copy + launch actions
│   │   └── RunButton.jsx            # RUN / RUNNING trigger
│   └── utils/
│       ├── urlBuilder.js            # Build platform search URLs
│       ├── deduplicator.js          # Deduplication strategies
│       ├── scorer.js                # Query relevance scoring
│       └── shareUrl.js              # State encode/decode for URL sharing
```

## Design Principles

- **Flat panels, no shadows** — border-radius 0–4px max
- **Minimal colour** — ≤10 tokens, reserved for state/meaning
- **No decorative animation** — transitions ≤150ms, functional only
- **Monospace-forward** — JetBrains Mono for code-like content, sans for UI chrome
- **3-pane layout** — Selection, Recipe, Output (CyberChef-inspired)

## License

MIT
