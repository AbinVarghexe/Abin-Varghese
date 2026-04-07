"use client";

import { useRef, useState } from "react";
import { Eye, EyeOff, RefreshCw } from "lucide-react";

type AdminSectionWorkspaceProps = {
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  previewPath: string;
  children: React.ReactNode;
};

export default function AdminSectionWorkspace({
  sectionLabel,
  sectionTitle,
  sectionDescription,
  previewPath,
  children,
}: AdminSectionWorkspaceProps) {
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
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#0020d7]">{sectionLabel}</p>
              <h2 className="mt-1 text-2xl font-semibold text-[#0b0b0c]">{sectionTitle}</h2>
              <p className="mt-2 max-w-2xl text-sm text-[var(--color-text-body)]">{sectionDescription}</p>
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

        <div className="space-y-6 p-6 lg:p-8">{children}</div>
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
              localhost:3000{previewPath}
            </div>
            <span className="h-3.5 w-3.5" />
          </div>

          <div className="relative flex-1 bg-white">
            <iframe
              ref={iframeRef}
              src={previewPath}
              className="absolute inset-0 h-full w-full border-none"
              title={`${sectionTitle} Preview`}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
