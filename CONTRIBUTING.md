
## Contributing

DorkShift is hosted on GitHub at `https://github.com/itzneel05/DorkShift`.

### How to Contribute

1. **Fork** the repository.
2. **Create a feature branch** (`git checkout -b feature/my-change`).
3. **Make your changes** and commit them.
4. **Push** to your fork (`git push origin feature/my-change`).
5. **Open a pull request** against the main branch.

### Development Setup

```bash
git clone <your-fork-url>
cd sdme
npm install
npm run dev
```

### Guidelines

- No backend dependencies — all logic must be client-side.
- All data lives in `src/data/` as static JSON — never hardcode in components.
- Engine modules are pure functions with named exports — no side effects.
- Components are props-driven, default exports — no internal data fetching.
- State lives in `App.jsx` — components hold only UI-local state (hover, focus, expand/collapse).
- Use the existing ≤10 colour tokens — no arbitrary hex values.
- No decorative animation — transitions ≤150ms, functional only.
- No popups or modals — everything inline across the 3 panes.

### Reporting Issues

Open an issue on GitHub with:
- A clear title and description
- Steps to reproduce (if bug)
- Browser and OS version
