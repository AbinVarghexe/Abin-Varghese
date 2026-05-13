# 📐 Design System — Abin Varghese Portfolio

> Centralized design documentation for both the **Frontend** (public-facing website) and the **Admin Panel** (CMS/Studio).

---

## Structure

```
design-system/
├── README.md                        ← You are here
├── frontend/
│   └── DESIGN_SYSTEM.md             ← Frontend (portfolio website) tokens & specs
├── admin/
│   └── DESIGN_SYSTEM.md             ← Admin Panel (Studio CMS) tokens & specs
└── admin-panel-redesign/            ← Legacy redesign notes
    └── ...
```

---

## Quick Reference

### Frontend Design System

**Theme:** Warm Canvas + Blue Brand  
**Font:** Poppins (primary), Lora (serif accent), Dancing Script (signatures), Vina (hero display)  
**Brand Color:** `#0020d7`  
**Canvas:** `#f7f4ef`  
**Card Pattern:** `5px border #e4e4e7`, `28px radius`, white surface  
**Button Pattern:** Pill shape, gradient fill, icon circle  
**Motion:** Spring-based (Framer Motion), GSAP scroll-triggered reveals  

→ [Full Frontend Design System](./frontend/DESIGN_SYSTEM.md)

---

### Admin Panel Design System

**Theme:** Apple-Inspired (shell) + Frontend Brand (workspace)  
**Shell Font:** SF Pro Display / system-ui  
**Workspace Font:** Poppins (inherited from frontend)  
**Shell Accent:** `#007aff` (Apple SF Blue)  
**Workspace Accent:** `#0020d7` (Frontend Brand Blue)  
**Shell Background:** `#f5f5f7` (Apple light gray)  
**Workspace Background:** `#f7f4ef` (Frontend warm canvas)  
**Glass Effect:** Sidebar + Header with backdrop-blur  
**Button Pattern:** Pill uppercase, tracking-widest, extrabold  

→ [Full Admin Design System](./admin/DESIGN_SYSTEM.md)

---

## Dual-Layer Architecture

The Admin Panel uses a **dual-layer** approach:

1. **Shell Layer** (sidebar, header, navigation) — Apple-inspired system UI
2. **Workspace Layer** (content editing area) — Frontend brand tokens

This ensures the admin experience feels like a native productivity tool while the content workspace maintains visual consistency with the public frontend.

---

## Source Files

| File | Purpose |
|------|---------|
| `src/styles/globals.css` | All CSS custom properties + utility classes |
| `src/styles/admin.css` | Admin-scoped tokens (`.admin-theme`) |
| `src/lib/home-page-design-system.ts` | Frontend JS token export + helpers |
| `src/components/admin/AdminShell.tsx` | Admin shell layout |
| `src/components/admin/AdminSectionWorkspace.tsx` | Workspace + UI primitives |
