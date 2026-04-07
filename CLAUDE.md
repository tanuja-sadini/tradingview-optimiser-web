# TradingView Strategy Optimizer — Website

Promotional website for the TradingView Strategy Optimizer desktop app. Full product brief is in `website-brief.md` — read it before writing any copy or building any page.

## Behavior Rules
- Run only one CLI command at a time — each Bash tool call must contain exactly one command. Never use `&&`, `;`, or `|` to chain commands. Never prefix a command with `cd /some/path &&`. If a working directory change is needed, it must be its own separate Bash call before the next command.
- Read operations within the project directory (ls, cd, git status, git diff, cat, etc.) do not require user permission — run them freely
- Git commit messages must be a single line with no Claude attribution
- Always test and verify what you changed and get the user's confirmation that it works as expected before you commit
- All commits must be authored as `tanuja-sadini <tanujasadini@gmail.com>` (set in local git config)

## Project Structure

```
.
├── index.html                  # Coming soon page (live)
├── wrangler.toml               # Cloudflare Pages config
├── website-brief.md            # Full product brief — source of truth for all copy
├── functions/
│   └── api/
│       └── waitlist.js         # Pages Function — stores signups in KV
└── .claude/
    └── skills/                 # Project slash commands
        ├── component/SKILL.md  # /component — scaffold a UI component
        ├── page/SKILL.md       # /page — scaffold a full page
        ├── deploy/SKILL.md     # /deploy — deploy to Cloudflare Pages
        └── waitlist/SKILL.md   # /waitlist — read KV signups
```

## Deployment

- **Platform:** Cloudflare Pages
- **Project name:** `tradingviewoptimizer`
- **Production domain:** tradingviewoptimizer.com
- **Pages.dev URL:** tradingviewoptimizer.pages.dev
- **Deploy command:** `wrangler pages deploy . --project-name tradingviewoptimizer --branch main`
- **KV binding name:** `WAITLIST` (namespace ID and account ID are in `wrangler.toml`)

## Design System

### Colors
```css
--bg-darkest:  #1E1F22   /* page background */
--bg-panels:   #2B2D31   /* section backgrounds */
--bg-cards:    #313338   /* cards */
--bg-elevated: #383A40   /* hover states, tooltips */
--accent:      #5865F2   /* primary CTA, links */
--accent-hover:#4752C4
--text-primary:#DBDEE1
--text-muted:  #80848E
--green:       #23A55A
--red:         #F23F43
--yellow:      #F0B232
--border:      rgba(255,255,255,0.06)
```

### Typography
- Body: `'Noto Sans'` — weights 400, 500, 600, 700
- Monospace / metrics: `'Noto Sans Mono'`
- Google Fonts import is already in `index.html`

### Visual Rules
- Dark backgrounds only — no light mode
- Borders: `1px solid var(--border)`, radii 8–12px
- Status colors: green = connected/success, yellow = running/warning, red = error

## Copy & Tone

- Audience: algorithmic traders who know Pine Script, drawdown, profit factor
- Direct and technical — no fluff, no "revolutionary" or "game-changing"
- Numbers over adjectives: "runs 1,848 combinations" not "runs thousands"
- Do not invent feature claims — only use what is in `website-brief.md`

## Content Rules

- Product is **not open source** — no GitHub links
- No cloud features — all data is local (SQLite)
- TradingView is a third-party product — reference accurately
- Pricing is TBD — use waitlist / "coming soon" CTAs
- Available on macOS, Windows, and Linux simultaneously — all three platforms launch together
