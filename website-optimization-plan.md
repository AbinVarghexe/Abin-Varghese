# Website Optimization & Implementation Plan

This plan outlines the systematic execution of the Website Mobile Optimization, SEO, and Performance Improvement tasks, structured based on the requested priorities and your confirmed architectural decisions.

## Architectural Decisions Confirmed
- **CMS Platform**: Supabase + Custom Next.js `/admin` route (Already created, we will extend it).
- **LinkedIn Sync**: Manual JSON/data input fields in the `/admin` panel.
- **Performance vs Visuals**: Selective optimization (disable dragging and heavy effects on mobile, retain lightweight animations).

---

## Phase 1: Priority 1 (Mobile & Core Performance)

**1. Hero Section - Disable Dragging on Mobile**
- Update `Herosection.tsx` (and related interactive board components).
- Implement `window.matchMedia('(max-width: 768px)')` or similar detection to conditionally disable Framer Motion `drag` prop and GSAP instances.
- Apply `touch-action: pan-y` where necessary to ensure smooth vertical scrolling on mobile.

**2. Image & Media Optimization**
- Audit all `img` tags across `d:\DEV\abin\src\components\home\` and `marketing/page.tsx`.
- Migrate to `next/image` where missing.
- Ensure `loading="lazy"` is used appropriately for below-the-fold images.
- Set up responsive sizes and formatting (`webp`/`avif` handled by Next.js automatically if configured correctly in `next.config.ts`).

**3. JavaScript & Animation Optimization**
- Implement dynamic imports (`next/dynamic`) for heavy components further down the page (e.g., `ReviewsSection`, `CreativeToolbox`).
- Add `will-change: transform` and `transform: translateZ(0)` (GPU acceleration) to heavily animated elements.
- Ensure `prefers-reduced-motion` CSS queries are respected for accessibility and lower-end devices.
- Debounce scroll event listeners if any exist manually.

---

## Phase 2: Priority 2 (Admin Features & Core SEO)

**1. Admin Panel - Highlights, Achievements & LinkedIn Manual Sync**
- Extend the Supabase database schema for:
  - `achievements` (title, description, date, category, image/icon, external link, featured toggle, order index).
  - `linkedin_sync` (JSON dump or specific profile fields like latest experience, certifications, skills).
- Create UI forms inside `d:\DEV\abin\src\app\(admin)` to handle CRUD operations for Achievements.
- Add a "LinkedIn Data" manual import field/form to paste exported JSON data or update profile sections quickly.

**2. Frontend Integration for New CMS Content**
- Update the frontend Highlights/Achievements section (e.g., `AboutSection` or create a new `HighlightsSection`) to fetch from Supabase.
- Add skeleton loaders and caching (`revalidate` logic in Next.js).

**3. Core SEO Basics**
- Ensure `metadata` is fully configured in `layout.tsx` and `page.tsx` (titles, descriptions, Open Graph, Twitter cards).
- Configure `sitemap.ts` and `robots.ts` in `src/app/` to correctly map the marketing pages.

---

## Phase 3: Priority 3 (Advanced SEO, Analytics & Security)

**1. Analytics & Tracking Infrastructure**
- Integrate Google Analytics 4 (GA4).
- Add Microsoft Clarity tracking script.
- Ensure scripts are loaded asynchronously (using Next.js `next/third-parties` or `Script` component with `strategy="afterInteractive"`).

**2. AEO (Answer Engine Optimization) & Structured Data**
- Generate JSON-LD Schema markup for `Person`, `WebSite`, and `FAQPage` (if applicable).
- Inject schema into the `<head>` of the application.
- Format textual content with semantic HTML (`<article>`, `<section>`, proper `H1`-`H3` hierarchy) to improve LLM/AEO discoverability.

**3. Security & Accessibility Final Audit**
- Ensure CSP (Content Security Policy) headers are added via `middleware.ts` or `next.config.ts`.
- Run a final Axe/Lighthouse accessibility audit to ensure ARIA labels, contrast ratios, and keyboard navigation are fully compliant.

---

## Next Steps
We will begin immediately with **Phase 1: Hero Section Mobile Dragging Fix**. Once completed, we will move through the performance optimizations.
