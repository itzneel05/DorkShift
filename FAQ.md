## Frequently Asked Questions

**Q: Does DorkShift actually search the platforms?**
No. DorkShift generates search queries — it builds the correct URL syntax for each platform. Clicking the ↗ button opens that URL in a new tab. You still need to press Enter (or equivalent) on the platform's search page to execute the search.

**Q: Does DorkShift scan or crawl anything?**
No. It only generates query strings. No network requests, no scanning, no crawling, no validation. The only network action is launching a pre-built URL in a new tab when you click the ↗ button.

**Q: Why 12 platforms? Why not more?**
These 12 cover the most common surface areas for security research: general web search, code repositories, internet scanning, social media, paste sites, and domain intelligence. The platform list can be extended in the data files.

**Q: How do I share my configuration with a teammate?**
Click RUN to generate results. The browser URL updates with a `?s=[base64]` parameter. Copy and send that URL — your teammate's browser will restore the full configuration on load.

**Q: What does the auto-classifier confidence percentage mean?**
It's a 0–1 score based on how many of a category's keywords match your input text. ≥0.4 is considered "confident" and auto-highlights the category. Below 0.4, the classifier suggests a manual pick.

**Q: Why do some platforms show "(relay)" or "(bare)" when I set a target?**
Not all platforms have native scope operators. For example, LinkedIn doesn't have a `site:` operator, so DorkShift relays through Google's `site:linkedin.com` syntax. "Bare" means no operator is available — the query is passed as-is.

**Q: Can I reorder the mutation strategies?**
No. Strategy order is cosmetic-only in v1 and is fixed. Drag-and-drop was evaluated and deferred to avoid introducing a new dependency.

**Q: Why does COPY copy the query body but not the injected operator?**
The injected operator (e.g. `site:example.com`) is a scoping instruction. When you copy, you typically want just the search term. The launch URL always includes the full string (operator + query).

**Q: What does "Output capped at 25 queries per platform" mean?**
The mutation engine limits output to 25 queries per platform to keep generation fast and the display manageable. If you need broader coverage, the limit is configurable.

**Q: Is there a mobile app or mobile layout?**
No. Desktop (>1024px width) is required. Mobile responsive is deferred to a future pass.

**Q: Does DorkShift store any data?**
No. Everything runs in your browser. No data is sent to any server.

**Q: What if the classifier doesn't detect my input correctly?**
Just select the correct category manually from the list. The classifier is a convenience feature, not a gate.
