"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Github,
  FileText,
  PenLine,
  RefreshCw,
  Upload,
  CheckCircle2,
  XCircle,
  Loader2,
  Database,
  Zap,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";

interface KnowledgeStats {
  total: number;
  bySource: Record<string, number>;
  lastUpdated: string | null;
}

type OperationStatus = "idle" | "loading" | "success" | "error";

interface OperationState {
  status: OperationStatus;
  message: string;
}

const initialOp: OperationState = { status: "idle", message: "" };

// ── STAT CARD ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: LucideIcon }) {
  return (
    <div className="flex flex-col gap-2 p-5 bg-white/5 border border-white/10 rounded-2xl">
      <div className="flex items-center gap-2 text-white/40">
        <Icon size={14} />
        <span className="text-xs font-mono uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-3xl font-bold text-white">{value}</span>
    </div>
  );
}

// ── STATUS BADGE ─────────────────────────────────────────────────────────────

function StatusBadge({ op }: { op: OperationState }) {
  if (op.status === "idle") return null;

  const config = {
    loading: { icon: Loader2, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20", animate: true },
    success: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20", animate: false },
    error: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10 border-red-400/20", animate: false },
  }[op.status];

  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${config.bg} ${config.color} text-sm`}
    >
      <Icon size={14} className={config.animate ? "animate-spin" : ""} />
      <span className="font-mono">{op.message}</span>
    </motion.div>
  );
}

// ── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function AdminJarvisPage() {
  const [stats, setStats] = useState<KnowledgeStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Operation states for each panel
  const [githubOp, setGithubOp] = useState<OperationState>(initialOp);
  const [manualOp, setManualOp] = useState<OperationState>(initialOp);
  const [pdfOp, setPdfOp] = useState<OperationState>(initialOp);

  // Form states
  const [manualText, setManualText] = useState("");
  const [manualSource, setManualSource] = useState<"manual" | "resume">("manual");
  const [pdfText, setPdfText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch("/api/jarvis/sync?source=stats");
      if (res.ok) {
        const data = await res.json() as KnowledgeStats;
        setStats(data);
      }
    } catch {
      // Stats fetch optional
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  // ── GITHUB SYNC ──────────────────────────────────────────────────────────

  const handleGithubSync = async () => {
    setGithubOp({ status: "loading", message: "Connecting to GitHub API..." });
    try {
      const res = await fetch("/api/jarvis/sync?source=github");
      const data = await res.json() as { message?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "GitHub sync failed");
      setGithubOp({ status: "success", message: data.message ?? "Synced!" });
      void fetchStats();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "GitHub sync failed";
      setGithubOp({ status: "error", message: msg });
    }
  };

  // ── MANUAL TEXT INGEST ───────────────────────────────────────────────────

  const handleManualIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;

    setManualOp({ status: "loading", message: "Embedding and storing chunks..." });
    try {
      const res = await fetch("/api/jarvis/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: manualText, source: manualSource }),
      });
      const data = await res.json() as { message?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Ingest failed");
      setManualOp({ status: "success", message: data.message ?? "Ingested!" });
      setManualText("");
      void fetchStats();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Ingest failed";
      setManualOp({ status: "error", message: msg });
    }
  };

  // ── PDF TEXT INGEST ──────────────────────────────────────────────────────

  const handleFileRead = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPdfOp({ status: "loading", message: "Reading file..." });
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setPdfText(text);
      setPdfOp({ status: "idle", message: "" });
    };
    reader.onerror = () => setPdfOp({ status: "error", message: "Failed to read file" });
    reader.readAsText(file); // Works for .txt exports; PDF needs manual copy-paste
  };

  const handlePdfIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfText.trim()) return;

    setPdfOp({ status: "loading", message: "Embedding LinkedIn data..." });
    try {
      const res = await fetch("/api/jarvis/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: pdfText, source: "linkedin_pdf" }),
      });
      const data = await res.json() as { message?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Ingest failed");
      setPdfOp({ status: "success", message: data.message ?? "LinkedIn data ingested!" });
      setPdfText("");
      void fetchStats();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Ingest failed";
      setPdfOp({ status: "error", message: msg });
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">

        {/* ── HEADER ───────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#0020d7]/20 border border-[#0020d7]/30 flex items-center justify-center">
                <Brain size={20} className="text-[#0020d7]" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Jarvis Knowledge Base</h1>
            </div>
            <p className="text-white/40 text-sm max-w-lg">
              Feed your Digital Clone. Every chunk you add becomes part of Jarvis&apos;s long-term memory,
              retrieved in real-time via RAG when visitors ask questions.
            </p>
          </div>
          <button
            onClick={() => void fetchStats()}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white text-sm"
          >
            <RefreshCw size={14} />
            Refresh Stats
          </button>
        </div>

        {/* ── STATS ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statsLoading ? (
            <div className="col-span-4 flex items-center justify-center h-24 text-white/30">
              <Loader2 size={20} className="animate-spin mr-2" /> Loading stats...
            </div>
          ) : (
            <>
              <StatCard label="Total Chunks" value={stats?.total ?? 0} icon={Database} />
              <StatCard label="GitHub" value={stats?.bySource.github ?? 0} icon={Github} />
              <StatCard label="LinkedIn" value={stats?.bySource.linkedin_pdf ?? 0} icon={FileText} />
              <StatCard label="Manual/Resume" value={(stats?.bySource.manual ?? 0) + (stats?.bySource.resume ?? 0)} icon={PenLine} />
            </>
          )}
        </div>

        {stats?.lastUpdated && (
          <p className="text-white/20 text-xs font-mono -mt-8">
            Last updated: {new Date(stats.lastUpdated).toLocaleString()}
          </p>
        )}

        {/* ── PANEL 1: GITHUB SYNC ─────────────────────────────────────── */}
        <div className="p-8 bg-white/3 border border-white/8 rounded-3xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Github size={20} className="text-white/60" />
              <div>
                <h2 className="font-semibold text-lg">GitHub Sync</h2>
                <p className="text-white/40 text-xs mt-0.5">
                  Auto-pulls repos, READMEs, and profile from AbinVarghexe
                </p>
              </div>
            </div>
            <button
              onClick={() => void handleGithubSync()}
              disabled={githubOp.status === "loading"}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0020d7] hover:bg-[#0020d7]/80 disabled:opacity-50 rounded-xl text-sm font-medium transition-all"
            >
              {githubOp.status === "loading" ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RefreshCw size={14} />
              )}
              Sync Now
            </button>
          </div>
          <AnimatePresence>
            {githubOp.status !== "idle" && <StatusBadge op={githubOp} />}
          </AnimatePresence>
        </div>

        {/* ── PANEL 2: MANUAL / RESUME TEXT ────────────────────────────── */}
        <form onSubmit={(e) => void handleManualIngest(e)} className="p-8 bg-white/3 border border-white/8 rounded-3xl space-y-5">
          <div className="flex items-center gap-3">
            <PenLine size={20} className="text-white/60" />
            <div>
              <h2 className="font-semibold text-lg">Manual Knowledge Entry</h2>
              <p className="text-white/40 text-xs mt-0.5">
                Paste your bio, skills, achievements, or any text about yourself
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {(["manual", "resume"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setManualSource(s)}
                className={`px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                  manualSource === s
                    ? "bg-[#0020d7] text-white"
                    : "bg-white/5 text-white/40 hover:bg-white/10"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <textarea
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder={
              manualSource === "resume"
                ? "Paste your resume text here (copy from PDF)..."
                : "Write or paste any facts about yourself — skills, experience, projects, hobbies, philosophy..."
            }
            rows={8}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#0020d7]/40 transition-colors resize-none font-mono"
          />

          <div className="flex items-center justify-between">
            <span className="text-white/20 text-xs font-mono">{manualText.length} chars</span>
            <button
              type="submit"
              disabled={manualText.trim().length < 10 || manualOp.status === "loading"}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 disabled:opacity-40 rounded-xl text-sm font-medium transition-all"
            >
              {manualOp.status === "loading" ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Zap size={14} />
              )}
              Embed & Store
            </button>
          </div>
          <AnimatePresence>
            {manualOp.status !== "idle" && <StatusBadge op={manualOp} />}
          </AnimatePresence>
        </form>

        {/* ── PANEL 3: LINKEDIN PDF TEXT ───────────────────────────────── */}
        <form onSubmit={(e) => void handlePdfIngest(e)} className="p-8 bg-white/3 border border-white/8 rounded-3xl space-y-5">
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-white/60" />
            <div>
              <h2 className="font-semibold text-lg">LinkedIn Data</h2>
              <p className="text-white/40 text-xs mt-0.5">
                Upload a .txt export or paste copied text from your LinkedIn PDF
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-dashed border-white/20 rounded-xl text-sm text-white/50 hover:text-white hover:border-white/40 transition-all"
            >
              <Upload size={14} />
              Upload .txt file
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt"
              onChange={handleFileRead}
              className="hidden"
            />
            <span className="text-white/20 text-xs">or paste text below</span>
          </div>

          <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-start gap-3">
            <AlertCircle size={14} className="text-amber-400 mt-0.5 shrink-0" />
            <p className="text-amber-400/80 text-xs leading-relaxed">
              LinkedIn PDFs can&apos;t be read directly. To get your data:
              LinkedIn → Settings → Data Privacy → Get a copy → Profile data → Download, then open the CSV/text files.
            </p>
          </div>

          <textarea
            value={pdfText}
            onChange={(e) => setPdfText(e.target.value)}
            placeholder="Paste LinkedIn profile text here..."
            rows={8}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#0020d7]/40 transition-colors resize-none font-mono"
          />

          <div className="flex items-center justify-between">
            <span className="text-white/20 text-xs font-mono">{pdfText.length} chars</span>
            <button
              type="submit"
              disabled={pdfText.trim().length < 10 || pdfOp.status === "loading"}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 disabled:opacity-40 rounded-xl text-sm font-medium transition-all"
            >
              {pdfOp.status === "loading" ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Zap size={14} />
              )}
              Embed LinkedIn Data
            </button>
          </div>
          <AnimatePresence>
            {pdfOp.status !== "idle" && <StatusBadge op={pdfOp} />}
          </AnimatePresence>
        </form>

      </div>
    </div>
  );
}
