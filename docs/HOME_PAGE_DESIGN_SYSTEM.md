# Home Page Design System

## Purpose

This document defines the complete design system contract for the home page only.
It includes the full foundation and component rules for:

- buttons
- colors
- layout
- alignment
- typography
- font pairing
- motion and layering
- reusable section and card patterns

This system is intentionally home-scoped and should not be applied to other routes automatically.

## Source Files

- Home design helpers: src/lib/home-page-design-system.ts
- Home shell CSS primitives: src/styles/globals.css
- Home route usage: src/app/page.tsx

## Foundation Tokens

All foundation tokens are exported from src/lib/home-page-design-system.ts via homePageDesignSystem.

### Color System

- Canvas:
	- canvas: #f7f4ef
	- canvasSoft: #f0eee9
	- canvasWarm: #ece7df
- Surface:
	- surface: #ffffff
	- surfaceSoft: #f8f5f2
- Text:
	- primary: #0b0b0c
	- body: #4a4a68
	- secondary: #323232
	- muted: #6b7280
	- inverse: #fafcfe
- Brand:
	- blue: #0020d7
	- blueSoft: #7da3f6
	- indigo: #0e0e2c
	- accent: #3b5bdb
	- accentSoft: #5b74ff
- Borders:
	- card: #d4d4d8
	- input: #e4e4e7
	- action: #929292
	- subtle: #c2c2c2

### Gradient System

