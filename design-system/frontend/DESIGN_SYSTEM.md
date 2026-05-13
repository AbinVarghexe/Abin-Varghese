# 🎨 Frontend Design System

> **Portfolio Website — Abin Varghese**
> Extracted from `globals.css`, `home-page-design-system.ts`, and all frontend components.
> **Version:** 1.0.0 · **Last Updated:** 2026-05-10

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Sizing](#spacing--sizing)
5. [Border Radius](#border-radius)
6. [Shadows](#shadows)
7. [Gradients](#gradients)
8. [Transitions & Motion](#transitions--motion)
9. [Layout System](#layout-system)
10. [Z-Index Layers](#z-index-layers)
11. [Component Specifications](#component-specifications)
12. [Responsive Breakpoints](#responsive-breakpoints)
13. [CSS Custom Properties Reference](#css-custom-properties-reference)

---

## Design Philosophy

| Principle | Description |
|-----------|-------------|
| **Warm Canvas** | Light warm-toned backgrounds (`#f7f4ef`) instead of cold whites |
| **Blue Brand Accent** | `#0020d7` as the primary brand color with gradient treatments |
| **Typographic Hierarchy** | 4 font families with intentional pairing rules |
| **Motion-First** | Spring-based micro-interactions on every interactive element |
| **Grid + Organic** | Structured 12-column grid with organic rounded corners and floating decorative elements |

---

## Color System

### Core Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#0b0b0c` | Primary text, body default |
| `--color-blue` | `#0020d7` | Brand blue, CTAs, links |
| `--color-indigo` | `#0e0e2c` | Heading color (h1, h2) |
| `--color-white-main` | `#fafcfe` | Inverse text on dark surfaces |

### Canvas & Surface (Home Page Shell)

| Token | Hex | Usage |
|-------|-----|-------|
| `--home-color-canvas` | `#f7f4ef` | Page background |
| `--home-color-canvas-soft` | `#f0eee9` | Gradient midpoint |
| `--home-color-canvas-warm` | `#ece7df` | Gradient endpoint |
| `--home-color-surface` | `#ffffff` | Card / component surface |
| `--home-color-surface-soft` | `#f8f5f2` | Muted surface |

### Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--home-color-text-primary` | `#0b0b0c` | Headlines, primary text |
| `--home-color-text-body` | `#4a4a68` | Body copy, descriptions |
| `--home-color-text-secondary` | `#323232` | Secondary labels |
| `--home-color-text-muted` | `#6b7280` | Helper text, captions |
| `--home-color-text-inverse` | `#fafcfe` | Text on blue/dark backgrounds |

### Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `brand.blue` | `#0020d7` | Primary brand, CTA fill |
| `brand.blueSoft` | `#7da3f6` | Gradient start, soft accent |
| `brand.accent` | `#3b5bdb` | Cursor bubble, secondary accent |
| `brand.accentSoft` | `#5b74ff` | Highlight gradient start |

### Background Colors (Figma Legacy Tokens)

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg-main` | `#ECECEC` | Global fallback background |
| `--color-bg-card` | `#e1e1e1` | Legacy card background |
| `--color-bg-secondary` | `#e4e3e3` | Secondary surfaces |
| `--color-bg-tertiary` | `#d9d9d9` | Tertiary surfaces |
| `--color-bg-accent` | `#d8d8d8` | Ticker/marquee background |

### Border Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--home-color-border-card` | `#e4e4e7` | Card borders (5px) |
| `--home-color-border-action` | `#929292` | Button borders (2.5px) |
| `--home-color-border-subtle` | `#c2c2c2` | Light dividers |
| `--color-border-primary` | `#aaaaaa` | Legacy primary border |

### Semantic Colors (Tailwind Inline)

| Color | Hex / Class | Context |
|-------|-------------|---------|
| Blue accent text | `#2563eb` / `text-blue-600` | Section heading italic accent |
| Zinc 900 | `text-zinc-900` | Sub-section headings |
| Zinc 500 | `text-zinc-500` | Tool descriptions, secondary copy |
| Slate 600 | `text-slate-600` | Hero subcopy |
| Slate 400 | `text-slate-400` | Status line text |
| Black/70 | `text-black/70` | Body text in About/Reviews |

---

## Typography

### Font Families

| Token | Stack | Usage |
|-------|-------|-------|
| `--font-sans` | `Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif` | All UI text, headings, buttons |
| `--font-display` | `Vina (local font), sans-serif` | Hero display text only |
| `--font-serif` | `Lora, serif` | Section heading italic accents |
| `--font-script` | `Dancing Script, cursive` | Testimonial signatures |

### Font Pairing Rules

| Context | Primary | Secondary | Example |
|---------|---------|-----------|---------|
| **Hero** | `sans` (Poppins) | `display` (Vina) | Main greeting + name |
| **Section Headings** | `sans` bold | `serifAccent` italic | "Featured *Work*" |
| **Testimonials** | `serifAccent` italic | `script` | Quote body → "—Name" |
| **Interface** | `sans` | `sans` | Buttons, labels, metadata |

### Type Scale

| Level | Mobile | Desktop | Weight | Line Height | Tracking |
|-------|--------|---------|--------|-------------|----------|
| **Hero Name** | `48px` | `72px` (7xl) | 600 | 0.9 | `-0.08em` |
| **Section Title** | `36px` (4xl) | `48px` (5xl) | 700 | 1.05 | `tight` |
| **Sub-section** | `24px` (2xl) | `30px` (3xl) | 700 | 1.1 | — |
| **Body** | `16px` (base) | `18px` (lg) | 400 | 1.65 | — |
| **Label** | `14px` | `15px` | 500 | 1.3 | — |
| **Caption** | `12px` | `13px` | 400–500 | 1.3 | — |
| **Status/Micro** | `10px` | `12px` | 500 | — | `0.2–0.3em` (uppercase) |

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `--font-weight-light` | 300 | Decorative sparkle characters |
| `--font-weight-regular` | 400 | Body text |
| `--font-weight-medium` | 500 | Buttons, labels, navigation |
| `--font-weight-semibold` | 600 | H1-H2 headings |
| `--font-weight-bold` | 700 | Section titles, emphasis |

---

## Spacing & Sizing

### CSS Variable Tokens (Figma)

| Token | Value |
|-------|-------|
| `--spacing-xs` | `5px` |
| `--spacing-sm` | `10px` |
| `--spacing-md` | `15px` |
| `--spacing-lg` | `20px` |
| `--spacing-xl` | `30px` |
| `--spacing-2xl` | `50px` |
| `--spacing-3xl` | `70px` |

### JS Design System Scale

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | `4px` | Micro gaps |
| `sm` | `8px` | Tight spacing |
| `md` | `12px` | Default gap |
| `lg` | `16px` | Component padding |
| `xl` | `24px` | Section gap |
| `2xl` | `32px` | Large gap |
| `3xl` | `48px` | Section padding |
| `4xl` | `64px` | Major sections |
| `5xl` | `96px` | Section block padding |
| `6xl` | `128px` | Max section spacing |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `8px` | Small elements |
| `--radius-md` | `15px` | Cards, secondary containers |
| `--radius-lg` | `25px` | Gradient sections |
| `--radius-xl` | `33px` | Primary cards |
| `--radius-2xl` | `53.5px` | Large containers |
| `--radius-full` | `9999px` | Pill buttons, badges, tags |
| `card` (Home) | `1.75rem` (28px) | Home page cards |
| Inline | `24px` | Tool cards, dropdowns |
| Inline | `32px` | Brand section container |

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-card` | `5px 7px 32.3px 0px rgba(0,0,0,0.5)` | Legacy card shadow |
| `--home-shadow-card` | `0 10px 30px rgba(18,18,18,0.08)` | Home card default |
| `--home-shadow-card-hover` | `0 18px 42px rgba(18,18,18,0.14)` | Home card hover |
| `--home-shadow-primary-button` | `0 22px 52px rgba(0,32,215,0.38)` | Primary CTA hover |
| `--home-shadow-subtle` | `0 6px 16px rgba(18,18,18,0.08)` | Subtle elevation |
| Social tile hover | `0 28px 56px rgba(97,70,255,0.22)` | Social icon tiles |

---

## Gradients

| Name | Value | Usage |
|------|-------|-------|
| **Primary Action** | `linear-gradient(180deg, #7da3f6 0%, #0020d7 100%)` | Primary CTA buttons, hero name |
| **Secondary Action** | `linear-gradient(180deg, #484848 0%, #333333 100%)` | Dark buttons (About CTA) |
| **Highlight** | `linear-gradient(208.44deg, #5b74ff 5%, #001bb0 84%)` | Project CTAs, resume button |
| **Brands BG** | `linear-gradient(180deg, rgba(125,163,246,0.85) 0%, rgba(0,32,215,0.85) 100%)` | Brands banner |
| **Page Canvas** | `linear-gradient(180deg, #f7f4ef 0%, #f0eee9 60%, #ece7df 100%)` | Page background |
| **Blue Star SVG** | `#3b82f6 → #60a5fa` | Review star fills |

---

## Transitions & Motion

### CSS Transition Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--transition-fast` | `200ms ease` | Hover states |
| `--transition-normal` | `300ms ease` | General transitions |
| `--transition-slow` | `500ms ease` | Entrance animations |

### Easing Curves

| Name | Value | Usage |
|------|-------|-------|
| **Emphasized** | `cubic-bezier(0.22, 1, 0.36, 1)` | Hero entrance, fade-up |
| **Spring** | `stiffness: 400, damping: 30` | Button magnetic effect |
| **Smooth** | `easeOut` | Section scroll-reveal |
| **Icon Spring** | `stiffness: 500, damping: 22` | Icon rotation on hover |

### Animation Patterns

| Pattern | Implementation | Duration |
|---------|----------------|----------|
| **Fade Up** | `opacity: 0→1, y: 28→0, blur: 4px→0` | 0.65s |
| **Scale In** | `opacity: 0→1, scale: 0.88→1` | 0.55s |
| **Stagger Children** | `staggerChildren: 0.10, delayChildren: 0.05` | — |
| **Hover Lift** | `translateY(-6px)` cards / `translateY(-8px)` social tiles | Spring |
| **Magnetic Button** | Pointer-reactive spring `x/y` · factor 0.28 | Spring 320/28 |
| **Waving Hand** | `rotate: [0, 25, -5, 20, -10, 0]` | 1.8s, repeat ∞ |
| **Name Letter Bounce** | Each `y: 40→0`, hover `scaleY: 1.3, y: -12` | Spring 400/10 |
| **Marquee** | `x: ['0%', '-50%']` linear infinite | 15–30s |
| **Scroll Reveal** | GSAP `fromTo` + ScrollTrigger | 1s, power3.out |
| **Button Hover** | `scale(1.04)` + shadow | Spring |
| **Button Tap** | `scale(0.97)` | Spring |
| **Icon Rotate** | `rotate: 45deg` on parent hover | Spring 500/22 |

---

## Layout System

### Container

| Property | Mobile | Tablet (640px) | Desktop (1024px) |
|----------|--------|----------------|------------------|
| Max Width | `100%` | `100%` | `1200px` |
| Side Padding | `1rem` | `1.5rem` | `5rem` |

### Section Spacing

| Type | Padding Block |
|------|---------------|
| Standard Section | `6rem` (96px) |
| Compact Section | `4rem` (64px) |
| Hero Top Offset | `176px` (mobile) / `320px` (desktop) |

### Grid

- **Columns:** 12 (`home-grid-12`)
- **Gap:** `1.5rem` (24px)
- **Section content max-width:** `1200px`
- **Hero content max-width:** `1400px`

### Background Patterns

| Element | Grid Size | Color/Opacity |
|---------|-----------|---------------|
| Vertical lines (body) | `100px` | `rgba(0,0,0,0.12)` |
| Hero grid | `84px × 84px` | `rgba(0,32,215,0.14)` |
| Hero dots | `42px × 42px` | `rgba(0,32,215,0.35)` |
| Project card grid | `80px × 80px` | `rgba(0,0,0,0.08)` |
| Brands grid | `80px × 80px` | white 50% opacity |

---

## Z-Index Layers

| Layer | Z-Index | Usage |
|-------|---------|-------|
| Background | `0` | Page canvas, grid patterns |
| Decorative | `10` | Floating dots, blur glows |
| Content | `20` | All section content, cards |
| Foreground | `50` | Hero text, CTAs |
| Navbar | `110` | Fixed floating nav |
| Overlay | `9999` | Custom cursor bubble |

---

## Component Specifications

### Pill Button (Primary CTA)

```
Height:       3.875rem (62px)
Radius:       9999px (pill)
Border:       2.5px solid #929292
Padding:      0.625rem 0.625rem 0.625rem 2rem
Font:         Poppins, 15px (desktop) / 13px (mobile), weight 500
Icon Circle:  2.625rem × 2.625rem, white bg, pill radius
Hover:        scale(1.04) + blue shadow
Tap:          scale(0.97)
Primary BG:   linear-gradient(180deg, #7da3f6 → #0020d7)
Secondary BG: #ffffff, text #0f172a
```

### Card (Home)

```
Radius:       1.75rem (28px)
Border:       5px solid #e4e4e7
Background:   #ffffff
Shadow:       0 10px 30px rgba(18,18,18,0.08)
Hover Shadow: 0 18px 42px rgba(18,18,18,0.14)
Hover Lift:   translateY(-6px)
```

### Social Tile

```
Size:         56px (mobile) / 64px (desktop)
Radius:       16px (mobile) / 20px (desktop)
Background:   #ffffff
Border:       1px solid rgba(255,255,255,0.9)
Shadow:       0 16px 38px rgba(97,77,219,0.12)
Hover:        y: -8px, scale: 1.08, shadow intensified
```

### Navbar (Floating)

```
Position:     Fixed, top: 60px, centered
Width:        75%, scale 0.95
Height:       80px
Radius:       60px
Background:   rgba(236,236,236,0.7)
Backdrop:     blur(16px) saturate(180%)
Border:       1px solid rgba(0,0,0,0.1)
Nav Font:     18px, color #111827
Z-Index:      110
```

### Section Header Pattern

```
Title:        4xl→5xl, font-bold, tracking-tight, text-black
Accent Word:  text-blue-600, font-serif, italic, font-medium
Body:         base→lg, text-black/70, leading-relaxed
Max Width:    max-w-3xl (body), max-w-[1200px] (container)
```

### Review Card (Testimonial)

```
Aspect Ratio: 1.4:1
Max Width:    550px
Background:   #fdfaf6 (warm parchment)
Radius:       rounded-md
Border:       1px solid stone-200
Shadow:       0 10px 40px rgba(0,0,0,0.08)
Stars:        SVG blue gradient fill
Quote Font:   serif, italic, 14px→17px
Signature:    script font, 30px→48px
Designation:  10px→12px, tracking 0.3em, uppercase
```

### Tool Card

```
Padding:      16px→24px
Background:   #ffffff
Radius:       24px
Border:       1px solid zinc-200
Icon Size:    56px in zinc-50 bg, rounded-lg
Hover:        border-zinc-300, shadow-sm
```

### Tag (Filter)

```
Height:       44px
Padding:      12px 16px
Radius:       9999px
Border:       2px solid #9b9b9b
Active BG:    gradient-blue, white text
Inactive BG:  white, #1e2939 text
```

### Brands Section Container

```
Radius:       32px
Border:       3px (mobile) / 5px (desktop) solid #C4C4C4
Background:   Blue gradient 85% opacity + backdrop-blur(8px)
Grid overlay: 80px white lines at 50% opacity
```

### Availability Pill

```
Width:        300px (mobile) / 380px (desktop)
Radius:       9999px
Border:       1px solid slate-200
Background:   rgba(255,255,255,0.7) + backdrop-blur-md
Text:         12px (mobile) / 14px (desktop), medium weight
Color:        #0020d7 (available) / orange-600 (busy)
```

---

## Responsive Breakpoints

| Breakpoint | Width | Strategy |
|------------|-------|----------|
| **Mobile** | `<640px` | Single column, center-aligned, larger touch targets |
| **sm** | `≥640px` | Mixed alignment, constrained width |
| **md** | `≥768px` | Desktop nav, hide mobile elements |
| **lg** | `≥1024px` | Full grid, left-aligned, side padding 5rem |
| **xl** | `≥1280px` | Max container, decorative elements |

### Mobile-Specific Rules

- Parallax/3D effects disabled below 768px
- Single column layouts
- Simplified card stacks (swipe-based)
- Mobile dock navigation instead of floating navbar
- Touch-optimized button sizes (min 44px tap targets)

---

## CSS Custom Properties Reference

### Source: `src/styles/globals.css`

All custom properties defined in `:root` and `.home-page-shell` scope. The `@theme inline` block maps CSS variables to Tailwind utility classes.

### Source: `src/lib/home-page-design-system.ts`

Exported as `homePageDesignSystem` constant with helpers:
- `homePageShellClass(className?)` → shell root class
- `homePageContentClass(className?)` → content wrapper class
- `homePageContainerClass(className?)` → constrained container class
- `homeButtonTokens(variant)` → button design tokens
- `homeSectionHeaderTokens()` → section header tokens

### Utility Classes (globals.css)

| Class | Purpose |
|-------|---------|
| `.home-page-shell` | Root wrapper with all CSS variables |
| `.home-page-content` | Content layer (z-10) |
| `.home-page-container` | Max-width + responsive padding |
| `.home-page-section` | Standard section padding (6rem) |
| `.home-page-section-compact` | Compact section padding (4rem) |
| `.home-page-title` | Responsive section title |
| `.home-page-title-accent` | Italic serif accent word |
| `.home-page-body` | Responsive body text |
| `.home-card` | Card with border, shadow, hover lift |
| `.home-btn` | Pill button base |
| `.home-btn-primary` | Primary gradient button |
| `.home-btn-secondary` | White secondary button |
| `.home-btn-icon` | Icon circle inside button |
| `.home-grid-12` | 12-column grid |
| `.home-stack-sm/md/lg` | Flex column with gap variants |
| `.cv-auto` | Content-visibility optimization |
| `.text-gradient-blue` | Blue gradient text clip |
| `.text-gradient-gray` | Gray gradient text clip |
