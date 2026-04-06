# Create a new UI component

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

**Tone rules (copy inside components):**
- Direct and technical — no fluff, no "revolutionary"
- Numbers over adjectives: "1,848 combinations" not "thousands"
- Target audience: algorithmic traders who know drawdown, profit factor, Pine Script

## Arguments
$ARGUMENTS — the component name and a brief description of what it should do.

## What to do
1. Ask clarifying questions only if the description is genuinely ambiguous.
2. Build the component using semantic HTML + CSS (inline `<style>` or separate `.css` file as appropriate for the stack in use).
3. If the project has moved to a framework (React/Astro/etc.), match its conventions exactly.
4. Never introduce new color values or fonts not in the design system above.
5. After writing, run a quick self-check: does it look right on mobile? Does the copy match the tone rules?
