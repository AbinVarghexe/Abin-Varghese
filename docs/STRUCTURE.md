# Codebase Structure

This repository uses a feature-oriented `src/` layout on top of the Next.js App Router.

## High-Level Tree

```text
portfolio-website/
├── docs/                    # Project docs and implementation notes
├── prisma/                  # Database schema, seed scripts, and Prisma helpers
├── public/                  # Static assets served from the site root
├── src/
│   ├── app/                 # App Router entrypoints and metadata routes
│   │   ├── (marketing)/     # Public-facing routes
│   │   ├── (admin)/admin/   # Admin routes
│   │   ├── (api)/api/       # API routes
│   │   ├── layout.tsx       # Root HTML shell
│   │   ├── robots.ts        # /robots.txt
│   │   └── sitemap.ts       # /sitemap.xml
│   ├── components/          # UI grouped by feature and shared concern
│   │   ├── about/
│   │   ├── admin/
│   │   ├── common/
│   │   ├── contact/
│   │   ├── effects/
│   │   ├── home/
│   │   ├── layout/
│   │   ├── pinterest/
│   │   ├── projects/
│   │   ├── services/
│   │   └── ui/
│   ├── constants/           # Static typed content
│   ├── lib/                 # Data access, auth, utilities, contexts
│   ├── seo/                 # Metadata config, helpers, and JSON-LD
│   ├── store/               # Zustand stores
│   ├── styles/              # Global CSS
│   └── types/               # Type augmentation files
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Notes

- Route groups like `(marketing)`, `(admin)`, and `(api)` do not change URLs; they only keep the source tree organized.
- Shared site chrome now lives under `src/components/layout`.
- Route-specific SEO lives beside each page, while reusable metadata and schema helpers live under `src/seo`.
- Dynamic crawler endpoints are implemented with App Router metadata routes instead of checked-in generated files.
