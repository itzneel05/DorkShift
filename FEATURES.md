
## Feature Breakdown

| Feature | What It Does | Why | Status |
|---------|-------------|-----|--------|
| Seed Dork Input | Free-text input field accepts raw dorks, keywords, credential strings, or GitHub/Shodan syntax | Universal entry point — any input format parses and classifies | ✅ |
| Target Injection | Prefix `d:/o:/r:/h:` scopes dorks per-platform with correct native operators | Eliminates manual operator lookup per platform | ✅ |
| Live Prefix Recognition | Inline label shows `DOMAIN`, `ORG`, `REPO`, `HOST`, or `BARE KEYWORD` as you type | Immediate feedback on target parse | ✅ |
| Category Picker | Flat, searchable list of 30 secret categories with severity indicators | Quick category selection with filter support | ✅ |
| Auto-Classifier | Debounced (300ms) intent detection suggests category; ≥0.4 confidence auto-highlights | Reduces time spent browsing 30 categories | ✅ |
| Category Dimming | Non-classified categories dim to `opacity-40` when classifier fires | Visual focus on the most likely match | ✅ |
| Platform Toggle List | 12 platforms with checkbox toggles, operator markers, and relevance dimming | Full control over search surface | ✅ |
| Platform Relevance | Platforms scored (0–1) against selected category keywords; dimmed at <0.7 or <0.3 | Focuses attention on high-relevance platforms | ✅ |
| Relay Markers | `↻` (relay) or `—` (bare) indicator per platform when a target is set | Clarifies operator availability at a glance | ✅ |
| Template Gallery | 10 pre-built packs load category + platforms + mutations in one click | One-command setup for common workflows | ✅ |
| Template Preview | Hover over template dropdown shows inline preview | See what a template does before applying | ✅ |
| Mutation Strategies | 5 strategies: case, separator, synonym, framework-specific, file extension | Breadth of variant generation | ✅ |
| Collapsible Strategy Config | Each strategy toggles expand/collapse for inline configuration | Reduce visual clutter; show config only when needed | ✅ |
| Strategy Summary | Footer shows "3 of 5 strategies active \| ~50 variants max" | At-a-glance strategy state | ✅ |
| Per-Platform Tabs | Results grouped by platform tab with count badge `[GitHub·31]` | Familiar browsing pattern per platform | ✅ |
| One-Click Launch | ↗ button opens pre-built search URL per dork in a new tab | Instant action from generated dork | ✅ |
| Per-Row Copy | COPY button copies raw dork body (without injected operator) | Clean copy for use in other tools | ✅ |
| Copy All | COPY ALL button copies all dorks in current tab as newline-separated list | Bulk export per platform | ✅ |
| Export .txt | EXPORT button downloads all platforms with header comments | Full offline archive | ✅ |
| Sort Control | Sort per-platform results by: platform order, relevance score, or alphabetically | Flexible result browsing | ✅ |
| Specificity Opacity | Dork rows at full (≥0.7), 70% (0.4–0.7), or 50% (<0.4) relevance opacity | Visual density — low-relevance dorks recede | ✅ |
| Summary Bar | "42 dorks across 8 platforms \| Generated in 23ms" | Instant feedback on generation scope | ✅ |
| Dedup/Truncation Notices | Shows deduplication count and per-platform capping notice | Transparency on output limits | ✅ |
| Empty Tab State | Muted "No dorks generated for this platform" text | Never shows a blank tab | ✅ |
| Stale-Results Warning | Subtle banner when config changes after results exist | Prevents acting on outdated results | ⚠️ Planned |
| Auto/Manual Toggle | Switch between live generation (250ms debounce) and explicit RUN | Performance: auto for quick iteration, manual for complex configs | ✅ |
| Keyboard Shortcuts | Ctrl+Enter = RUN; Escape = clear category | Power-user navigation | ✅ |
| Shareable URL | Full state encoded into `?s=[base64]` on RUN | Configuration portability | ✅ |
| Viewport Gate | Shows desktop-only message below 1024px width | Prevents broken mobile layout | ✅ |
| Status Bar | Bottom bar shows active category, platform count, strategy count, output count | Persistent state overview | ✅ |
