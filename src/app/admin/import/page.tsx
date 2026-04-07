"use client";

import { useMemo, useState } from "react";
import AdminSectionWorkspace from "@/components/admin/AdminSectionWorkspace";

export default function AdminImportPage() {
  const [rawPayload, setRawPayload] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const parsedPreview = useMemo(() => {
    if (!rawPayload.trim()) {
      return null;
    }

    try {
      return JSON.parse(rawPayload) as Record<string, unknown>;
    } catch {
      return null;
    }
  }, [rawPayload]);

  async function handleExport() {
    setStatus("Preparing export...");

    const response = await fetch("/api/admin/import", { cache: "no-store" });
    if (!response.ok) {
      setStatus("Export failed.");
      return;
    }

    const data = await response.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `admin-export-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setStatus("Export complete.");
  }

  async function handleImport() {
    if (!parsedPreview) {
      setStatus("Invalid JSON payload.");
      return;
    }

    setStatus("Applying import...");

    const response = await fetch("/api/admin/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload: parsedPreview }),
    });

    if (!response.ok) {
      setStatus("Import failed.");
      return;
    }

    setStatus("Import completed successfully.");
  }

  async function onFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const text = await file.text();
    setRawPayload(text);
    setStatus(`Loaded file: ${file.name}`);
  }

  return (
    <AdminSectionWorkspace
      sectionLabel="Import Section"
      sectionTitle="Content Import and Export"
      sectionDescription="Move complete content snapshots in and out of the system as JSON."
      previewPath="/"
    >
      <section className="rounded-2xl border border-[var(--color-border-light)] bg-white/90 p-6">
        <h3 className="text-lg font-medium text-[#0b0b0c]">Export Admin Data</h3>
        <p className="mt-2 text-sm text-[var(--color-text-body)]">
          Export all admin-managed content including hero/home/about, contact, services, and projects.
        </p>
        <button
          type="button"
          onClick={handleExport}
          className="mt-4 rounded-full border-[2px] border-[var(--color-border-dark)] bg-[#dbe7ff] px-5 py-2 text-sm font-medium text-[#0020d7] shadow-[0_8px_18px_rgba(0,32,215,0.14)]"
        >
          Export JSON
        </button>
      </section>

      <section className="rounded-2xl border border-[var(--color-border-light)] bg-white/90 p-6">
        <h3 className="text-lg font-medium text-[#0b0b0c]">Import Payload</h3>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="rounded-full border border-[var(--color-border-light)] bg-[#f8f5f2] px-4 py-2 text-xs text-[var(--color-text-body)]">
            <input type="file" accept="application/json" className="hidden" onChange={onFileUpload} />
            Upload JSON file
          </label>
          <button
            type="button"
            onClick={handleImport}
            className="rounded-full border-[2px] border-[var(--color-border-dark)] bg-[#dbe7ff] px-5 py-2 text-sm font-medium text-[#0020d7] shadow-[0_8px_18px_rgba(0,32,215,0.14)]"
          >
            Import JSON
          </button>
        </div>

        <textarea
          value={rawPayload}
          onChange={(event) => setRawPayload(event.target.value)}
          className="mt-4 h-72 w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] p-3 font-mono text-xs text-[#0b0b0c] outline-none"
          placeholder="Paste exported JSON payload here"
        />

        {parsedPreview ? (
          <div className="mt-4 rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] p-4 text-xs text-[var(--color-text-body)]">
            <p className="font-semibold text-[#0b0b0c]">Detected keys</p>
            <p className="mt-2">{Object.keys(parsedPreview).join(", ") || "No top-level keys"}</p>
          </div>
        ) : rawPayload.trim() ? (
          <p className="mt-3 text-xs text-red-700">JSON is invalid. Fix syntax before importing.</p>
        ) : null}

        {status ? <p className="mt-3 text-xs text-[var(--color-text-body)]">{status}</p> : null}
      </section>
    </AdminSectionWorkspace>
  );
}
