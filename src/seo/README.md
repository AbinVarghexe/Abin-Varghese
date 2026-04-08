# SEO Configuration - Abin Varghese Portfolio

This folder contains the central SEO setup for https://abinvarghese.me.

## Files

- **config.ts**: Canonical site configuration and absolute URL helpers
- **metadata.ts**: Global App Router metadata shared by the full site
- **page-metadata.ts**: Reusable helper for route-level metadata
- **schema.tsx**: JSON-LD helpers for person, website, breadcrumb, service, and project schema

## Setup

1. Global metadata is exported from `src/seo/metadata.ts` and mounted in `src/app/layout.tsx`
2. Route-level metadata uses `createPageMetadata()` from `src/seo/page-metadata.ts`
3. Structured data is rendered through helpers in `src/seo/schema.tsx`
4. `src/app/robots.ts` and `src/app/sitemap.ts` are the authoritative crawler endpoints

## Page-Level SEO

Each page can export its own metadata:

```tsx
export const metadata: Metadata = createPageMetadata({
  title: "Page Title | Abin Varghese",
  description: "Page description",
  path: "/page-path",
});
```

## Verification

- Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to enable Google Search Console verification
- Set `NEXT_PUBLIC_SITE_URL` when the canonical production domain changes
- Keep the default social image configured in `src/seo/config.ts` available in `public/`
