"use client";

import { useEffect, useState } from "react";
import AdminSectionWorkspace from "@/components/admin/AdminSectionWorkspace";
import { heroContentDefaults, type HeroContent } from "@/lib/hero-content-defaults";
import { homeContentDefaults, type HomeContent } from "@/lib/home-content-defaults";

export default function AdminHomePage() {
  const [hero, setHero] = useState<HeroContent>(heroContentDefaults);
  const [home, setHome] = useState<HomeContent>(homeContentDefaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      try {
        const response = await fetch("/api/admin/site-content", { cache: "no-store" });
        if (!response.ok) {
          setStatus("Failed to load home content.");
          return;
        }

        const data = await response.json();
        setHero(data.hero || heroContentDefaults);
        setHome(data.home || homeContentDefaults);
      } finally {
        setLoading(false);
      }
    }

    queueMicrotask(() => {
      void loadData();
    });
  }, []);

  async function saveAll() {
    setSaving(true);
    setStatus("Saving home section...");

    try {
      const [heroRes, homeRes] = await Promise.all([
        fetch("/api/admin/site-content", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "hero", data: hero }),
        }),
        fetch("/api/admin/site-content", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "home", data: home }),
        }),
      ]);

      if (!heroRes.ok || !homeRes.ok) {
        setStatus("Save failed.");
        return;
      }

      setStatus("Home section saved.");
    } catch {
      setStatus("Save failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-sm text-[var(--color-text-body)]">Loading home section...</div>;
  }

  return (
    <AdminSectionWorkspace
      sectionLabel="Home Section"
      sectionTitle="Home Content Control"
      sectionDescription="Manage hero text, social handles, homepage route links, banner items, and logos separately."
      previewPath="/"
    >
      <section className="rounded-2xl border border-[var(--color-border-light)] bg-white/90 p-6">
        <h3 className="text-lg font-medium text-[#0b0b0c]">Hero Copy</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="text-[var(--color-text-body)]">Greeting</span>
            <input
              value={hero.heroGreeting}
              onChange={(event) => setHero({ ...hero, heroGreeting: event.target.value })}
              className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
            />
          </label>

          <label className="space-y-2 text-sm">
            <span className="text-[var(--color-text-body)]">Name</span>
            <input
              value={hero.heroName}
              onChange={(event) => setHero({ ...hero, heroName: event.target.value })}
              className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
            />
          </label>

          <label className="space-y-2 text-sm md:col-span-2">
            <span className="text-[var(--color-text-body)]">Subcopy</span>
            <textarea
              rows={3}
              value={hero.heroSubcopy}
              onChange={(event) => setHero({ ...hero, heroSubcopy: event.target.value })}
              className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--color-border-light)] bg-white/90 p-6">
        <h3 className="text-lg font-medium text-[#0b0b0c]">Home Links</h3>

        <p className="mt-2 text-xs uppercase tracking-wider text-[var(--color-text-body)]">Social Handles</p>
        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="text-[var(--color-text-body)]">GitHub</span>
            <input
              value={home.socialLinks.github}
              onChange={(event) =>
                setHome({
                  ...home,
                  socialLinks: { ...home.socialLinks, github: event.target.value },
                })
              }
              className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
            />
          </label>

          <label className="space-y-2 text-sm">
            <span className="text-[var(--color-text-body)]">Behance</span>
            <input
              value={home.socialLinks.behance}
              onChange={(event) =>
                setHome({
                  ...home,
                  socialLinks: { ...home.socialLinks, behance: event.target.value },
                })
              }
              className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
            />
          </label>

          <label className="space-y-2 text-sm">
            <span className="text-[var(--color-text-body)]">LinkedIn</span>
            <input
              value={home.socialLinks.linkedin}
              onChange={(event) =>
                setHome({
                  ...home,
                  socialLinks: { ...home.socialLinks, linkedin: event.target.value },
                })
              }
              className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
            />
          </label>

          <label className="space-y-2 text-sm">
            <span className="text-[var(--color-text-body)]">Instagram</span>
            <input
              value={home.socialLinks.instagram}
              onChange={(event) =>
                setHome({
                  ...home,
                  socialLinks: { ...home.socialLinks, instagram: event.target.value },
                })
              }
              className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
            />
          </label>
        </div>

        <p className="mt-6 text-xs uppercase tracking-wider text-[var(--color-text-body)]">Page Links</p>
        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="text-[var(--color-text-body)]">About URL</span>
            <input
              value={home.pageLinks.about}
              onChange={(event) =>
                setHome({
                  ...home,
                  pageLinks: { ...home.pageLinks, about: event.target.value },
                })
              }
              className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
            />
          </label>

          <label className="space-y-2 text-sm">
            <span className="text-[var(--color-text-body)]">Projects URL</span>
            <input
              value={home.pageLinks.projects}
              onChange={(event) =>
                setHome({
                  ...home,
                  pageLinks: { ...home.pageLinks, projects: event.target.value },
                })
              }
              className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
            />
          </label>

          <label className="space-y-2 text-sm">
            <span className="text-[var(--color-text-body)]">Services URL</span>
            <input
              value={home.pageLinks.services}
              onChange={(event) =>
                setHome({
                  ...home,
                  pageLinks: { ...home.pageLinks, services: event.target.value },
                })
              }
              className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
            />
          </label>

          <label className="space-y-2 text-sm">
            <span className="text-[var(--color-text-body)]">Contact URL</span>
            <input
              value={home.pageLinks.contact}
              onChange={(event) =>
                setHome({
                  ...home,
                  pageLinks: { ...home.pageLinks, contact: event.target.value },
                })
              }
              className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--color-border-light)] bg-white/90 p-6">
        <h3 className="text-lg font-medium text-[#0b0b0c]">Banner and Logos</h3>
        <div className="mt-4 grid grid-cols-1 gap-4">
          <label className="space-y-2 text-sm">
            <span className="text-[var(--color-text-body)]">Scrolling Banner Items (comma separated)</span>
            <textarea
              rows={3}
              value={home.scrollingBannerItems}
              onChange={(event) => setHome({ ...home, scrollingBannerItems: event.target.value })}
              className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
            />
          </label>

          <label className="space-y-2 text-sm">
            <span className="text-[var(--color-text-body)]">Logo URLs (one per line)</span>
            <textarea
              rows={5}
              value={home.scrollingLogos.join("\n")}
              onChange={(event) =>
                setHome({
                  ...home,
                  scrollingLogos: event.target.value
                    .split("\n")
                    .map((item) => item.trim())
                    .filter(Boolean),
                })
              }
              className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
            />
          </label>
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={saveAll}
            disabled={saving}
            className="rounded-full border-[2px] border-[var(--color-border-dark)] bg-[#dbe7ff] px-5 py-2 text-sm font-medium text-[#0020d7] shadow-[0_8px_18px_rgba(0,32,215,0.14)] disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Home Section"}
          </button>
        </div>

        {status ? <p className="mt-3 text-xs text-[var(--color-text-body)]">{status}</p> : null}
      </section>
    </AdminSectionWorkspace>
  );
}
