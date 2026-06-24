
## Glossary

| Term | Definition |
|------|------------|
| **Category** | One of 30 detection classes (e.g. `db_credentials`, `ssh_keys`, `aws_credentials`). Each category has a keyword set, severity level, and example queries. |
| **Classifier** | The intent classification engine (`intentClassifier.js`) that matches user input against category keywords and returns a confidence score. |
| **Dork** | A search query string designed to locate specific patterns on a search platform (e.g. `site:example.com "DB_PASSWORD"`). |
| **DorkShift** | The Semantic Dork Mutation Engine — generates semantic variants of search queries and translates them into per-platform syntax. |
| **Framework-Specific** | A mutation strategy that generates queries matching known configuration and secret patterns for specific web frameworks (Django SECRET_KEY, Rails secret_key_base, etc.). |
| **Mutation Strategy** | One of five transformation algorithms that generate dork variants: case, separator, synonym, framework-specific, and file extension. |
| **Operator** | A platform-specific search qualifier (e.g. `site:`, `repo:`, `inurl:`, `port:`). Each platform has its own set of operators. |
| **Operator Type** | Classification of how a target operator is applied: `native` (the platform's own operator), `relay` (Google relay via `site:` prefix), or `bare` (no operator available). |
| **Platform** | One of 12 search surfaces (Google, GitHub, Shodan, Censys, X/Twitter, LinkedIn, Pastebin, VirusTotal, URLscan, FOFA, grep.app, PublicWWW). |
| **Recipe Pane** | The middle pane containing template selection and 5 toggleable mutation strategy rows. |
| **Relay** | The mechanism by which platforms without native operators (LinkedIn, Pastebin) route queries through Google with a `site:` prefix. |
| **Seed Dork** | The initial input string that triggers the generation pipeline. |
| **Selection Pane** | The left pane containing target input, seed dork input, classifier banner, category list, and platform list. |
| **Semantic Variant** | A synonym or transformation of a keyword that preserves the same meaning (e.g. `password`, `passwd`, `pwd`, `secret`). |
| **Target Injection** | The process of prepending a platform-specific scope operator (e.g. `site:example.com`) to each generated dork based on the user's target prefix (`d:`, `o:`, `r:`, `h:`). |
| **Template** | A pre-configured pack that loads a specific category, platform subset, and mutation strategy configuration in one click. |
