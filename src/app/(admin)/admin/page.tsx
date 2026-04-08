"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  ArrowRight,
  Database,
  Eye,
  EyeOff,
  FolderKanban,
  Home,
  Layers3,
  Mail,
  RefreshCw,
  User,
} from "lucide-react";

const sections = [
  {
    title: "Home Section",
    description:
      "Edit hero copy, social media handles, page routing links, and homepage rolling content.",
    href: "/admin/home",
    icon: Home,
    tone: "from-blue-400/20 via-blue-500/10 to-transparent border-blue-300/60",
  },
  {
    title: "About Section",
    description: "Manage scrapbook hero image and about-page side-card image/link pairs.",
    href: "/admin/about",
    icon: User,
    tone: "from-orange-300/25 via-amber-400/10 to-transparent border-amber-300/60",
  },
  {
    title: "Import Section",
    description:
      "Export full admin-managed content as JSON and import updates safely into this project.",
    href: "/admin/import",
    icon: Database,
    tone: "from-cyan-300/25 via-cyan-400/10 to-transparent border-cyan-300/60",
  },
  {
    title: "Project Section",
    description:
      "Create, edit, and remove portfolio projects stored in the database with complete metadata.",
    href: "/admin/projects",
    icon: FolderKanban,
    tone: "from-violet-300/25 via-violet-400/10 to-transparent border-violet-300/60",
  },
  {
    title: "Service Section",
    description:
      "Edit services and their subsection project showcases, descriptions, and CTA configuration.",
    href: "/admin/services",
    icon: Layers3,
    tone: "from-emerald-300/25 via-emerald-400/10 to-transparent border-emerald-300/60",
  },
  {
    title: "Contact Section",
    description: "Manage contact page handles, contact email, form status, and submission inbox.",
    href: "/admin/contact",
    icon: Mail,
    tone: "from-rose-300/25 via-pink-400/10 to-transparent border-rose-300/60",
  },
];

export default function AdminOverviewPage() {
  const [showPreview, setShowPreview] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  function refreshPreview() {
    if (!iframeRef.current) {
      return;
    }

    iframeRef.current.src = iframeRef.current.src;
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] overflow-hidden rounded-2xl border border-[var(--color-border-light)] bg-[#f7f4ef] shadow-[0_18px_42px_rgba(16,24,40,0.08)]">
      <div className={`${showPreview ? "max-w-4xl" : "max-w-none"} flex-1 border-r border-[var(--color-border-light)] bg-white/75 transition-all duration-300`}>
        <header className="sticky top-0 z-10 border-b border-[var(--color-border-light)] bg-[#f8f5f2]/95 px-6 py-4 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#0020d7]">Admin Studio</p>
              <h2 className="mt-1 text-2xl font-semibold text-[#0b0b0c]">Section Control Center</h2>
              <p className="mt-2 max-w-2xl text-sm text-[var(--color-text-body)]">
                Manage each site area independently using the same visual language as the main website.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPreview((current) => !current)}
                className="rounded-full border border-[var(--color-border-dark)] bg-white px-3 py-2 text-[#0b0b0c] transition hover:bg-[#f3f4f6]"
                title="Toggle live preview"
              >
                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={refreshPreview}
                className="inline-flex items-center gap-2 rounded-full border-[2px] border-[var(--color-border-dark)] bg-[#dbe7ff] px-4 py-2 text-sm font-medium text-[#0020d7] shadow-[0_8px_18px_rgba(0,32,215,0.14)]"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Preview
              </button>
            </div>
          </div>
        </header>

        <div className="space-y-6 p-6 lg:p-8">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {sections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="group relative overflow-hidden rounded-2xl border border-[var(--color-border-light)] bg-white/90 p-5 transition hover:border-[var(--color-border-medium)] hover:shadow-[0_14px_30px_rgba(11,11,12,0.08)]"
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${section.tone}`} />

                <div className="relative">
                  <div className="mb-4 inline-flex rounded-xl border border-[var(--color-border-light)] bg-white/95 p-2.5 shadow-sm">
                    <section.icon className="h-5 w-5 text-[#0020d7]" />
                  </div>

                  <h3 className="text-xl font-semibold text-[#0b0b0c]">{section.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-body)]">{section.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#0b0b0c]">
                    Enter Workspace
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
            <p className="text-xs font-mono tracking-wide text-[#0020d7]">
              &gt; LIVE PREVIEW ENABLED: all content edits can be validated in real time.
            </p>
          </div>
        </div>
      </div>

      {showPreview ? (
        <div className="flex min-w-[360px] flex-1 flex-col bg-[#f4f1eb]">
          <div className="flex h-12 items-center justify-between border-b border-[var(--color-border-light)] bg-[#f8f5f2] px-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full border border-red-400/50 bg-red-300/50" />
              <div className="h-3 w-3 rounded-full border border-yellow-400/50 bg-yellow-300/50" />
              <div className="h-3 w-3 rounded-full border border-green-400/50 bg-green-300/50" />
            </div>
            <div className="rounded-md border border-[var(--color-border-light)] bg-white px-4 py-1 text-[10px] font-mono text-[var(--color-text-body)]">
              localhost:3000/
            </div>
            <span className="h-3.5 w-3.5" />
          </div>

          <div className="relative flex-1 bg-white">
            <iframe ref={iframeRef} src="/" className="absolute inset-0 h-full w-full border-none" title="Live Preview" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
