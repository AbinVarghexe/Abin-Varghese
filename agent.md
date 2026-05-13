# Agent Instructions

This document defines the core rules, architecture, and technology stack for this repository. You must adhere strictly to these guidelines when making modifications, refactoring, or adding new features.

## 1. Technology Stack
- **Framework**: Next.js 16 (App Router) & React 19.
- **Styling**: Tailwind CSS v4.
- **Animations/3D**: Framer Motion, GSAP, React Three Fiber, Drei, and OGL.
- **Backend/Database**: Supabase (using `@supabase/ssr` and `@supabase/supabase-js`).
- **State Management**: Zustand.
- **UI Components**: Radix UI (via Shadcn) and Lucide React for icons.
- **Language**: TypeScript (strict mode).

## 2. Coding Principles & Guidelines
- **Server vs Client Components**: Use Next.js Server Components by default. Use `"use client"` **only** when absolutely necessary (e.g., when using React hooks like `useState`, `useEffect`, `useRef`, context, or animation libraries like Framer Motion/GSAP).
- **TypeScript**: Always use proper typing. Avoid `any`. Define clear interfaces/types for props, state, and API responses.
- **Styling**: Use Tailwind CSS for all styling. Use `clsx` and `tailwind-merge` (typically via a `cn` utility function) to conditionally merge Tailwind classes safely.
- **Clean Code**: Keep functions pure and concise. Extract reusable logic into custom hooks or utility functions. Avoid deep nesting and over-engineering.

## 3. Database & Backend (Supabase)
- Use `@supabase/ssr` for server-side operations (e.g., inside Route Handlers, Server Components, or Server Actions).
- Follow the official Supabase documentation for Auth and Database interactions in Next.js App Router.
- Keep business logic and complex queries in dedicated utility files or services rather than directly inside UI components.

## 4. Codebase Navigation & Knowledge Graph (`graphify`)
This project leverages `graphify` to maintain a structural index of the codebase.
- **Primary Map**: ALWAYS read `graphify-out/GRAPH_REPORT.md` to understand the high-level architecture, "god nodes," and community structure before doing deep searches.
- **Querying**: If you need to understand how two modules connect, or what a specific concept is, prefer running `graphify query "<question>"` or `graphify path "<A>" "<B>"` in the terminal rather than doing blind `grep` searches.
- **Updating**: Whenever you make significant structural changes to the code, remind the user to run `graphify update .` to keep the graph index up to date.

## 5. Deployment & Execution Checks
- Always verify your code changes by running `npm run lint` and `npm run build` (if applicable) before concluding a task.
- Ensure that responsive design (mobile-first approach) is intact across all screen sizes when making UI updates.
