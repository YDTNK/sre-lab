# Portfolio UI Design Rules

## Purpose

This document defines the visual and layout rules for the SRE Lab public portfolio pages.

It is based on the current Home page and Architecture page implementation:

```text
/
/architecture.html
```

Use this document before adding or changing portfolio pages such as:

```text
/reliability.html
/monitoring.html
/cicd.html
/incidents.html
/cost.html
```

## Current design direction

```text
Monochrome technical portfolio
+
SRE / Platform Engineering evidence dashboard
```

The site should feel:

```text
- calm
- technical
- reliable
- evidence-first
- not consumer-service-like
- not cyber-heavy
- not revenue-LP-like
```

## Source CSS files

Current CSS structure:

```text
apps/landing/portfolio.css
apps/landing/layout-adjustments.css
apps/landing/architecture.css
```

Role of each file:

```text
portfolio.css:
- base colors
- typography base
- sidebar
- hero
- shared sections
- base cards and flows

layout-adjustments.css:
- Home page row/list refinements
- PC/mobile copy switching utilities
- Home Operational Design layout overrides

architecture.css:
- Architecture page-specific role list and flow layout
- Architecture PC block flows
- Architecture mobile vertical flows
```

## Color rules

Use CSS variables from `portfolio.css`.

```css
--color-bg: #f7f7f5;
--color-surface: #ffffff;
--color-sidebar: #fbfbfa;
--color-text: #111111;
--color-text-subtle: #2f2f2f;
--color-muted: #666666;
--color-muted-light: #8a8a86;
--color-border: #d9d9d5;
--color-soft: #efefec;
--color-accent: #007f8f;
--color-accent-dark: #006978;
--color-accent-soft: #e9f8f9;
--color-success: #16875f;
--color-danger: #a43c3c;
```

### Semantic color usage

```text
Main headings:
- var(--color-text)

Section eyebrow / node labels / explanatory accent copy:
- var(--color-accent-dark)

General muted text:
- var(--color-muted)

Low-priority metadata:
- var(--color-muted-light)

Borders:
- var(--color-border)

Cards / content surfaces:
- var(--color-surface)

Positive status:
- var(--color-success)

Expected error / danger status:
- var(--color-danger)
```

### Description copy rule

For the current Home and Architecture pages, description copy is intentionally accent green:

```css
color: var(--color-accent-dark);
```

Apply the same rule to Reliability page explanatory copy unless there is a clear reason not to.

Do not accidentally apply node-label monospace styling to body copy.

## Typography rules

### Base font

The site uses:

```css
font-family:
  Inter,
  "Noto Sans JP",
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

Use inherited font for Japanese headings and body copy.

Use monospace only for:

```text
- sidebar numbers
- eyebrow labels
- card numbers
- node labels such as PG / API / MON / CI / ISS
- metric values where appropriate
```

### PC heading scale

Current approximate PC rules:

```text
Hero title:
- clamp(4rem, 7.3vw, 7.1rem)
- very tight line-height around 0.9

Page hero title:
- clamp(3.3rem, 6.6vw, 6.4rem)
- tight line-height around 0.92

Section h2:
- clamp(2rem, 4vw, 3.15rem)
- line-height around 1

Card h3:
- Home evidence rows: about 1.18rem after adjustment
- Architecture role rows / detail rows: about 1.05rem
- Architecture flow strong labels: about 0.95rem to 1.05rem depending layout
```

### Mobile heading scale

Current approximate mobile rules:

```text
Hero / page hero title:
- clamp(3rem, 15.5vw, 4.9rem)

Section h2:
- about 2rem

Card h3:
- about 0.98rem to 1.04rem
```

### Body copy scale

Current approximate rules:

```text
Hero lead:
- PC: clamp(1rem, 1.6vw, 1.2rem)
- Mobile: about 0.96rem

Home evidence description:
- PC: about 0.95rem
- Mobile: about 0.88rem

Architecture role / flow / detail description:
- PC: about 0.95rem
- Mobile: about 0.88rem
```

Do not reduce mobile body copy below the current readable range unless the text is purely metadata.

## Layout breakpoints

Current breakpoints:

```css
@media (max-width: 1199px)
@media (max-width: 899px)
@media (max-width: 480px)
```

Use them consistently:

```text
>= 1200px:
- full desktop layout
- fixed left sidebar
- large hero
- horizontal or multi-column flows/cards where useful

900px - 1199px:
- sidebar becomes top navigation
- page remains relatively wide
- some grids reduce columns

<= 899px:
- mobile layout
- top horizontal navigation
- hero becomes 1 column
- buttons stack
- flows become vertical
- copy can switch to shorter mobile text

<= 480px:
- tighter page padding
- slightly smaller hero / heading scale
```

## Global spacing rules

### Page shell

Current base values:

```css
--sidebar-width: 250px;
--main-max-width: 1220px;
--main-padding-x: 64px;
--main-padding-y: 64px;
```

Responsive adjustments:

```text
<=1199px:
- main padding x: 40px
- main padding y: 44px

<=899px:
- main padding x: 22px
- main padding y: 14px

<=480px:
- main padding x: 18px
```

### Section spacing

Current rule:

```text
PC:
- evidence / operations sections: about 80px vertical padding

