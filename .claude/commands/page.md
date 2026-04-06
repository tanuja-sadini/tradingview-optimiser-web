# Scaffold a new website page

Scaffold a new page for the TradingView Strategy Optimizer website.

## Arguments
$ARGUMENTS — the page name (e.g. "features", "how-it-works", "pricing").

## Available pages (from website-brief.md §9)
- **homepage** — Hero, problem, how it works, feature highlights, dashboard showcase, CTA
- **features** — Full feature breakdown from brief §3
- **how-it-works** — 6-step workflow from brief §4
- **pricing** — "Coming soon / join waitlist" placeholder
- **download** — macOS download or waitlist, Windows coming soon note

## Design system
Same constraints as the `/component` skill — dark theme, Noto Sans, CSS vars, technical tone.

## Steps
1. Read `website-brief.md` in full before writing any copy — do not invent feature claims.
2. Read `index.html` (the coming soon page) to understand the current CSS variable set and any shared styles.
3. If the project has moved to a framework, match its routing and layout conventions.
4. Build the page with all sections populated using content from `website-brief.md`.
5. Link back to the root and to other pages if they exist.
6. After scaffolding, run `/deploy` to push the update.
