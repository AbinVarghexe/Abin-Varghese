# SEO & Performance

This directory contains all SEO configuration for the Abin Varghese portfolio site.

## File Overview

| File | Purpose |
|------|---------|
| `config.ts` | Site-wide constants — URL, name, social profiles |
| `metadata.ts` | Root `<head>` metadata exported to `app/layout.tsx` |
| `page-metadata.ts` | Per-page metadata factory (`createPageMetadata`) |
| `schema.tsx` | JSON-LD structured data components |

## JSON-LD Schemas in use

- **Person** — identity, social sameAs links, skills, address
- **WebSite** — site-level with `SearchAction` for potential Google sitelinks search
- **BreadcrumbList** — on project detail & service detail pages
- **Service** — on each `/services/[slug]` page
- **SoftwareSourceCode** — on each `/projects/[projectSlug]` page

## Key SEO Features

- ✅ Per-page `<title>` via `template: "%s | Abin Varghese"`
- ✅ Open Graph images with correct `1200×630` dimensions
- ✅ Twitter Card `summary_large_image` on all pages
- ✅ Canonical URLs on every page
- ✅ `hreflang="en-IN"` and `x-default` alternate links
- ✅ Google Search Console verification via `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- ✅ Dynamic sitemap with ISR (revalidates every 24 h)
- ✅ robots.ts blocks AI training scrapers (GPTBot, CCBot, Claude-Web)
- ✅ `generateStaticParams` on service detail pages for static generation

## Environment Variables

```env
NEXT_PUBLIC_SITE_URL=https://abinvarghese.me
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<your-token>
NEXT_PUBLIC_CONTACT_EMAIL=toabinvarghese@gmail.com
```

## Checklist before deploy

- [ ] Verify `NEXT_PUBLIC_SITE_URL` matches production domain exactly
- [ ] Submit `https://abinvarghese.me/sitemap.xml` in Google Search Console
- [ ] Add `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` from Google Search Console
- [ ] Upload an `og-image.jpg` (1200×630 px) to `/public/og-image.jpg`
- [ ] Test structured data at https://search.google.com/test/rich-results
