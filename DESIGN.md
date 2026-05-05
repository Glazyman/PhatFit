# Ahavas Chaya — Visual design system (2026)

This document describes the **editorial / minimalist** direction used across the marketing site, inspired by clean landing layouts: generous whitespace, **pill navigation**, soft **rounded surfaces**, and restrained decoration. Color is built around **royal blue** and **gold** so the brand reads as dignified and warm, not clinical.

---

## 1. Principles


| Principle            | Application                                                                                                                                                                                                                 |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Clarity first**    | Large headings, short supporting lines, one primary action per band when possible.                                                                                                                                          |
| **Air & rhythm**     | Section padding uses `clamp()` so mobile stays breathable and desktop feels premium.                                                                                                                                        |
| **Soft geometry**    | Pills (`border-radius: 999px`), large card radii (`14–28px`), no sharp boxes except where contrast is needed.                                                                                                               |
| **Color discipline** | Royal blue carries structure (nav, links, primary buttons, headings accents). Gold carries **warmth and emphasis** (eyebrow marker, memorial accent, subtle borders, hover hints)—not large gold fields unless intentional. |
| **Accessibility**    | Text/background pairs aim for WCAG AA; gold on white is used for **small** accents or **bold** display text, not long body copy.                                                                                            |


---

## 2. Palette — royal blue & gold

### Core blues (structure)


| Token          | Hex       | Role                                    |
| -------------- | --------- | --------------------------------------- |
| `--blue`       | `#243B73` | Primary brand / links / primary buttons |
| `--blue-hover` | `#1C2F5C` | Hover / pressed                         |
| `--blue-deep`  | `#152445` | Gradients, dark tier cards, depth       |
| `--blue-soft`  | `#E8EDF8` | Icon chips, soft fills                  |
| `--blue-tint`  | `#D4DDF0` | Borders, hover outlines                 |


Supporting neutrals stay in the **cool gray** family so they harmonize with blue (`--ink-`*, `--paper`).

### Gold (warmth & emphasis)


| Token          | Hex       | Role                                                                   |
| -------------- | --------- | ---------------------------------------------------------------------- |
| `--gold`       | `#C9A227` | Eyebrow dot, memorial border option, popular badges, brand mark accent |
| `--gold-hover` | `#B89420` | Hover on gold-tinted controls                                          |
| `--gold-soft`  | `#F5EFDC` | Light panels, subtle highlights                                        |
| `--gold-muted` | `#7A6520` | Muted gold-brown for small text on cream                               |


### Backgrounds

- **Page / hero base**: `#FAFBFD` — barely cool white (reads cleaner than pure gray with royal blue).
- **Elevated sections**: `#FFFFFF` with soft shadow (cards, cream bands).
- **Dark bands** (`section-navy`, dark cards): deep royal gradient anchored at `#152445`, not flat black—keeps cohesion with the blue system.

---

## 3. Typography

- **Family**: Manrope (existing Google Fonts import).
- **Headings**: Tight negative letter-spacing, high weight (800–900). Primary headline may use **royal** for the lead phrase (`.hl-blue` → semantic “brand highlight”).
- **Body / lede**: Slightly cooler gray (`--ink-500` / `--ink-700`) for hierarchy vs. headings.
- **Eyebrow**: Uppercase, tracked, **royal** label with **gold** dot (not iOS blue).

---

## 4. Components

### Navigation (floating pill)

- **Light shell** (reference style): frosted white / very light fill, **subtle royal-tinted border**, soft shadow—**not** a black pill.
- Links: muted ink; **hover** uses `--blue-soft` fill and `--blue` text.
- **Donate** in nav: solid royal primary (or gold fill + royal text on hover variant); must stay obvious as the CTA.

### Hero (home)

- **Minimal decoration**: ambient blobs are **royal + gold mist** at low opacity—no rainbow accent dots.
- **Editorial layout** (wide screens): main column = headline + lede; aside = short supporting line + button row—mirrors “headline + CTA column” reference without changing core messaging.
- **Memorial line**: left border uses **gold** (warm, memorial-appropriate) instead of cold blue.

### Buttons

- **Primary**: Royal fill, white text, shadow tinted royal (not neon blue glow).
- **Secondary**: White / paper fill, royal border, royal text; hover nudges toward `--blue-soft` or light gold wash.

### Cards & tiers

- **Step cards**: Step number circle = royal; shadow = neutral + slight royal.
- **Tier tabs**: Light gray track; active tab = white pill with soft shadow (unchanged behavior, updated tints if needed).
- **Tier cards** (dark): Gradient from `--ink-800` toward `--blue-deep` so they feel **on-brand**, not generic charcoal.

### Raffle page (`assets/raffle.css`)

Raffle tokens (`--r-blue`, `--r-gold`, etc.) **match the same royal + gold** values so the raffle experience and the main site feel like one system.

---

## 5. Implementation map


| Area                                    | File(s)                                                    |
| --------------------------------------- | ---------------------------------------------------------- |
| Tokens, nav, hero, sections, components | `assets/styles.css`                                        |
| Raffle-specific layout & hero           | `assets/raffle.css` (`:root` + gradients)                  |
| Home hero markup                        | `index.html`                                               |

On viewports **under 900px**, the hero stacks with **centered** type and CTAs; from **900px** up, the **two-column editorial** layout applies (headline + lede | aside note + buttons), with a subtle vertical divider beside the CTA column.

---

## 6. Future tweaks

- Illustration or photography can sit in the hero **aside** column later without changing tokens.
- Optional dark-mode pass: invert neutrals; keep royal/gold as accents with adjusted saturation.