---
name: page
description: Scaffold a new website page using content from the product brief
argument-hint: <page-name>
---

Scaffold a new page for the TradingView Strategy Optimizer website.

## Available pages (from website-brief.md §9)
- **homepage** — Hero, problem, how it works, feature highlights, dashboard showcase, CTA
- **features** — Full feature breakdown from brief §3
- **how-it-works** — 6-step workflow from brief §4
- **pricing** — "Coming soon / join waitlist" placeholder
- **download** — macOS download or waitlist, Windows coming soon note

## Steps
1. Read `website-brief.md` in full before writing any copy — do not invent feature claims.
2. Read `CLAUDE.md` for design system and tone rules.
3. Read `index.html` to understand current CSS variables and shared styles.
4. If the project has moved to a framework, match its routing and layout conventions.
5. Build the page with all sections populated using only content from `website-brief.md`.
6. Link back to root and other existing pages.
7. Run `/deploy` after scaffolding.

## Page requested
$ARGUMENTS
