# Source Index

This `src/` tree is organized by runtime concern first, then by feature.

## Directory Layout

```text
src/
├── app/
│   ├── (marketing)/         # Public routes; group name does not affect URLs
│   │   ├── page.tsx         # /
│   │   ├── about/page.tsx   # /about
│   │   ├── contact/page.tsx # /contact
│   │   ├── pinterest/       # /pinterest and /pinterest/[id]
│   │   ├── projects/        # /projects and /projects/[projectSlug]
│   │   └── services/        # /services and /services/[slug]
│   ├── (admin)/admin/       # /admin routes only
│   ├── (api)/api/           # /api routes only
│   ├── layout.tsx           # Root HTML shell and global metadata
│   ├── robots.ts            # Metadata route for /robots.txt
│   ├── sitemap.ts           # Metadata route for /sitemap.xml
│   └── favicon.svg          # App icon asset
├── components/
│   ├── about/               # About-page specific UI
│   ├── admin/               # Admin shell and admin-only widgets
│   ├── common/              # Shared wrappers and navigation helpers
│   ├── contact/             # Contact page modules
│   ├── effects/             # Reusable motion and visual effects
│   ├── home/                # Home-page specific UI
│   ├── layout/              # Site chrome like navbar/footer/preloader
│   ├── pinterest/           # Pinterest feature UI
│   ├── projects/            # Projects feature UI
│   ├── services/            # Services feature UI
│   └── ui/                  # Generic presentational primitives
├── constants/               # Static typed content constants
├── lib/                     # Data access, auth, Prisma, utilities, contexts
├── seo/                     # Metadata config, helpers, and JSON-LD schema
├── store/                   # Client state stores
├── styles/                  # Global CSS
└── types/                   # Global type augmentations
```

## Routing Notes

- Route groups such as `(marketing)`, `(admin)`, and `(api)` are organizational only.
- Public URLs remain unchanged even though the folders moved.
- Admin routes are isolated and explicitly marked `noindex`.

## Import Alias

The project uses `@/` as an alias for `src/`.

```ts
import Navbar from "@/components/layout/Navbar";
import { createPageMetadata } from "@/seo/page-metadata";
import prisma from "@/lib/prisma";
```

## Conventions

- Keep route files in `src/app` and feature UI in the matching `src/components/<feature>` folder.
- Prefer server components by default and only opt into `'use client'` when interactivity requires it.
- Put cross-route SEO logic in `src/seo` and route-specific metadata beside each page.
