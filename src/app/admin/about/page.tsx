"use client";

import { useEffect, useState } from "react";
import AdminSectionWorkspace from "@/components/admin/AdminSectionWorkspace";
import { aboutContentDefaults, type AboutContent } from "@/lib/about-content-defaults";

export default function AdminAboutPage() {
  const [about, setAbout] = useState<AboutContent>(aboutContentDefaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      try {
        const response = await fetch("/api/admin/site-content", { cache: "no-store" });
        if (!response.ok) {
          setStatus("Failed to load about content.");
          return;
        }

        const data = await response.json();
        setAbout(data.about || aboutContentDefaults);
      } finally {
        setLoading(false);
      }
    }

    queueMicrotask(() => {
      void loadData();
    });
  }, []);

  async function saveAbout() {
    setSaving(true);
    setStatus("Saving about section...");

    try {
      const response = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "about", data: about }),
      });

      if (!response.ok) {
        setStatus("Save failed.");
        return;
      }

      setStatus("About section saved.");
    } catch {
      setStatus("Save failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-sm text-[var(--color-text-body)]">Loading about section...</div>;
  }

  return (
    <AdminSectionWorkspace
      sectionLabel="About Section"
      sectionTitle="About Content Control"
      sectionDescription="Edit the scrapbook hero image and each Instagram card image/link pair."
      previewPath="/about"
    >
      <section className="rounded-2xl border border-[var(--color-border-light)] bg-white/90 p-6">
        <h3 className="text-lg font-medium text-[#0b0b0c]">Main About Image</h3>
        <label className="mt-4 space-y-2 text-sm block">
          <span className="text-[var(--color-text-body)]">Image URL</span>
          <input
            value={about.aboutImage}
            onChange={(event) => setAbout({ ...about, aboutImage: event.target.value })}
            className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
          />
        </label>
      </section>

      <section className="rounded-2xl border border-[var(--color-border-light)] bg-white/90 p-6">
        <h3 className="text-lg font-medium text-[#0b0b0c]">Instagram Cards</h3>
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((idx) => {
            const imageKey = `aboutInstagramImage${idx}` as keyof AboutContent;
            const linkKey = `aboutInstagramLink${idx}` as keyof AboutContent;

            return (
              <div key={idx} className="rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] p-4 space-y-3">
                <p className="text-sm font-medium text-[#0b0b0c]">Card {idx}</p>
                <label className="space-y-2 text-sm block">
                  <span className="text-[var(--color-text-body)]">Image URL</span>
                  <input
                    value={about[imageKey] as string}
                    onChange={(event) =>
                      setAbout({
                        ...about,
                        [imageKey]: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-[var(--color-border-light)] bg-white px-3 py-2 text-sm text-[#0b0b0c]"
                  />
                </label>

                <label className="space-y-2 text-sm block">
                  <span className="text-[var(--color-text-body)]">Link URL</span>
                  <input
                    value={about[linkKey] as string}
                    onChange={(event) =>
                      setAbout({
                        ...about,
                        [linkKey]: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-[var(--color-border-light)] bg-white px-3 py-2 text-sm text-[#0b0b0c]"
                  />
                </label>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={saveAbout}
            disabled={saving}
            className="rounded-full border-[2px] border-[var(--color-border-dark)] bg-[#dbe7ff] px-5 py-2 text-sm font-medium text-[#0020d7] shadow-[0_8px_18px_rgba(0,32,215,0.14)] disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save About Section"}
          </button>
        </div>

        {status ? <p className="mt-3 text-xs text-[var(--color-text-body)]">{status}</p> : null}
      </section>
    </AdminSectionWorkspace>
  );
}