Mobile:
- evidence / operations sections: about 38px to 44px vertical padding
```

Do not introduce sections with much larger or smaller padding unless the page has a clear hierarchy reason.

## Navigation rules

### PC

```text
- Sidebar fixed left
- Width: 250px
- Brand at top
- Navigation links in vertical list
- Active item gets subtle background and left accent border
```

### Tablet / mobile

```text
- Sidebar becomes top navigation
- Navigation links scroll horizontally
- Numeric prefixes are hidden on mobile
- Active item gets bottom accent line
```

All portfolio pages should use the same sidebar structure and active link pattern.

## Hero rules

### Home hero

```text
- Large title: Reliability / Ops Lab
- Two-column layout on PC
- Status card on the right
- One-column layout on mobile
- CTA buttons stack on mobile
```

### Subpage hero

```text
- Use .page-hero
- English eyebrow
- Large page title
- Small Japanese label below title when useful
- Lead copy
- Summary card on PC
- One-column layout on mobile
```

Future pages should follow the Architecture page hero pattern.

## Copy rules

Use desktop/mobile copy variants when Japanese line breaks become awkward.

Current utilities:

```css
.copy-desktop
.copy-mobile
.hero-copy-desktop
.hero-copy-mobile
```

Rules:

```text
- Desktop copy can be longer and more specific.
- Mobile copy should be shorter and avoid awkward punctuation-only line breaks.
- Update desktop and mobile copy together.
- Do not let terms such as API、 or CI/CD、 become isolated lines.
```

## Component rules

## 1. Evidence / navigation rows

Used on Home `Operational Design`.

### PC

Current Home row structure:

```text
number/tag column
+
title column
+
description column
+
link column
```

Approximate CSS behavior:

```text
- display: grid
- transparent row background
- no full card border
- vertical rhythm from row padding
- description in accent green
- row content vertically centered
```

Use this pattern for section lists that act as navigation/evidence overview.

### Mobile

```text
- two-column layout
- left column: number/tag
- right column: title, description, link
- title and description remain readable
- link can sit below description
```

## 2. Architecture role rows

Used on Architecture `System Overview / 役割`.

### PC

Current row structure:

```text
number
+
node label
+
title
+
description
```

Rules:

```text
- one row per component
- node label is accent soft box
- title black
- description accent green
- row items vertically centered
```

### Mobile

```text
- compact 3-column structure
- number + node label + content
- description remains aligned with content column
```

## 3. Flow blocks

Used on Architecture:

```text
Request Flow
Monitoring / Alert Flow
CI/CD Flow
```

### PC

```text
- Use block/card layout
- 4-step flow uses 4 columns
- 5-step flow uses 5 columns
- Thin border around the full flow
- Thin borders between blocks
- Arrow connector between blocks
- Flow label uses accent / monospace
- Flow title uses black text
- Flow description uses accent green
```

### Mobile

```text
- Vertical list
- One step per row
- Downward arrow between rows
- Keep row height compact but readable
- Do not force horizontal scroll for core flow explanation
```

## 4. Detail explanation lists

Used on Architecture:

```text
Technology Choices
Future Expansion
```

Rules:

```text
- Prefer readable explanatory rows/lists
- Do not force dense multi-column cards on mobile
- Use black heading and accent green or muted description consistently
```

## Button rules

```text
- Primary button: black background, white text
- Hover primary: accent dark background
- Secondary button: white surface, border
- Mobile buttons: full width and stacked
```

Do not introduce gradient CTA buttons in the current portfolio style.

## Status / metric card rules

Used on Home status card.

```text
- Use bordered white surface
- Header uses monospace uppercase label
- Operational status uses success green dot
- Metrics use compact label/value structure
- Expected demo error can use danger color but must be clearly labeled expected
```

For Reliability dashboard, reuse this style for service state and SLO cards.

## Page-specific rules

## Home page

Purpose:

```text
First impression and navigation to operational evidence.
```

Rules:

```text
- Keep hero strong and simple.
- Keep status card visible.
- Operational Design is a readable evidence/navigation list.
- Operations Flow is compact and visual.
```

## Architecture page

Purpose:

```text
Show system structure and operational flow.
```

Rules:

```text
- Role section uses readable role rows.
- Flow sections use PC block layout and mobile vertical layout.
- Technology Choices / Future Expansion are explanatory lists.
- Future items must be labeled as future, not current implementation.
```

## Reliability page

Purpose:

```text
Show service state, SLO, endpoint behavior, and operational evidence.
```

Required design alignment:

```text
- Use subpage hero pattern from Architecture.
- Use status / metric card style from Home.
- Use role/evidence row style for endpoint behavior when text-heavy.
- Use flow block pattern for monitoring / response flow.
- Keep /api/error clearly marked as intentional demo behavior.
```

## Do not do

```text
- Do not mix consumer LP design into the SRE portfolio.
- Do not reintroduce cyber-heavy hero imagery as the main visual direction.
- Do not use gradient CTA buttons.
- Do not expose private planning or career-management context.
- Do not make future capabilities look implemented.
- Do not create mobile layouts that require horizontal scrolling for core reading.
- Do not let body copy inherit monospace node-label styling.
- Do not reduce mobile explanatory text to unreadable sizes.
```

## Implementation checklist for new pages

Before implementing a new portfolio page:

```text
[ ] Does the page use the shared sidebar/nav structure?
[ ] Is the active nav item correct?
[ ] Does it use Home or Architecture patterns intentionally?
[ ] Are colors assigned by semantic role?
[ ] Are fonts inherited except for labels/numbers/metrics?
[ ] Are PC and mobile layouts both defined?
[ ] Are copy-desktop and copy-mobile needed?
[ ] Are flow sections cards on PC and vertical on mobile?
[ ] Are explanation sections readable on mobile?
[ ] Are CSS version query strings updated when visual changes are made?
[ ] Is private planning context excluded?
[ ] Are future capabilities clearly marked as future?
```

## Maintenance rule

When a page-level visual rule changes, update this document in the same PR.

When a one-off CSS override becomes repeated across pages, promote it to a shared rule in `portfolio.css` rather than duplicating it in page-specific CSS.
