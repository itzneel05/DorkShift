
## System Architecture

DorkShift is a purely client-side single-page application. There is no backend, no database, and no network requests during generation. The only network action is `window.open()` when a user clicks a launch URL.

### High-Level Architecture

```mermaid
flowchart TB
    subgraph Data["Data Layer (src/data/)"]
        CAT[categories.json]
        PLAT[platforms.json]
        MUT[mutations.json]
        FW[frameworks.json]
        TPL[templates.json]
    end

    subgraph Engine["Engine (src/engine/)"]
        PARSER[parser.js]
        CLASSIFIER[intentClassifier.js]
        VOCAB[vocabularyEngine.js]
        MUTENG[mutationEngine.js]
        TRANS[platformTranslator.js]
        FMT[outputFormatter.js]
    end

    subgraph Utils["Utilities (src/utils/)"]
        DEDUP[deduplicator.js]
        SCORER[scorer.js]
        SHARE[shareUrl.js]
        URLB[urlBuilder.js]
    end

    subgraph UI["Components (src/components/)"]
        SEL[SelectionPane]
        CATLIST[CategoryList]
        PLATLIST[PlatformList]
        REC[RecipePane]
        STEP[StrategyStep]
        TPLDROP[TemplateDropdown]
        OUT[OutputPane]
        DORK[DorkRow]
        RUN[RunButton]
    end

    APP[App.jsx] --- Data
    APP --- Engine
    APP --- Utils
    APP --- UI
```

### Data Flow — Generation Pipeline

```mermaid
sequenceDiagram
    participant User
    participant App as App.jsx
    participant Parser as parser.js
    participant Classifier as intentClassifier.js
    participant Vocab as vocabularyEngine.js
    participant Mut as mutationEngine.js
    participant Trans as platformTranslator.js
    participant Fmt as outputFormatter.js
    participant UI as OutputPane

    User->>App: Type seed dork
    App->>Parser: parseDork(input)
    Parser-->>App: parsed tokens
    App->>Classifier: classifyIntent(parsed, categories)
    Classifier-->>App: { category, confidence }
    App->>UI: Update classifier banner

    Note over App: (debounced 300ms)

    User->>App: Select category, platforms, strategies
    App->>App: Update app state

    User->>App: Click RUN (or Auto triggers)
    App->>Vocab: expandVocabulary(category, config)
    Vocab-->>App: keyword variants []

    App->>Mut: runMutations(variants, category, config)
    Mut-->>App: mutated dork strings []

    loop For each active platform
        App->>Trans: translateForPlatform(dorks, platformId, category, platforms, targetState)
        Trans-->>App: { dork, rawDork, launchUrl, operatorType }[]
    end

    App->>Fmt: formatOutput(platformResults, category, config, duration)
    Fmt-->>App: { byPlatform, totalCount }

    App->>UI: setResults(formatted)
```

### Three-Pane Layout

```mermaid
graph LR
    subgraph Browser Window
        direction LR
        P1["Pane 1: SELECTION (22%)<br/>Target input<br/>Seed dork input<br/>Classifier banner<br/>Category list<br/>Platform list"]
        P2["Pane 2: RECIPE (24%)<br/>Template dropdown<br/>5 strategy rows<br/>Config expand/collapse<br/>Summary footer"]
        P3["Pane 3: OUTPUT (54%)<br/>Auto/Manual toggle<br/>Run button<br/>Summary bar + sort<br/>Platform tabs<br/>Dork rows<br/>Status bar (global)"]
    end
```

### Component Tree

```
App.jsx
├── SelectionPane
│   ├── CategoryList
│   └── PlatformList
├── RecipePane
│   ├── TemplateDropdown
│   └── StrategyStep (×5)
└── OutputPane
    └── DorkRow (×N)
```

### State Architecture

All application state lives in `App.jsx`. Components receive state and callbacks as props. No component holds application-level state — only UI-local state (hover, focus, expand/collapse) is kept in components.

**Key state fields:**

| Field | Type | Purpose |
|-------|------|---------|
| `seedInput` | string | Raw seed dork text |
| `selectedCategoryId` | string \| null | Active category |
| `activePlatformIds` | string[] | Enabled platform IDs |
| `enabledMutationIds` | string[] | Enabled mutation strategy IDs |
| `mutationConfigs` | object | Per-mutation config values |
| `classifierResult` | object \| null | Latest classification result |
| `targetType` | string \| null | Target prefix type (d/o/r/h) |
| `targetValue` | string | Target value |
| `results` | object \| null | Generated output |
| `selectedTemplate` | object \| null | Active template |

### Data Schema — platforms.json

```mermaid
erDiagram
    PLATFORM {
        string id
        string name
        string url_template
        string syntax_guide
        string relay "null or platform id"
        object operators "scope, content, metadata, date arrays"
        object target_types "d, o, r, h → operator string or null"
    }
```

### Engine Module Contracts

| Module | Export | Input | Output |
|--------|--------|-------|--------|
| parser.js | `parseDork` | `rawInput: string` | `{ tokens[], platform, type, raw }` |
| parser.js | `parseTarget` | `rawInput: string` | `{ type, value, seedInput, valid, label }` |
| intentClassifier.js | `classifyIntent` | `parsedToken, categories[]` | `{ category, confidence, matchedKeywords[] }` |
| vocabularyEngine.js | `expandVocabulary` | `category, mutationConfig` | `string[]` |
| mutationEngine.js | `runMutations` | `variants[], category, config` | `string[]` |
| platformTranslator.js | `translateForPlatform` | `dorkStrings[], platformId, category, platforms[], targetState` | `{ dork, rawDork, launchUrl, operatorType }[]` |
| platformTranslator.js | `applyTargetOperator` | `dorkString, targetState, platformData, allPlatforms` | `{ displayDork, rawDork, operatorType }` |
| outputFormatter.js | `formatOutput` | `platformResults, category, config, duration` | `{ byPlatform, totalCount, raw, duration }` |
