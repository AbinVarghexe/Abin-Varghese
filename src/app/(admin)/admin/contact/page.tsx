"use client";

import { useEffect, useMemo, useState } from "react";
import AdminSectionWorkspace, { 
  SectionTitle, 
  Field, 
  TextareaField, 
  SectionPanel, 
  TinyButton, 
  ActionButton 
} from "@/components/admin/AdminSectionWorkspace";
import { 
  Mail, 
  Settings, 
  MessageSquare, 
  Trash2, 
  CheckCircle2, 
  Inbox, 
  Instagram, 
  Linkedin, 
  AlignLeft, 
  Info,
  Clock,
  User,
  Hash,
  ShieldCheck,
  ChevronRight,
  Filter,
  Search,
  Bell
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

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
  introText: "I promise to reply within 24 hours, every time.",
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
    if (activeFilter === "all") return submissions;
    return submissions.filter((s) => s.status === activeFilter);
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
    void loadData();
  }, []);

  async function saveSettings() {
    setSavingSettings(true);
    const toastId = toast.loading("Updating communication protocols...");
    try {
      await fetch("/api/admin/forms/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      toast.success("Settings synchronized.", { id: toastId });
    } catch {
      toast.error("Synchronization failed.", { id: toastId });
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
    toast.success(`Submission marked as ${status}.`);
  }

  async function deleteSubmission(id: string) {
    if (!confirm("Permanently purge this transmission record?")) return;
    const toastId = toast.loading("Purging record...");
    await fetch(`/api/admin/forms/submissions/${id}`, { method: "DELETE" });
    setSubmissions((current) => current.filter((item) => item.id !== id));
    toast.success("Record purged.", { id: toastId });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-4 border-[#007aff] border-t-transparent rounded-full animate-spin" />
          <p className="text-[11px] font-bold text-[#86868b] uppercase tracking-widest">Opening Secure Inbox...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminSectionWorkspace
      sectionLabel="Transmission Control"
      sectionTitle="Communication Dashboard"
      sectionDescription="Orchestrate your incoming inquiries and manage public contact endpoints with high-fidelity status tracking."
      icon={Inbox}
      iconColor="#0020d7"
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
        
        {/* Settings Sidebar */}
        <aside className="xl:col-span-4 space-y-10">
          <SectionPanel className="flex flex-col gap-10 bg-white/50 backdrop-blur-sm">
            <SectionTitle title="Protocol Configuration" copy="Global contact endpoint settings." icon={Settings} />
            
            <div className="space-y-8">
              <TextareaField
                label="Introductory Narrative"
                value={settings.introText}
                onChange={(v) => setSettings({ ...settings, introText: v })}
                rows={4}
                icon={AlignLeft}
              />

              <Field
                label="Primary Contact Point"
                value={settings.contactEmail}
                onChange={(v) => setSettings({ ...settings, contactEmail: v })}
                icon={Mail}
              />

              <div className="grid grid-cols-1 gap-6">
                <Field
                  label="Instagram Index"
                  value={settings.instagramUrl}
                  onChange={(v) => setSettings({ ...settings, instagramUrl: v })}
                  icon={Instagram}
                />
                <Field
                  label="LinkedIn Node"
                  value={settings.linkedinUrl}
                  onChange={(v) => setSettings({ ...settings, linkedinUrl: v })}
                  icon={Linkedin}
                />
              </div>

              <div className="p-6 rounded-[28px] bg-[#f7f4ef]/50 border-2 border-[#e4e4e7] flex items-center justify-between group hover:border-[#0020d7]/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-[18px] flex items-center justify-center transition-all ${settings.formEnabled ? "bg-[#0020d7] text-white shadow-xl shadow-[#0020d7]/20" : "bg-[#4a4a68]/10 text-[#4a4a68]"}`}>
                    <ShieldCheck size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[14px] font-extrabold text-[#0b0b0c] tracking-tight">Public Form Status</p>
                    <p className="text-[11px] text-[#4a4a68] font-extrabold uppercase tracking-widest opacity-60">{settings.formEnabled ? "Operational" : "Disabled"}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, formEnabled: !settings.formEnabled })}
                  className={`h-7 w-12 rounded-full transition-all relative ring-4 ring-transparent active:scale-95 ${settings.formEnabled ? "bg-[#0020d7]" : "bg-[#e4e4e7]"}`}
                >
                  <div className={`absolute top-1 left-1 h-5 w-5 bg-white rounded-full shadow-lg transition-transform ${settings.formEnabled ? "translate-x-5" : ""}`} />
                </button>
              </div>
            </div>

            <div className="pt-6 border-t-2 border-[#f7f4ef]">
              <ActionButton onClick={saveSettings} disabled={savingSettings} className="w-full">
                {savingSettings ? "Synchronizing..." : "Sync Protocols"}
              </ActionButton>
            </div>
          </SectionPanel>

          <SectionPanel className="p-8 bg-[#0020d7]/[0.02] border-2 border-dashed border-[#0020d7]/20 rounded-[33px]">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-[22px] bg-[#0020d7] text-white flex items-center justify-center shadow-2xl shadow-[#0020d7]/30">
                <Bell size={28} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[16px] font-extrabold text-[#0b0b0c] tracking-tight">Inbox Statistics</p>
                <p className="text-[12px] text-[#4a4a68] font-extrabold uppercase tracking-widest opacity-60 mt-1">{submissions.filter(s => s.status === "unread").length} Unprocessed transmissions</p>
              </div>
            </div>
          </SectionPanel>
        </aside>

        {/* Inbox Submissions */}
        <main className="xl:col-span-8 space-y-8">
          <SectionPanel className="flex flex-col gap-8 bg-white/50 backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-between gap-6 pb-2 border-b-2 border-[#f7f4ef]">
              <SectionTitle title="Transmission Feed" copy="Monitor and audit incoming signals." icon={Inbox} />
              <div className="flex p-1.5 rounded-full bg-[#f7f4ef] border-2 border-[#e4e4e7] shadow-inner">
                {(["all", "unread", "read", "replied"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-6 py-2 rounded-full text-[10px] font-extrabold uppercase tracking-widest transition-all ${
                      activeFilter === filter 
                        ? "bg-[#0b0b0c] text-white shadow-xl shadow-black/20" 
                        : "text-[#4a4a68] hover:bg-white hover:text-[#0b0b0c]"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {filteredSubmissions.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="p-20 rounded-[40px] border-4 border-dashed border-[#e4e4e7] text-center bg-[#f7f4ef]/20"
                  >
                    <div className="h-24 w-24 rounded-[33px] bg-white border-2 border-[#e4e4e7] flex items-center justify-center mx-auto mb-8 shadow-sm">
                      <MessageSquare className="text-[#4a4a68] opacity-20" size={48} strokeWidth={1.5} />
                    </div>
                    <p className="text-[18px] font-extrabold text-[#0b0b0c] tracking-tight">Zero Transmissions Detected</p>
                    <p className="text-[14px] text-[#4a4a68] font-medium mt-2">All communication channels are clear.</p>
                  </motion.div>
                ) : (
                  filteredSubmissions.map((submission) => (
                    <motion.article 
                      key={submission.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`group p-8 rounded-[40px] border-2 transition-all relative overflow-hidden ${
                        submission.status === "unread" 
                          ? "bg-white border-[#0020d7]/20 shadow-2xl shadow-[#0020d7]/5" 
                          : "bg-[#f7f4ef]/30 border-[#e4e4e7] opacity-80"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-6 mb-8 relative z-10">
                        <div className="flex items-center gap-5">
                          <div className={`h-16 w-16 rounded-[24px] flex items-center justify-center transition-all ${submission.status === "unread" ? "bg-[#0020d7] text-white shadow-2xl shadow-[#0020d7]/20" : "bg-white border-2 border-[#e4e4e7] text-[#4a4a68]"}`}>
                            <User size={28} strokeWidth={2.5} />
                          </div>
                          <div>
                            <h4 className="text-[20px] font-extrabold text-[#0b0b0c] tracking-tight">{submission.name}</h4>
                            <div className="flex items-center gap-3 mt-1">
                               <p className="text-[12px] font-extrabold text-[#0020d7] tracking-widest uppercase opacity-60">{submission.email}</p>
                               <div className="h-1 w-1 rounded-full bg-[#e4e4e7]" />
                               <p className="text-[12px] font-extrabold text-[#4a4a68] tracking-widest uppercase opacity-40">{new Date(submission.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 relative z-10">
                          <div className="relative">
                            <select
                              value={submission.status}
                              onChange={(e) => updateStatus(submission.id, e.target.value as any)}
                              className="h-10 rounded-full bg-white border-2 border-[#e4e4e7] px-6 pr-10 text-[10px] font-extrabold uppercase tracking-widest outline-none focus:border-[#0020d7] transition-all appearance-none cursor-pointer text-[#0b0b0c] shadow-sm"
                            >
                              <option value="unread">Unread</option>
                              <option value="read">Processed</option>
                              <option value="replied">Synchronized</option>
                            </select>
                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-[#4a4a68] pointer-events-none" size={14} />
                          </div>
                          <button
                            onClick={() => deleteSubmission(submission.id)}
                            className="h-10 w-10 flex items-center justify-center rounded-full bg-white border-2 border-[#e4e4e7] text-[#ff3b30] hover:bg-[#ff3b30] hover:text-white hover:border-[#ff3b30] transition-all active:scale-90 shadow-sm"
                          >
                            <Trash2 size={16} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>

                      <div className="pl-20 space-y-6 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-6 rounded-lg bg-[#f7f4ef] flex items-center justify-center text-[#4a4a68] shadow-inner">
                            <Hash size={12} strokeWidth={3} />
                          </div>
                          <p className="text-[15px] font-extrabold text-[#0b0b0c] tracking-tight">{submission.subject || "No Designation"}</p>
                        </div>
                        <div className="p-8 rounded-[33px] bg-white border-2 border-[#f7f4ef] shadow-inner relative group-hover:border-[#0020d7]/5 transition-all">
                          <p className="text-[16px] leading-relaxed text-[#0b0b0c] whitespace-pre-wrap font-medium opacity-90">{submission.message}</p>
                        </div>
                        <div className="flex items-center gap-6 text-[10px] font-extrabold text-[#4a4a68] uppercase tracking-widest pt-4 opacity-40">
                          <span className="flex items-center gap-2"><Clock size={14} strokeWidth={2.5} /> {new Date(submission.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <span className="flex items-center gap-2"><ShieldCheck size={14} strokeWidth={2.5} /> Secure Channel Verified</span>
                        </div>
                      </div>

                      {/* Accent decoration */}
                      {submission.status === "unread" && (
                        <div className="absolute top-0 right-0 h-40 w-40 bg-[#0020d7] rounded-full blur-[100px] opacity-[0.03] -mr-20 -mt-20" />
                      )}
                    </motion.article>
                  ))
                )}
              </AnimatePresence>
            </div>
          </SectionPanel>
        </main>
      </div>
    </AdminSectionWorkspace>
  );
}


