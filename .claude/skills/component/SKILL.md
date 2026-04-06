---
name: component
description: Scaffold a new UI component following the project design system
allowed-tools: Read Write Edit Bash
argument-hint: <component-name> <description>
---

Create a new UI component for the TradingView Strategy Optimizer website.

## Design system constraints (always follow these)

**Colors — use CSS custom properties, never raw hex:**
```css
--bg-darkest:  #1E1F22   /* page background */
--bg-panels:   #2B2D31   /* section/card backgrounds */
--bg-cards:    #313338   /* nested cards */
--bg-elevated: #383A40   /* hover states, tooltips */
--accent:      #5865F2   /* primary CTA, links, highlights */
--accent-hover:#4752C4
--text-primary:#DBDEE1
--text-muted:  #80848E
--green:       #23A55A
--red:         #F23F43
--yellow:      #F0B232
--border:      rgba(255,255,255,0.06)
```

**Typography:** `'Noto Sans'` for body, `'Noto Sans Mono'` for code/metrics
**Font weights:** 400 (body), 500 (labels), 600 (subheadings), 700 (headings)
**Borders:** always `1px solid var(--border)`, radii 8–12px for cards

**Copy tone:**
- Direct and technical — no fluff, no "revolutionary"
- Numbers over adjectives: "1,848 combinations" not "thousands"
- Audience: algorithmic traders who know drawdown, profit factor, Pine Script

## Steps
1. Read `CLAUDE.md` and any existing components to understand current conventions.
2. Ask clarifying questions only if the description in `$ARGUMENTS` is genuinely ambiguous.
3. Build using the stack in use (plain HTML/CSS, or framework if adopted).
4. Never introduce colors or fonts outside the design system.
5. Self-check: mobile layout, copy tone, contrast.
