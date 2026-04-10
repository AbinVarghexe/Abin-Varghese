"use client";

import { useEffect, useMemo, useState } from "react";
import AdminSectionWorkspace from "@/components/admin/AdminSectionWorkspace";

type ContactSettings = {
  introText: string;
  instagramUrl: string;
  linkedinUrl: string;
  contactEmail: string;
  formEnabled: boolean;
};

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: string;
};

const defaultSettings: ContactSettings = {
  introText: "We promise to reply within 24 hours, every time.",
  instagramUrl: "https://instagram.com",
  linkedinUrl: "https://linkedin.com",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "toabinvarghese@gmail.com",
  formEnabled: true,
};

export default function AdminContactPage() {
  const [settings, setSettings] = useState<ContactSettings>(defaultSettings);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "read" | "replied">("all");
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  const filteredSubmissions = useMemo(() => {
    if (activeFilter === "all") {
      return submissions;
    }

    return submissions.filter((submission) => submission.status === activeFilter);
  }, [activeFilter, submissions]);

  async function loadData() {
    setLoading(true);
    try {
      const [settingsRes, submissionsRes] = await Promise.all([
        fetch("/api/admin/forms/settings", { cache: "no-store" }),
        fetch("/api/admin/forms/submissions", { cache: "no-store" }),
      ]);

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings(settingsData.settings);
      }

      if (submissionsRes.ok) {
        const submissionsData = await submissionsRes.json();
        setSubmissions(submissionsData.submissions || []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      void loadData();
    });
  }, []);

  async function saveSettings() {
    setSavingSettings(true);

    try {
      await fetch("/api/admin/forms/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
    } finally {
      setSavingSettings(false);
    }
  }

  async function updateStatus(id: string, status: ContactSubmission["status"]) {
    await fetch(`/api/admin/forms/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    setSubmissions((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item))
    );
  }

  async function deleteSubmission(id: string) {
    await fetch(`/api/admin/forms/submissions/${id}`, { method: "DELETE" });
    setSubmissions((current) => current.filter((item) => item.id !== id));
  }

  if (loading) {
    return <div className="text-sm text-[var(--color-text-body)]">Loading contact section...</div>;
  }

  return (
    <AdminSectionWorkspace
      sectionLabel="Contact Section"
      sectionTitle="Contact Content and Inbox"
      sectionDescription="Update contact handles and monitor incoming form submissions with status management."
      previewPath="/contact"
    >
      <section className="rounded-2xl border border-[var(--color-border-light)] bg-white/90 p-6">
        <h3 className="text-lg font-medium text-[#0b0b0c]">Contact Settings</h3>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="text-[var(--color-text-body)]">Intro Text</span>
            <textarea
              value={settings.introText}
              onChange={(event) => setSettings({ ...settings, introText: event.target.value })}
              rows={3}
              className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c] outline-none"
            />
          </label>

          <label className="space-y-2 text-sm">
            <span className="text-[var(--color-text-body)]">Contact Email</span>
            <input
              value={settings.contactEmail}
              onChange={(event) => setSettings({ ...settings, contactEmail: event.target.value })}
              className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c] outline-none"
            />
          </label>

          <label className="space-y-2 text-sm">
            <span className="text-[var(--color-text-body)]">Instagram URL</span>
            <input
              value={settings.instagramUrl}
              onChange={(event) => setSettings({ ...settings, instagramUrl: event.target.value })}
              className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c] outline-none"
            />
          </label>

          <label className="space-y-2 text-sm">
            <span className="text-[var(--color-text-body)]">LinkedIn URL</span>
            <input
              value={settings.linkedinUrl}
              onChange={(event) => setSettings({ ...settings, linkedinUrl: event.target.value })}
              className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c] outline-none"
            />
          </label>
        </div>

        <label className="mt-4 inline-flex items-center gap-2 text-sm text-[#0b0b0c]">
          <input
            type="checkbox"
            checked={settings.formEnabled}
            onChange={(event) => setSettings({ ...settings, formEnabled: event.target.checked })}
          />
          Contact form enabled
        </label>

        <div className="mt-5">
          <button
            type="button"
            onClick={saveSettings}
            disabled={savingSettings}
            className="rounded-full border-[2px] border-[var(--color-border-dark)] bg-[#dbe7ff] px-5 py-2 text-sm font-medium text-[#0020d7] shadow-[0_8px_18px_rgba(0,32,215,0.14)] disabled:opacity-60"
          >
            {savingSettings ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--color-border-light)] bg-white/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-medium text-[#0b0b0c]">Contact Form Submissions</h3>
          <div className="flex flex-wrap gap-2">
            {(["all", "unread", "read", "replied"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setActiveFilter(status)}
                className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-wider ${
                  activeFilter === status
                    ? "border-[var(--color-border-dark)] bg-[#dbe7ff] text-[#0020d7]"
                    : "border-[var(--color-border-light)] bg-white text-[var(--color-text-body)]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {filteredSubmissions.length === 0 ? (
            <p className="text-sm text-[var(--color-text-body)]">No submissions for this filter.</p>
          ) : null}

          {filteredSubmissions.map((submission) => (
            <article key={submission.id} className="rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#0b0b0c]">{submission.name}</p>
                  <p className="text-xs text-[var(--color-text-body)]">{submission.email}</p>
                  <p className="mt-1 text-xs text-[var(--color-text-body)]">
                    {new Date(submission.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <select
                    value={submission.status}
                    onChange={(event) =>
                      updateStatus(submission.id, event.target.value as ContactSubmission["status"])
                    }
                    className="rounded-lg border border-[var(--color-border-light)] bg-white px-2 py-1 text-xs text-[#0b0b0c]"
                  >
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => deleteSubmission(submission.id)}
                    className="rounded-lg border border-red-300 bg-red-50 px-3 py-1 text-xs text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {submission.subject ? (
                <p className="mt-3 text-sm text-[#0b0b0c]">
                  <span className="text-[var(--color-text-body)]">Subject:</span> {submission.subject}
                </p>
              ) : null}

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#1f2937]">{submission.message}</p>
            </article>
          ))}
        </div>
      </section>
    </AdminSectionWorkspace>
  );
}
