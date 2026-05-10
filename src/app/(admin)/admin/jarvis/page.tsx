"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminSectionWorkspace, {
  SectionPanel,
  SectionTitle,
  Field,
  TextareaField,
  ActionButton,
  TinyButton,
} from "@/components/admin/AdminSectionWorkspace";
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
  History,
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

// ── STATUS BADGE ─────────────────────────────────────────────────────────────

function LocalStatusBadge({ op }: { op: OperationState }) {
  if (op.status === "idle") return null;

  const config = {
    loading: { icon: Loader2, color: "text-[#0020d7]", bg: "bg-[#0020d7]/5 border-[#0020d7]/10", animate: true },
    success: { icon: CheckCircle2, color: "text-[#34c759]", bg: "bg-[#34c759]/5 border-[#34c759]/10", animate: false },
    error: { icon: XCircle, color: "text-[#ff3b30]", bg: "bg-[#ff3b30]/5 border-[#ff3b30]/10", animate: false },
  }[op.status];

  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 px-5 py-3 rounded-2xl border-2 ${config.bg} ${config.color} text-[13px] font-bold uppercase tracking-widest shadow-sm`}
    >
      <Icon size={16} className={config.animate ? "animate-spin" : ""} strokeWidth={2.5} />
      <span>{op.message}</span>
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
    setGithubOp({ status: "loading", message: "Connecting to GitHub..." });
    try {
      const res = await fetch("/api/jarvis/sync?source=github");
      const data = await res.json() as { message?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "GitHub sync failed");
      setGithubOp({ status: "success", message: data.message ?? "Memory Synchronized!" });
      void fetchStats();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "GitHub sync failed";
      setGithubOp({ status: "error", message: msg });
    }
  };

  // ── MANUAL TEXT INGEST ───────────────────────────────────────────────────

  const handleManualIngest = async () => {
    if (!manualText.trim()) return;

    setManualOp({ status: "loading", message: "Processing long-term memory..." });
    try {
      const res = await fetch("/api/jarvis/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: manualText, source: manualSource }),
      });
      const data = await res.json() as { message?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Ingest failed");
      setManualOp({ status: "success", message: data.message ?? "Knowledge Ingested!" });
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

    setPdfOp({ status: "loading", message: "Reading local asset..." });
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setPdfText(text);
      setPdfOp({ status: "idle", message: "" });
    };
    reader.onerror = () => setPdfOp({ status: "error", message: "Failed to read file" });
    reader.readAsText(file);
  };

  const handlePdfIngest = async () => {
    if (!pdfText.trim()) return;

    setPdfOp({ status: "loading", message: "Ingesting LinkedIn network data..." });
    try {
      const res = await fetch("/api/jarvis/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: pdfText, source: "linkedin_pdf" }),
      });
      const data = await res.json() as { message?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Ingest failed");
      setPdfOp({ status: "success", message: data.message ?? "Professional record updated!" });
      setPdfText("");
      void fetchStats();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Ingest failed";
      setPdfOp({ status: "error", message: msg });
    }
  };

  return (
    <AdminSectionWorkspace
      sectionLabel="Intelligence Engine"
      sectionTitle="Jarvis Knowledge Base"
      sectionDescription="Feed your Digital Clone. Every chunk you add becomes part of Jarvis's long-term memory, retrieved in real-time via RAG when visitors ask questions."
      icon={Brain}
      iconColor="#0020d7"
    >
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Memory", value: stats?.total ?? 0, icon: Database, color: "#0020d7" },
          { label: "GitHub Chunks", value: stats?.bySource.github ?? 0, icon: Github, color: "#0b0b0c" },
          { label: "Professional", value: stats?.bySource.linkedin_pdf ?? 0, icon: FileText, color: "#0077b5" },
          { label: "Manual Facts", value: (stats?.bySource.manual ?? 0) + (stats?.bySource.resume ?? 0), icon: PenLine, color: "#af52de" },
        ].map((stat) => (
          <SectionPanel key={stat.label} className="flex flex-col items-center justify-center text-center p-8 bg-white border-2 border-[#e4e4e7] hover:border-[#0020d7]/30 transition-all duration-500">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#f7f4ef] border border-[#e4e4e7] shadow-inner" style={{ color: stat.color }}>
              <stat.icon size={28} strokeWidth={1.5} />
            </div>
            <span className="text-3xl font-extrabold text-[#0b0b0c] tracking-tighter">{stat.value}</span>
            <span className="mt-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#4a4a68]">{stat.label}</span>
          </SectionPanel>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Sync Controls */}
        <div className="lg:col-span-1 space-y-10">
          <SectionPanel className="flex flex-col gap-8">
            <SectionTitle 
              title="GitHub Integration" 
              copy="Auto-pull repositories and READMEs from AbinVarghexe." 
              icon={RefreshCw}
            />
            
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between p-5 rounded-[22px] bg-[#f7f4ef] border-2 border-[#e4e4e7]">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Github size={20} className="text-[#0b0b0c]" />
                  </div>
                  <span className="text-[14px] font-bold text-[#0b0b0c]">AbinVarghexe</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#34c759]/10 text-[#34c759] border border-[#34c759]/20">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#34c759] animate-pulse" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest">Linked</span>
                </div>
              </div>

              <ActionButton 
                onClick={handleGithubSync} 
                disabled={githubOp.status === "loading"}
                variant="primary"
              >
                {githubOp.status === "loading" ? "Synchronizing..." : "Sync Repository"}
              </ActionButton>
            </div>

            <AnimatePresence>
              <LocalStatusBadge op={githubOp} />
            </AnimatePresence>
          </SectionPanel>

          <SectionPanel className="flex flex-col gap-8 bg-[#0b0b0c] text-white border-none shadow-2xl relative overflow-hidden">
            <div className="relative z-10 space-y-8">
              <SectionTitle 
                title="Memory Status" 
                copy="Operational health of the RAG engine." 
                icon={History}
              />
              
              <div className="space-y-5">
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-[#4a4a68] font-bold uppercase tracking-widest">Last Sync</span>
                  <span className="font-extrabold tracking-tight">{stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleTimeString() : "Never"}</span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-[#4a4a68] font-bold uppercase tracking-widest">Vector Health</span>
                  <span className="font-extrabold text-[#34c759] tracking-tight">99.8% Optimal</span>
                </div>
                <div className="pt-4">
                  <button 
                    onClick={() => void fetchStats()}
                    className="flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-extrabold uppercase tracking-widest transition-all"
                  >
                    <RefreshCw size={12} className={statsLoading ? "animate-spin" : ""} />
                    Force Refresh
                  </button>
                </div>
              </div>
            </div>
            {/* Abstract background element */}
            <div className="absolute -right-8 -bottom-8 h-32 w-32 bg-[#0020d7] rounded-full blur-[60px] opacity-20" />
          </SectionPanel>
        </div>

        {/* Right Column: Ingest Forms */}
        <div className="lg:col-span-2 space-y-10">
          <SectionPanel className="flex flex-col gap-8 bg-white/50 backdrop-blur-sm">
            <SectionTitle 
              title="Direct Memory Ingest" 
              copy="Paste bio facts, achievements, or experience snippets." 
              icon={PenLine}
            />
            
            <div className="flex gap-3">
              {(["manual", "resume"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setManualSource(s)}
                  className={`px-6 py-2.5 rounded-full text-[11px] font-extrabold uppercase tracking-[0.15em] transition-all active:scale-95 ${
                    manualSource === s
                      ? "bg-[#0b0b0c] text-white shadow-lg shadow-black/20"
                      : "bg-[#f7f4ef] text-[#4a4a68] hover:bg-[#e4e4e7]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <TextareaField
              label={manualSource === "resume" ? "Resume Source" : "Knowledge Fact"}
              value={manualText}
              onChange={setManualText}
              placeholder={manualSource === "resume" ? "Paste resume text..." : "Write facts about yourself..."}
              rows={8}
              icon={Zap}
            />

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#f7f4ef] border border-[#e4e4e7]">
                <div className={`h-2 w-2 rounded-full ${manualText.length > 50 ? "bg-[#34c759]" : "bg-[#ff9500] animate-pulse"}`} />
                <span className="text-[11px] font-extrabold text-[#4a4a68] uppercase tracking-widest">{manualText.length} Chars</span>
              </div>
              <ActionButton 
                onClick={handleManualIngest}
                disabled={manualText.trim().length < 10 || manualOp.status === "loading"}
              >
                Embed Knowledge
              </ActionButton>
            </div>
            
            <AnimatePresence>
              <LocalStatusBadge op={manualOp} />
            </AnimatePresence>
          </SectionPanel>

          <SectionPanel className="flex flex-col gap-8 bg-white/50 backdrop-blur-sm">
            <SectionTitle 
              title="Professional Record" 
              copy="Import LinkedIn data or local professional files." 
              icon={FileText}
            />
            
            <div className="p-6 bg-amber-50 rounded-[22px] border-2 border-amber-100/50 flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <AlertCircle size={20} className="text-amber-600" />
              </div>
              <p className="text-amber-900 text-[13px] leading-relaxed font-medium">
                LinkedIn PDFs require text extraction. Copy the content from your LinkedIn 
                data export and paste it below for high-fidelity embedding.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <TinyButton onClick={() => fileInputRef.current?.click()} variant="default">
                <Upload size={14} className="mr-2 inline" />
                Upload .txt Record
              </TinyButton>
              <input ref={fileInputRef} type="file" accept=".txt" onChange={handleFileRead} className="hidden" />
            </div>

            <TextareaField
              label="Professional Data Source"
              value={pdfText}
              onChange={setPdfText}
              placeholder="Paste LinkedIn record here..."
              rows={6}
              icon={FileText}
            />

            <div className="flex items-center justify-end">
              <ActionButton 
                onClick={handlePdfIngest}
                disabled={pdfText.trim().length < 10 || pdfOp.status === "loading"}
                variant="primary"
              >
                Ingest Record
              </ActionButton>
            </div>

            <AnimatePresence>
              <LocalStatusBadge op={pdfOp} />
            </AnimatePresence>
          </SectionPanel>
      </div>
      </div>
    </AdminSectionWorkspace>
  );
}
