# 🖥️ Admin Panel Design System

> **Studio CMS — Admin Panel**
> Extracted from `admin.css`, `AdminShell.tsx`, `AdminSectionWorkspace.tsx`, and all admin components.
> **Version:** 1.0.0 · **Last Updated:** 2026-05-10

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Sizing](#spacing--sizing)
5. [Border Radius](#border-radius)
6. [Shadows](#shadows)
7. [Glassmorphism](#glassmorphism)
8. [Transitions](#transitions)
9. [Layout System](#layout-system)
10. [Component Specifications](#component-specifications)
11. [Scrollbar Styling](#scrollbar-styling)
12. [Status & Semantic Colors](#status--semantic-colors)
13. [CSS Custom Properties Reference](#css-custom-properties-reference)

---

## Design Philosophy

| Principle | Description |
|-----------|-------------|
| **Apple-Inspired** | SF Pro aesthetic with clean whites, subtle borders, and glassmorphism |
| **Brand Blue Accent** | Uses the frontend's `#0020d7` brand blue inside workspace areas |
| **Apple System Blue** | `#007aff` for admin shell navigation and system accents |
| **Warm Canvas Workspace** | Admin workspace panels use the frontend's `#f7f4ef` canvas theme |
| **Scoped Isolation** | All admin tokens scoped under `.admin-theme` to avoid frontend conflict |
| **Pill-Shaped Actions** | All buttons use rounded-full with uppercase tracking-wider labels |
| **5px Border Cards** | Admin workspace uses chunky 5px borders matching the frontend card style |

---

## Color System

### Shell Colors (Apple-Inspired)

| Token | Value | Usage |
|-------|-------|-------|
| `--admin-color-primary` | `#1d1d1f` | Apple dark text, shell text |
| `--admin-color-blue` | `#007aff` | SF Blue, nav active accents |
| `--admin-color-indigo` | `#1d1d1f` | Shell heading color |
| `--admin-color-white` | `#ffffff` | Shell surface |

### Shell Text Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--admin-text-body` | `#424245` | Apple secondary text |
| `--admin-text-secondary` | `#6e6e73` | Apple tertiary text |
| `--admin-text-muted` | `#86868b` | Muted labels, inactive nav icons |

### Shell Background Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--admin-bg-main` | `#f5f5f7` | Apple light background, page bg |
| `--admin-bg-card` | `#ffffff` | Shell sidebar, header |
| `--admin-bg-secondary` | `#fbfbfd` | Secondary surfaces |
| `--admin-bg-tertiary` | `#f5f5f7` | Tertiary surfaces |
| `--admin-bg-accent` | `#e8e8ed` | Accent backgrounds |

### Shell Border Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--admin-border-light` | `rgba(0,0,0,0.08)` | Subtle dividers, sidebar items |
| `--admin-border-medium` | `rgba(0,0,0,0.12)` | Medium emphasis borders |
| `--admin-border-dark` | `rgba(0,0,0,0.16)` | Strong borders |

### Workspace Colors (Frontend Brand)

These colors are used inside the `AdminSectionWorkspace` content area, matching the frontend design system:

| Color | Hex | Usage |
|-------|-----|-------|
| Brand Blue | `#0020d7` | Section labels, focus rings, primary buttons, icon accents |
| Brand Blue Dark | `#001bb0` | Primary button hover state |
| Text Primary | `#0b0b0c` | Workspace headings |
| Text Body | `#4a4a68` | Workspace descriptions, field labels |
| Text Muted | `#c1c1c1` | Input placeholders |
| Canvas | `#f7f4ef` | Workspace content background |
| Canvas/30 | `#f7f4ef` @ 30% | Workspace header tint |
| Border Card | `#e4e4e7` | Card borders, input borders, workspace borders |
| Canvas Border | `#f7f4ef` | Internal dividers between items |

### Navigation Accent Colors (Per-Section)

| Section | Icon Color | Background |
|---------|-----------|------------|
| Overview | `#007aff` | `bg-[#007aff]/5` |
| Home | `#ff9500` | `bg-[#ff9500]/5` |
| About | `#ff3b30` | `bg-[#ff3b30]/5` |
| Projects | `#af52de` | `bg-[#af52de]/5` |
| Services | `#34c759` | `bg-[#34c759]/5` |
| Contact | `#ff2d55` | `bg-[#ff2d55]/5` |
| Import | `#5856d6` | `bg-[#5856d6]/5` |

---

## Typography

### Font Families

| Context | Stack |
|---------|-------|
| **Admin Shell** | `SF Pro Display, SF Pro Text, -apple-system, BlinkMacSystemFont, Inter, system-ui, sans-serif` |
| **Workspace** | Inherits from root: `Poppins, -apple-system, system-ui, sans-serif` |

### Type Scale

| Element | Size | Weight | Tracking | Usage |
|---------|------|--------|----------|-------|
| Shell Logo | `13px` | Bold | `tight` | "STUDIO" uppercase |
| Shell Status | `10px` | Medium | `wide`, uppercase | "Editing" label |
| Nav Label | `13px` | Medium | — | Sidebar navigation |
| Header Name | `12px` | Semibold | — | Top bar user name |
| Header Role | `10px` | Regular | — | "System Admin" |
| Search Input | `13px` | Regular | — | Search placeholder |
| Section Label | `11px` | Extrabold | `0.2em`, uppercase | "HOME SECTION" overline |
| Section Title | `30px` (3xl) | Bold | `tight` | "Home Page Content" |
| Section Desc | `14px` | Medium | — | Section description |
| Panel Title | `18px` | Bold | `tight` | "Hero Content" subsection |
| Panel Copy | `13px` | Medium | — | Panel descriptions |
| Field Label | `13px` | Bold | `tight` | Input labels |
| Field Input | `14px` | Medium | — | Input text |
| List Title | `16px` | Extrabold | `tight` | List editor titles |
| Button Text | `11px` | Extrabold | `widest`, uppercase | Action buttons |
| Badge Text | `11px` | Extrabold | `wider`, uppercase | Status badges |
| Empty State | `13px` | Bold, italic | — | "No entries detected" |

---

## Spacing & Sizing

### Shell Spacing

| Element | Value |
|---------|-------|
| Sidebar width (expanded) | `256px` (w-64) |
| Sidebar width (collapsed) | `80px` |
| Sidebar padding | `24px` (p-6) |
| Nav item padding | `8px 12px` (py-2 px-3) |
| Nav item gap | `4px` (space-y-1) |
| Header height | `64px` (h-16) |
| Header padding X | `32px` (px-8) |
| Content padding | `32px` (p-8) / `40px` (lg:p-10) |

### Workspace Spacing

| Element | Value |
|---------|-------|
| Workspace outer border | `5px` |
| Workspace header padding | `32px` (px-8 py-8) |
| Workspace content padding | `32px` (p-8) / `48px` (lg:p-12) |
| Workspace content bottom | `128px` (pb-32) |
| Workspace content gap | `48px` (space-y-12) |
| Panel padding | `32px` (p-8) |
| Panel inner gap | `32px` (mb-8) |
| Field spacing | `10px` (space-y-2.5) |
| Input padding | `20px × 16px` (px-5 py-4) |
| List editor padding | `32px` (p-8) |
| List item padding | `32px` (p-8) |
| List items gap | `24px` (space-y-6) |
| Footer divider gap | `24px` (pt-6 mt-6) |

### Icon Sizing

| Element | Size |
|---------|------|
| Shell logo icon | `20px` (w-5 h-5) in `36px` container |
| Nav icons | `18px` (w-[18px]) in `28px` container |
| Header icons (bell, settings) | `20px` (w-5 h-5) |
| Workspace section icon | `28px` (h-7 w-7) in `56px` container |
| Panel section icon | `24px` (h-6 w-6) in `48px` container |
| Field label icon | `14px` |
| List editor icon | `20px` in `40px` container |
| Status badge icon | `14px` (h-3.5 w-3.5) |

---

## Border Radius

| Element | Value | Usage |
|---------|-------|-------|
| Shell logo | `10px` | Logo container |
| Nav items | `8px` (rounded-lg) | Sidebar links |
| Nav icon bg | `6px` (rounded-md) | Active icon background |
| Search input | `9999px` (rounded-full) | Search bar |
| Header notification dot | `9999px` | Red notification indicator |
| User avatar | `9999px` (rounded-full) | Profile image |
| Workspace outer | `33px` (rounded-[33px]) | Main workspace card |
| Workspace section icon | `20px` (rounded-[20px]) | Icon container |
| Panel card | `28px` (rounded-[28px]) | SectionPanel |
| Panel icon container | `18px` (rounded-[18px]) | SectionTitle icon |
| Input fields | `18px` (rounded-[18px]) | Text inputs |
| Textarea | `22px` (rounded-[22px]) | Multi-line inputs |
| Select fields | `18px` (rounded-[18px]) | Dropdown selects |
| List editor container | `33px` (rounded-[33px]) | List wrapper |
| List editor icon | `14px` (rounded-[14px]) | List title icon |
| List items | `24px` (rounded-[24px]) | Individual entries |
| Empty state | `20px` (rounded-[20px]) | No-data placeholder |
| All buttons | `9999px` (rounded-full) | Pill-shaped |
| Status badges | `9999px` (rounded-full) | Pill badges |

---

## Shadows

| Element | Value | Usage |
|---------|-------|-------|
| `--admin-shadow-sm` | `0 2px 4px rgba(0,0,0,0.02)` | Minimal elevation |
| `--admin-shadow-md` | `0 4px 12px rgba(0,0,0,0.05)` | Active sidebar items |
| `--admin-shadow-lg` | `0 12px 24px rgba(0,0,0,0.08)` | Elevated panels |
| Workspace outer | `shadow-2xl shadow-black/5` | Main workspace card |
| Panel cards | `shadow-sm` → `shadow-md` on hover | Section panels |
| List items | `shadow-sm` → `shadow-lg` on hover | List entries |
| Primary button | `shadow-lg shadow-[#0020d7]/20` | Brand blue shadow |
| Danger button | `shadow-lg shadow-[#ff3b30]/20` | Red danger shadow |
| Top header | Implicit from `bg-white/60` | Frosted header |
| Decorative glow | `bg-[#007aff]/5 blur-[120px]` | Background ambient glow |

---

## Glassmorphism

| Token | Value | Usage |
|-------|-------|-------|
| `--admin-glass-bg` | `rgba(255,255,255,0.75)` | Glass surface |
| `--admin-glass-border` | `rgba(255,255,255,0.4)` | Glass border |
| `--admin-glass-blur` | `24px` | Blur intensity |
| Sidebar | `bg-white/80 backdrop-blur-xl` | Sidebar background |
| Header | `bg-white/60 backdrop-blur-xl` | Top bar background |

---

## Transitions

| Token | Value | Usage |
|-------|-------|-------|
| `--admin-transition` | `200ms cubic-bezier(0.4, 0, 0.2, 1)` | All admin transitions |
| Sidebar expand | `transition-all duration-300 ease-in-out` | Sidebar collapse/expand |
| Nav items | `transition-all duration-200` | Navigation hover/active |
| Button tap | `active:scale-95` | All buttons |
| Primary button hover | `hover:scale-105` | Action buttons |
| Panel hover | `transition-all hover:shadow-md` | Section panels |
| List item hover | `transition-all hover:shadow-lg` | List entries |

---

## Layout System

### Shell Structure

```
┌─────────────────────────────────────────────────┐
│ ┌──────────┐ ┌────────────────────────────────┐ │
│ │          │ │ Header (h-16, sticky)          │ │
│ │ Sidebar  │ ├────────────────────────────────┤ │
│ │ (w-64 or │ │                                │ │
│ │  w-[80]) │ │ Content Area (p-8 / lg:p-10)   │ │
│ │          │ │                                │ │
│ │          │ │  ┌──────────────────────────┐  │ │
│ │          │ │  │ AdminSectionWorkspace     │  │ │
│ │          │ │  │ (rounded-[33px], 5px bdr) │  │ │
│ │          │ │  │                          │  │ │
│ │          │ │  │  ┌──────────────────┐    │  │ │
│ │          │ │  │  │ SectionPanel     │    │  │ │
│ │          │ │  │  │ (rounded-[28px]) │    │  │ │
│ │          │ │  │  └──────────────────┘    │  │ │
│ │          │ │  │                          │  │ │
│ │          │ │  └──────────────────────────┘  │ │
│ │          │ │                                │ │
│ └──────────┘ └────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Sidebar States

| State | Width | Content |
|-------|-------|---------|
| Expanded | `256px` (w-64) | Icon + Label + Logo text |
| Collapsed | `80px` | Icon only, centered |

### Header

| Property | Value |
|----------|-------|
| Height | `64px` (h-16) |
| Position | `sticky top-0` |
| Background | `bg-white/60 backdrop-blur-xl` |
| Z-Index | `10` |
| Bottom border | `border-black/[0.05]` |

### Content Area

- Padding: `32px` (p-8) / `40px` (lg:p-10)
- Decorative glow: Centered `#007aff/5` blur `120px` (30rem × 50rem)
- Overflow: `overflow-y-auto overflow-x-hidden`

---

## Component Specifications

### AdminSectionWorkspace (Main Container)

```
Border Radius:    33px (rounded-[33px])
Border:           5px solid #e4e4e7
Background:       white
Shadow:           shadow-2xl shadow-black/5
Header BG:        white/90 + backdrop-blur-2xl
Content BG:       #f7f4ef (warm canvas)
Header Border:    1px solid #e4e4e7 (bottom)
Header Position:  sticky top-0 z-30
```

### SectionPanel

```
Border Radius:    28px (rounded-[28px])
Border:           3px solid #e4e4e7
Background:       white
Shadow:           shadow-sm → hover:shadow-md
Padding:          32px (p-8)
```

### SectionTitle

```
Icon Container:   48px × 48px, rounded-[18px]
Icon BG:          #0020d7/5 with border #0020d7/10
Title:            18px, font-bold, tracking-tight, #0b0b0c
Description:      13px, font-medium, #4a4a68
```

### Field (Input)

```
Label:            13px, font-bold, #4a4a68, tracking-tight
Label Icon:       14px, #0020d7
Input Radius:     18px (rounded-[18px])
Input Border:     2px solid #e4e4e7
Input Padding:    20px × 16px (px-5 py-4)
Input Font:       14px, font-medium, #0b0b0c
Focus Border:     #0020d7
Focus Ring:       4px ring #0020d7/5
Placeholder:      #c1c1c1
```

### TextareaField

```
Radius:           22px (rounded-[22px])
Border:           2px solid #e4e4e7
Padding:          20px × 18px (px-5 py-4.5)
Resize:           vertical
Focus:            Same as Field
```

### SelectField

```
Radius:           18px (rounded-[18px])
Border:           2px solid #e4e4e7
Padding:          20px × 14px (px-5 py-3.5)
Custom Arrow:     SVG chevron, #4a4a68
Appearance:       none (custom styled)
```

### TinyButton

```
Shape:            rounded-full
Border:           2px
Padding:          20px × 8px (px-5 py-2)
Font:             11px, extrabold, uppercase, tracking-wider
Active:           scale(0.95)

Variants:
├── default:  border-#e4e4e7, bg-white, text-#4a4a68, hover:bg-#f7f4ef
├── danger:   border-#ff3b30/20, bg-#ff3b30/5, text-#ff3b30, hover:bg-#ff3b30/10
└── primary:  border-#0020d7/20, bg-#0020d7/5, text-#0020d7, hover:bg-#0020d7/10
```

### ActionButton

```
Shape:            rounded-full
Padding:          24px × 10px (px-6 py-2.5)
Font:             11px, extrabold, uppercase, tracking-widest
Gap:              8px (gap-2)
Active:           scale(0.95)

Variants:
├── primary:   bg-#0020d7, text-white, shadow-lg shadow-#0020d7/20
│              hover: scale(1.05) bg-#001bb0
├── secondary: border-2 border-#929292, bg-white, text-#0b0b0c
│              hover: bg-#f7f4ef
└── danger:    bg-#ff3b30, text-white, shadow-lg shadow-#ff3b30/20
               hover: bg-#e03126
```

### StatusBadge

```
Shape:            rounded-full
Border:           2px
Padding:          16px × 4px (px-4 py-1)
Font:             11px, extrabold, uppercase, tracking-wider
Gap:              8px (gap-2)
Icon:             14px (3.5), strokeWidth 3

Variants:
├── success: bg-#34c759/10, text-#34c759, border-#34c759/30 (Check icon)
├── error:   bg-#ff3b30/10, text-#ff3b30, border-#ff3b30/30 (AlertCircle)
├── warning: bg-#ff9500/10, text-#ff9500, border-#ff9500/30 (AlertCircle)
└── info:    bg-#0020d7/10, text-#0020d7, border-#0020d7/30 (AlertCircle)
```

### ListEditor

```
Container Radius:  33px
Container Border:  3px solid #e4e4e7
Container BG:      #f7f4ef/50
Container Padding: 32px (p-8)
Title Icon:        40px × 40px, rounded-[14px], border-2 #e4e4e7
Item Radius:       24px
Item Border:       2px solid #e4e4e7
Item BG:           white
Item Padding:      32px (p-8)
Item Hover:        shadow-lg
Footer Border:     2px solid #f7f4ef (top)
Empty State:       py-12, bg-white/50, rounded-[20px], dashed border-2 #e4e4e7
```

### Sidebar Navigation Item

```
Padding:          8px 12px (py-2 px-3) expanded / centered collapsed
Radius:           8px (rounded-lg)
Icon Size:        18px in 28px container, rounded-md
Label:            13px, font-medium
Active State:     bg-white, border border-black/[0.03], shadow-sm
                  Icon: colored bg tint + colored icon, strokeWidth 2
Inactive State:   text-#86868b, hover:bg-black/[0.03], hover:text-#1d1d1f
                  Icon: strokeWidth 1.5
```

---

## Scrollbar Styling

```css
/* Scoped to .admin-theme */
Width/Height:     6px
Track:            transparent
Thumb:            rgba(0,0,0,0.1), border-radius 10px
Thumb Hover:      rgba(0,0,0,0.2)
```

---

## Status & Semantic Colors

| Status | Background | Text | Border | Apple Color |
|--------|-----------|------|--------|-------------|
| **Success** | `#34c759/10` | `#34c759` | `#34c759/30` | Apple Green |
| **Error/Danger** | `#ff3b30/10` | `#ff3b30` | `#ff3b30/30` | Apple Red |
| **Warning** | `#ff9500/10` | `#ff9500` | `#ff9500/30` | Apple Orange |
| **Info** | `#0020d7/10` | `#0020d7` | `#0020d7/30` | Brand Blue |
| **Online indicator** | `#34c759` | — | — | Green dot with glow |
| **Notification dot** | `#ff3b30` | — | `2px white` | Red dot |
| **Logout hover** | `#ff3b30/5` | `#ff3b30` | — | Danger hover |

---

## CSS Custom Properties Reference

### Source: `src/styles/admin.css`

All tokens scoped under `.admin-theme` class. Applied via `<div className="admin-theme">` in `AdminShell.tsx`.

### Key Differences from Frontend

| Aspect | Frontend | Admin |
|--------|----------|-------|
| **Primary Font** | Poppins | SF Pro Display / system-ui |
| **Background** | `#f7f4ef` (warm canvas) | `#f5f5f7` (Apple light) |
| **Brand Color** | `#0020d7` (deep blue) | `#007aff` (SF Blue) for shell |
| **Card Border** | `5px solid #e4e4e7` | Various (1px–5px) |
| **Card Radius** | `28px` | `8px–33px` (contextual) |
| **Button Style** | Pill with icon circle | Pill uppercase tracking |
| **Shadow Style** | Warm/organic | Minimal/clinical |
| **Glass Effect** | Navbar only | Sidebar + header |
| **Workspace Colors** | — | Matches frontend tokens exactly |

### Scoping Pattern

```tsx
// Shell level: Apple-inspired system UI
<div className="admin-theme">
  <aside>  {/* SF Pro, #007aff, Apple colors */}
  <header> {/* SF Pro, glass effect */}
  
  // Workspace level: Frontend brand consistency
  <AdminSectionWorkspace>
    {/* Uses #0020d7, #0b0b0c, #4a4a68, #e4e4e7, #f7f4ef */}
    {/* Matches frontend design system tokens */}
  </AdminSectionWorkspace>
</div>
```

This dual-layer approach ensures the admin shell feels like a native Apple application while the workspace content maintains visual consistency with the frontend brand.
