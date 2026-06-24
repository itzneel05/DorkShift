
## User Manual

### Prerequisites

- A modern browser (Chrome, Firefox, Edge, or Safari)
- Screen resolution >1024px (desktop view required)
- Node.js 18+ (only needed for local development)

### Quick Start (Hosted)

No installation required. Open the site in your browser:

```
https://itzneel05.github.io/DorkShift/
```

The application loads ready to use. Start typing a search term, select a category, and click RUN.

### Local Development

```bash
git clone https://github.com/itzneel05/DorkShift.git
cd sdme
npm install
npm run dev
```

Open the URL printed by Vite (typically `http://localhost:5173`).

### Interface Overview

DorkShift uses a three-pane layout:

```
┌─────────────────┬──────────────────┬─────────────────────────────┐
│   SELECTION     │     RECIPE       │          OUTPUT             │
│                 │                  │                             │
│  [Target]       │  [Templates]     │  [Auto/Manual] [Run]        │
│  [Seed Input]   │  [Strategies]    │  [Summary Bar]              │
│  [Classifier]   │   ☐ Case         │  [Tab: GitHub(31)]          │
│  [Categories]   │   ☐ Separator    │   ┌───┬───┬───┐             │
│  [Platforms]    │   ☐ Synonym      │   │   │   │   │             │
│                 │   ☐ Framework    │   │   │   │   │             │
│                 │   ☐ File Ext     │   │   │   │   │             │
└─────────────────┴──────────────────┴─────────────────────────────┘
```

### Step-by-Step Walkthrough

#### 1. Set a Target (Optional)

Click a target type button: **DOMAIN**, **ORG**, **REPO**, or **HOST**. A text input appears — type the value (e.g. `example.com` for DOMAIN). DorkShift will inject the correct native operator per platform:
- Google → `site:example.com`
- Shodan → `hostname:example.com`
- GitHub (ORG) → `repo:org-name`
- LinkedIn (relay) → `site:linkedin.com` via Google

Click **CLEAR** to remove the target.

#### 2. Enter a Search Term

Type a keyword, pattern, or identifier into the **SEED DORK** input. The auto-classifier begins analysing after 300ms of idle time.

*Tip: Try pasting `DB_PASSWORD`, `AKIA`, or `-----BEGIN` to see the classifier in action.*

#### 3. Review the Classifier Banner

A banner appears below the seed input:
- **Green/accent border** → confident match (≥40% confidence). Category name and confidence percentage shown.
- **Orange/warning border** → low confidence (<40%). Suggests manual category selection.

You can always override the classifier by clicking a different category in the list.

#### 4. Select a Category

The category list shows all 30 detection categories. When the classifier fires, non-matching categories dim to `opacity-40`. Click any category to select it.

A live estimate appears below the banner: "~36 queries across 8 platforms" — updated as you toggle platforms and strategies.

#### 5. Toggle Platforms

Each of the 12 platforms has a checkbox. Platforms dim by relevance to the selected category. When a target is set, each platform shows its operator:
- **Accent-coloured** operator text → native operator available
- **Orange/warning** `↻` icon → Google relay only
- **Muted** `—` icon → bare keyword fallback (no native operator)

#### 6. Configure the Recipe Pane

**Templates**: Select from 10 pre-built packs to load category + platform + mutation config instantly. Hover over the dropdown to see a preview.

**Mutation Strategies**: Each of the 5 strategies is togglable and starts collapsed. Click to collapse/expand individual config:

| Strategy | Config |
|----------|--------|
| Case Mutation | No config — runs automatically when enabled |
| Separator Mutation | Configures separator characters (`_`, `-`, `.`, etc.) |
| Synonym Expansion | Sets max variants (10–200). Higher values increase generation time |
| Framework-Specific | Select target frameworks (Django, Rails, Laravel, etc.) |
| File Extension | Select file types to target (`.env`, `.sql`, `.pem`, etc.) |

The footer shows your summary: "3 of 5 strategies active | ~50 variants max"

#### 7. Generate Output

The **Auto/Manual** toggle at the top of the Output pane controls generation mode:
- **Auto** (default) — output regenerates on every config change with a 250ms debounce
- **Manual** — click the **Run** button explicitly

*Tip: For complex configurations with many categories/platforms, switch to Manual mode to avoid repeated generation.*

#### 8. Browse Results

Results appear as per-platform tabs. Each tab label shows the platform name and query count: `[GitHub·31]`, `[Google·18]`.

**Query rows** show:
- **Operator part** (the injected target prefix) — coloured accent (native), warning (relay), or muted (bare)
- **Query body** — in text colour
- **Opacity** — full (highly relevant), 70% (medium), 50% (low relevance to the selected category)
- **COPY button** — copies the raw query body (without the operator prefix)
- **↗ button** — opens the full search URL (operator + query) in a new tab

**Tab header**: COPY ALL (copies all queries in the current tab) and EXPORT (downloads .txt)

**Sort dropdown**: Sort by platform, relevance, or alphabetically within each tab

**Deduplication notice**: "Deduplication removed 3 duplicate queries" — shown when applicable

#### 9. Share Configuration

After running, the URL parameter `?s=[base64]` is updated. Copy the URL and send it to anyone — they'll see the exact same configuration when they open it.

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd + Enter | Trigger RUN |
| Escape | Clear selected category |

### Common Mistakes

- **Typing a bare keyword without selecting a category** — the classifier helps, but always verify the selected category matches your intent
- **Expecting results with 0 platforms active** — at least one platform must be checked
- **Missing target injection** — the `d:`, `o:`, `r:`, `h:` prefix goes at the *start* of the seed input, followed by a space and the search term
- **Low variant count** — enable Synonym Expansion and increase the max variants setting if you need broader coverage