- page: linear-gradient(180deg, #f7f4ef 0%, #f0eee9 60%, #ece7df 100%)
- primaryAction: linear-gradient(180deg, #7da3f6 0%, #0020d7 100%)
- secondaryAction: linear-gradient(180deg, #484848 0%, #333333 100%)
- highlight: linear-gradient(208.44deg, #5b74ff 5%, #001bb0 84%)

### Typography System

- Font families:
	- sans: var(--font-poppins)
	- display: var(--font-vina)
	- serifAccent: var(--font-serif)
	- script: var(--font-script)
- Weights:
	- regular 400, medium 500, semibold 600, bold 700

### Font Pairing Rules

- Hero pairing:
	- primary: sans
	- secondary: display
	- usage: high-emphasis opening statement
- Section title pairing:
	- primary: sans
	- secondary: serifAccent (italic keyword)
	- usage: section heading + highlighted accent word
- Testimonial pairing:
	- primary: serifAccent
	- secondary: script
	- usage: quote text + signature line
- Interface pairing:
	- primary: sans
	- secondary: sans
	- usage: labels, helper text, controls

### Type Scale

- hero:
	- mobile: 2.25rem
	- desktop: 4.5rem
	- lineHeight: 0.95
	- tracking: -0.08em
- sectionTitle:
	- mobile: 2.25rem
	- desktop: 3rem
	- lineHeight: 1.05
	- tracking: -0.03em
- body:
	- mobile: 1rem
	- desktop: 1.125rem
	- lineHeight: 1.65
- label:
	- mobile: 0.875rem
	- desktop: 0.9375rem
- caption:
	- mobile: 0.75rem
	- desktop: 0.8125rem

### Spacing, Radius, Shadows

- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128
- Radius:
	- card: 1.75rem
	- pill: 9999px
- Shadows:
	- card: 0 10px 30px rgba(18, 18, 18, 0.08)
	- cardHover: 0 18px 42px rgba(18, 18, 18, 0.14)
	- primaryButton: 0 22px 52px rgba(0, 32, 215, 0.38)
	- subtle: 0 6px 16px rgba(18, 18, 18, 0.08)

## Layout and Alignment

### Layout Contract

- Container:
	- maxWidth: 1200px
	- side padding: 1rem mobile, 2rem tablet, 5rem desktop
- Hero:
	- minHeight: 100vh
	- top offset: 15rem mobile, 20rem desktop
	- content max width: 1400px
- Section rhythm:
	- standard vertical spacing: 6rem
	- compact vertical spacing: 4rem
- Grid:
	- 12 columns
	- 1.5rem standard gap

### Alignment Contract

- Hero:
	- heading center
	- body center
	- CTA row center
- Main sections:
	- title block left
	- body copy left
	- cards use grid-auto flow
- Responsive behavior:
	- mobile: single-column, center-safe controls
	- tablet: constrained width with mixed alignment
	- desktop: left-led composition with intentional visual offsets

## Component System

### Buttons

Base button spec:

- height: 3.875rem
- radius: 9999px
- border: 2.5px solid #929292
- padding: 0.625rem 0.625rem 0.625rem 2rem
- label min width: 5rem
- icon container: 2.625rem circle
- font: Poppins 500, 0.9375rem

Primary button:

- background: primaryAction gradient
- text: #ffffff
- icon circle: white with #0020d7 icon
- hover shadow: primaryButton shadow

Secondary button:

- background: white
- text: #0f172a
- icon circle: #f1f5f9 with #0f172a icon

Interaction behavior:

- hover scale: 1.04
- active scale: 0.97
- icon rotates 45 degrees on hover

Programmatic token access:

- homeButtonTokens("primary")
- homeButtonTokens("secondary")

### Cards

Base card spec:

- border: 5px solid #e4e4e7
- radius: 1.75rem
- background: #ffffff
- base shadow + hover lift

Service bento card:

- min height: 18.75rem
- 3-column bento behavior
- hover lift: -6px

Project preview card:

- radius: 1.5rem
- browser-chrome strip height: 2.5rem

### Section Header Pattern

- title uses sans bold
- accent word uses serifAccent italic medium
- description max width: 48rem
- token getter: homeSectionHeaderTokens()

## Motion and Layering

### Motion

- Durations:
	- fast: 0.2s
	- normal: 0.4s
	- slow: 0.65s
- Easing:
	- emphasized: cubic-bezier(0.22, 1, 0.36, 1)
	- smooth: easeOut
- Patterns:
	- fadeUp
	- card lift
	- magnetic spring CTA
	- icon rotate-on-hover

### Layering

- background: z 0
- decorative: z 10
- content: z 20
- foreground: z 50
- global overlays/cursor: z 9999

## CSS Utility Classes

The following home-only classes are defined in src/styles/globals.css:

- Shell and layout:
	- home-page-shell
	- home-page-content
	- home-page-container
	- home-page-section
	- home-page-section-compact
	- home-grid-12
- Alignment and typography:
	- home-page-header-left
	- home-page-header-center
	- home-page-title
	- home-page-title-accent
	- home-page-body
- Components:
	- home-card
	- home-btn
	- home-btn-primary
	- home-btn-secondary
	- home-btn-icon
- Vertical rhythm helpers:
	- home-stack-sm
	- home-stack-md
	- home-stack-lg

## Helper Functions

From src/lib/home-page-design-system.ts:

- homePageShellClass(className?)
- homePageContentClass(className?)
- homePageContainerClass(className?)
- homeButtonTokens(variant)
- homeSectionHeaderTokens()

## Scope Rule

This design system is for src/app/page.tsx and its home sections only.
Do not auto-apply these primitives to non-home routes unless explicitly requested.

## Home Shell Primitives

The home page uses three classes:

- home-page-shell
- home-page-content
- home-page-container

## Usage

Import helpers from src/lib/home-page-design-system.ts:

- homePageShellClass(className?)
- homePageContentClass(className?)
- homePageContainerClass(className?)

## Rules

1. Use this system only in src/app/page.tsx unless intentionally expanding scope later.
2. Keep hero-level custom effects and section-specific interactions as-is.
3. Use homePageContentClass for layered content blocks above decorative backgrounds.
4. Keep container width and padding centralized through home-page-container.

## Notes

- This system standardizes shell-level styling for the home page only.
- Other pages remain independent and keep their own visual language.
