"use client";

import { useEffect, useState } from "react";
import type React from "react";
import {
  Instagram,
  Image as ImageIcon,
  Link2,
  Sparkles,
  AlertCircle,
  Save,
  BookOpen,
  FileText,
  User,
  History,
  Trophy,
  Upload,
  ExternalLink,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Loader2,
  FileDown
} from "lucide-react";
import AdminSectionWorkspace, {
  SectionTitle,
  Field,
  TextareaField,
  SectionPanel,
  TinyButton,
  ListEditor,
  ActionButton,
} from "@/components/admin/AdminSectionWorkspace";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin } from "@/components/admin/AdminContext";
import { aboutContentDefaults, type AboutContent } from "@/lib/about-content-defaults";
import { type SiteCopyContent, siteCopyDefaults, type SiteCopyTimelineEntry, type SiteCopyReviewItem } from "@/types/site-copy";

type AboutAdminTab = "identity" | "chronicles" | "archives";

const aboutAdminTabs: Array<{
  id: AboutAdminTab;
  label: string;
  description: string;
  icon: React.ElementType;
}> = [
  { id: "identity", label: "Identity & Social", description: "Hero image & Instagram highlights", icon: User },
  { id: "chronicles", label: "Chronicles", description: "Intro, Timeline & Certifications", icon: BookOpen },
  { id: "archives", label: "Archives", description: "Resume & Document management", icon: FileText },
];

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function AdminAboutPage() {
  const [about, setAbout] = useState<AboutContent>(aboutContentDefaults);
  const [siteCopy, setSiteCopy] = useState<SiteCopyContent>(siteCopyDefaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<AboutAdminTab>("identity");

  const { setSaveAction, setIsSaving, setStatusText } = useAdmin();

  useEffect(() => {
    setSaveAction(() => saveAbout);
    setStatusText(saving ? "Deploying..." : "System Standby");
    setIsSaving(saving);
    
    return () => {
      setSaveAction(null);
    };
  }, [saveAbout, saving, setSaveAction, setIsSaving, setStatusText]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [contentRes, copyRes] = await Promise.all([
          fetch("/api/admin/site-content", { cache: "no-store" }),
          fetch("/api/admin/site-copy", { cache: "no-store" }),
        ]);

        if (contentRes.ok) {
          const data = await contentRes.json();
          setAbout({ ...aboutContentDefaults, ...(data.about || {}) });
        }
        if (copyRes.ok) {
          const data = await copyRes.json();
          setSiteCopy({ ...siteCopyDefaults, ...(data.siteCopy || {}) });
        }
      } catch (error) {
        toast.error("Critical failure during workspace initialization.");
      } finally {
        setLoading(false);
      }
    }
    void loadData();
  }, []);

  function updateSiteCopy<K extends keyof SiteCopyContent>(field: K, value: SiteCopyContent[K]) {
    setSiteCopy((current) => ({ ...current, [field]: value }));
  }

  async function uploadAsset(file: File, type: "about" | "resume", onUrl: (url: string) => void) {
    const formData = new FormData();
    formData.append("file", file);
    const toastId = toast.loading(`Uploading ${type === "resume" ? "document" : "asset"}...`);
    
    const endpoint = type === "resume" ? "/api/admin/upload/resume" : "/api/admin/upload/about-image";
    
    try {
      const response = await fetch(endpoint, { method: "POST", body: formData });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Upload failed");
      }
      const data = await response.json();
      onUrl(data.url);
      toast.success(`${type === "resume" ? "Document" : "Asset"} synchronized.`, { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Upload failed.", { id: toastId });
    }
  }

  async function saveAbout() {
    setSaving(true);
    const toastId = toast.loading("Deploying About section updates...");
    try {
      const requests = [
        fetch("/api/admin/site-content", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "about", data: about }),
        }),
        fetch("/api/admin/site-copy", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ siteCopy }),
        }),
      ];

      const responses = await Promise.all(requests);
      const allOk = responses.every(r => r.ok);

      if (!allOk) {
        throw new Error("One or more requests failed.");
      }

      toast.success("About workspace successfully synchronized.", { id: toastId });
    } catch (error) {
      toast.error("Deployment failed. Check integrity logs.", { id: toastId });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-8 bg-[#f7f4ef]/50 rounded-[33px] border-[5px] border-[#e4e4e7]">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-[#0020d7]/10 border-t-[#0020d7] rounded-full animate-spin" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#0020d7]" size={24} />
        </div>
        <p className="text-[14px] font-extrabold text-[#0b0b0c] uppercase tracking-[0.25em]">Initialising About Workspace</p>
      </div>
    );
  }

  return (
    <AdminSectionWorkspace
      sectionLabel="Visual Narrative"
      sectionTitle="About Management Workspace"
      sectionDescription="Curate your personal story, professional timeline, and identity assets."
      icon={BookOpen}
      iconColor="#0020d7"
    >
      <AboutAdminTabs activeTab={activeTab} onChange={setActiveTab} />

      <main className="max-w-[1400px] mx-auto space-y-10 pb-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeTab === "identity" && (
              <div className="space-y-10">
                <SectionPanel className="p-10 bg-white/50 backdrop-blur-sm">
                  <SectionTitle 
                    title="Main Hero Scrapbook" 
                    copy="The primary large visual asset and meta descriptions for the About section." 
                    icon={ImageIcon} 
                  />
                  <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <Field
                          label="Primary Hero Image URL"
                          value={about.aboutImage}
                          onChange={(value) => setAbout({ ...about, aboutImage: value })}
                          icon={ImageIcon}
                        />
                        <div className="flex items-center gap-3">
                          <input 
                            type="file" 
                            className="hidden" 
                            id="hero-upload" 
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) uploadAsset(f, "about", (url) => setAbout({ ...about, aboutImage: url }));
                            }} 
                          />
                          <button 
                            onClick={() => document.getElementById("hero-upload")?.click()}
                            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#e4e4e7] text-[10px] font-extrabold uppercase tracking-widest hover:bg-[#0b0b0c] hover:text-white transition-all active:scale-95 shadow-sm"
                          >
                            <Upload size={12} strokeWidth={2.5} />
                            Upload Hero Asset
                          </button>
                        </div>
                      </div>

                      <Field
                        label="Scrapbook Sticky Note"
                        value={siteCopy.aboutStickyNote}
                        onChange={(v) => updateSiteCopy("aboutStickyNote", v)}
                        icon={Sparkles}
                      />
                      
                      <TextareaField
                        label="Hero Narrative (Lower Right Note)"
                        value={siteCopy.aboutLowerRightNote}
                        onChange={(v) => updateSiteCopy("aboutLowerRightNote", v)}
                        rows={3}
                        icon={BookOpen}
                      />

                      <Field
                        label="Archive Footer Tag"
                        value={siteCopy.aboutFooterTag}
                        onChange={(v) => updateSiteCopy("aboutFooterTag", v)}
                        icon={History}
                      />
                    </div>
                    
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[33px] border-4 border-[#e4e4e7] shadow-2xl group bg-[#f7f4ef]">
                      {about.aboutImage ? (
                        <img 
                          src={about.aboutImage} 
                          alt="About Hero" 
                          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/800x600?text=Hero+Image+Preview"; }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                           <ImageIcon size={64} className="text-[#4a4a68] opacity-20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <Sparkles className="text-white animate-pulse" size={40} />
                      </div>
                    </div>
                  </div>
                </SectionPanel>

                <SectionPanel className="p-10 bg-white/50 backdrop-blur-sm">
                  <SectionTitle 
                    title="Instagram Highlights" 
                    copy="Four interactive cards that link directly to your social highlights." 
                    icon={Instagram} 
                  />
                  <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                    {[1, 2, 3, 4].map((idx) => {
                      const imageKey = `aboutInstagramImage${idx}` as keyof AboutContent;
                      const linkKey = `aboutInstagramLink${idx}` as keyof AboutContent;

                      return (
                        <div key={idx} className="group p-10 rounded-[45px] border-2 border-[#e4e4e7] bg-white transition-all hover:border-[#0020d7]/30 hover:shadow-3xl relative overflow-hidden">
                          <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                              <div className="h-4 w-4 rounded-full bg-[#0020d7] shadow-[0_0_10px_rgba(0,32,215,0.3)]" />
                              <span className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-[#4a4a68]">Asset Node {idx}</span>
                            </div>
                            <div className="h-12 w-12 rounded-[18px] bg-[#f7f4ef] border border-[#e4e4e7] flex items-center justify-center text-[#4a4a68] group-hover:bg-[#0020d7] group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm">
                              <Instagram size={22} strokeWidth={2} />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                            <div className="lg:col-span-8 space-y-6">
                              <div className="space-y-4">
                                <Field
                                  label="Visual Asset URL"
                                  value={about[imageKey] as string}
                                  onChange={(value) => setAbout({ ...about, [imageKey]: value })}
                                  icon={ImageIcon}
                                />
                                <div className="flex items-center gap-3">
                                  <input 
                                    type="file" 
                                    className="hidden" 
                                    id={`ig-upload-${idx}`} 
                                    onChange={(e) => {
                                      const f = e.target.files?.[0];
                                      if (f) uploadAsset(f, "about", (url) => setAbout({ ...about, [imageKey]: url }));
                                    }} 
                                  />
                                  <button 
                                    onClick={() => document.getElementById(`ig-upload-${idx}`)?.click()}
                                    className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#e4e4e7] text-[10px] font-extrabold uppercase tracking-widest hover:bg-[#0b0b0c] hover:text-white transition-all active:scale-95 shadow-sm"
                                  >
                                    <Upload size={12} strokeWidth={2.5} />
                                    Upload Asset
                                  </button>
                                </div>
                              </div>
                              <Field
                                label="Instagram Reference Link"
                                value={about[linkKey] as string}
                                onChange={(value) => setAbout({ ...about, [linkKey]: value })}
                                icon={Link2}
                              />
                            </div>

                            <div className="lg:col-span-4 flex justify-center">
                              {about[imageKey] ? (
                                <div className="relative aspect-square w-full max-w-[160px] overflow-hidden rounded-[33px] border-4 border-[#e4e4e7] bg-[#f7f4ef] shadow-2xl transition-all group-hover:border-[#0020d7]/20 group-hover:rotate-3">
                                  <img 
                                    src={about[imageKey] as string} 
                                    alt={`Instagram Card ${idx}`} 
                                    className="h-full w-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/200x200?text=IG"; }}
                                  />
                                </div>
                              ) : (
                                <div className="aspect-square w-full max-w-[160px] rounded-[33px] border-4 border-dashed border-[#e4e4e7] bg-[#f7f4ef]/50 flex items-center justify-center">
                                  <ImageIcon size={32} className="text-[#4a4a68] opacity-20" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </SectionPanel>
              </div>
            )}

            {activeTab === "chronicles" && (
              <div className="space-y-10">
                <SectionPanel className="p-10 bg-white/50 backdrop-blur-sm">
                  <SectionTitle 
                    title="Prologue & Introduction" 
                    copy="The opening narrative of your DeskBook." 
                    icon={BookOpen} 
                  />
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    <div className="lg:col-span-7 space-y-8">
                      <Field
                        label="Introduction Title"
                        value={siteCopy.aboutIntroTitle}
                        onChange={(v) => updateSiteCopy("aboutIntroTitle", v)}
                        icon={Sparkles}
                      />
                      <TextareaField
                        label="Introduction Narrative (DeskBook Body)"
                        value={siteCopy.aboutIntroBody}
                        onChange={(v) => updateSiteCopy("aboutIntroBody", v)}
                        rows={12}
                        icon={AlignLeftIcon}
                      />
                    </div>
                    <div className="lg:col-span-5 space-y-8">
                      <div className="space-y-4">
                        <Field
                          label="Introduction Visual Asset"
                          value={siteCopy.aboutBookImage}
                          onChange={(v) => updateSiteCopy("aboutBookImage", v)}
                          icon={ImageIcon}
                        />
                        <div className="flex items-center gap-3">
                          <input 
                            type="file" 
                            className="hidden" 
                            id="book-img-upload" 
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) uploadAsset(f, "about", (url) => updateSiteCopy("aboutBookImage", url));
                            }} 
                          />
                          <button 
                            onClick={() => document.getElementById("book-img-upload")?.click()}
                            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#e4e4e7] text-[10px] font-extrabold uppercase tracking-widest hover:bg-[#0b0b0c] hover:text-white transition-all active:scale-95 shadow-sm"
                          >
                            <Upload size={12} strokeWidth={2.5} />
                            Upload Asset
                          </button>
                        </div>
                      </div>
                      <div className="aspect-[3/4] w-full max-w-[300px] mx-auto overflow-hidden rounded-[20px] border-4 border-white shadow-xl bg-white p-2">
                        <div className="w-full h-full bg-[#f7f4ef] rounded-[14px] flex items-center justify-center overflow-hidden">
                          {siteCopy.aboutBookImage ? (
                            <img 
                              src={siteCopy.aboutBookImage} 
                              className="w-full h-full object-cover" 
                              alt="Book Preview"
                              onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x500?text=Book+Preview"; }}
                            />
                          ) : (
                            <ImageIcon size={48} className="text-[#4a4a68] opacity-20" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionPanel>

                <ListEditor
                  title="Professional Timeline"
                  addLabel="Register Milestone"
                  items={siteCopy.aboutTimelineEntries}
                  onAdd={() => {
                    const next = [...siteCopy.aboutTimelineEntries, { role: "New Role", organization: "", duration: "", copy: "" }];
                    updateSiteCopy("aboutTimelineEntries", next);
                  }}
                  onRemove={(idx) => {
                    const next = siteCopy.aboutTimelineEntries.filter((_, i) => i !== idx);
                    updateSiteCopy("aboutTimelineEntries", next);
                  }}
                  onMove={(idx, dir) => {
                    const next = [...siteCopy.aboutTimelineEntries];
                    const target = idx + dir;
                    if (target < 0 || target >= next.length) return;
                    [next[idx], next[target]] = [next[target], next[idx]];
                    updateSiteCopy("aboutTimelineEntries", next);
                  }}
                  icon={History}
                  renderItem={(entry, idx) => (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field 
                        label="Designation / Role" 
                        value={entry.role} 
                        onChange={(v) => {
                          const next = [...siteCopy.aboutTimelineEntries];
                          next[idx] = { ...next[idx], role: v };
                          updateSiteCopy("aboutTimelineEntries", next);
                        }} 
                        icon={Sparkles} 
                      />
                      <Field 
                        label="Organization / Institute" 
                        value={entry.organization} 
                        onChange={(v) => {
                          const next = [...siteCopy.aboutTimelineEntries];
                          next[idx] = { ...next[idx], organization: v };
                          updateSiteCopy("aboutTimelineEntries", next);
                        }} 
                        icon={User} 
                      />
                      <Field 
                        label="Duration / Timeline" 
                        value={entry.duration} 
                        onChange={(v) => {
                          const next = [...siteCopy.aboutTimelineEntries];
                          next[idx] = { ...next[idx], duration: v };
                          updateSiteCopy("aboutTimelineEntries", next);
                        }} 
                        icon={History} 
                      />
                      <TextareaField 
                        label="Narrative Context" 
                        value={entry.copy} 
                        onChange={(v) => {
                          const next = [...siteCopy.aboutTimelineEntries];
                          next[idx] = { ...next[idx], copy: v };
                          updateSiteCopy("aboutTimelineEntries", next);
                        }} 
                        className="md:col-span-2"
                        rows={3}
                        icon={BookOpen}
                      />
                    </div>
                  )}
                />

                <ListEditor
                  title="Certifications & Accolades"
                  addLabel="Register Certificate"
                  items={siteCopy.homeReviewsItems}
                  onAdd={() => {
                    const next = [...siteCopy.homeReviewsItems, { id: uid("cert"), name: "New Achievement", content: "", designation: "Achievement", rating: 0 }];
                    updateSiteCopy("homeReviewsItems", next);
                  }}
                  onRemove={(idx) => {
                    const next = siteCopy.homeReviewsItems.filter((_, i) => i !== idx);
                    updateSiteCopy("homeReviewsItems", next);
                  }}
                  icon={Trophy}
                  renderItem={(item, idx) => (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field 
                        label="Achievement Title" 
                        value={item.name} 
                        onChange={(v) => {
                          const next = [...siteCopy.homeReviewsItems];
                          next[idx] = { ...next[idx], name: v };
                          updateSiteCopy("homeReviewsItems", next);
                        }} 
                        icon={Trophy} 
                      />
                      <Field 
                        label="Category Label" 
                        value={item.designation || ""} 
                        onChange={(v) => {
                          const next = [...siteCopy.homeReviewsItems];
                          next[idx] = { ...next[idx], designation: v };
                          updateSiteCopy("homeReviewsItems", next);
                        }} 
                        icon={Sparkles} 
                      />
                      <TextareaField 
                        label="Achievement Narrative" 
                        value={item.content} 
                        onChange={(v) => {
                          const next = [...siteCopy.homeReviewsItems];
                          next[idx] = { ...next[idx], content: v };
                          updateSiteCopy("homeReviewsItems", next);
                        }} 
                        className="md:col-span-2"
                        rows={2}
                      />
                    </div>
                  )}
                />

                <SectionPanel className="p-10 bg-white/50 backdrop-blur-sm">
                   <SectionTitle 
                    title="Television Transmission" 
                    copy="The quote displayed on the retro television section." 
                    icon={Sparkles} 
                  />
                  <TextareaField
                    label="Television Quote"
                    value={siteCopy.aboutTypewriterQuote}
                    onChange={(v) => updateSiteCopy("aboutTypewriterQuote", v)}
                    rows={2}
                    icon={ExternalLink}
                  />
                </SectionPanel>
              </div>
            )}

            {activeTab === "archives" && (
              <div className="space-y-10">
                <SectionPanel className="p-10 bg-white/50 backdrop-blur-sm">
                  <SectionTitle 
                    title="Document Repository" 
                    copy="Manage the public-facing resumes and professional documents." 
                    icon={FileText} 
                  />
                  <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="p-8 rounded-[40px] bg-white border-2 border-[#e4e4e7] space-y-6 group hover:border-[#0020d7]/20 transition-all">
                      <div className="flex items-center justify-between">
                         <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#0020d7]">Master Protocol</p>
                         <FileDown size={20} className="text-[#0020d7] opacity-40" />
                      </div>
                      <h4 className="text-[18px] font-bold tracking-tight text-[#0b0b0c]">Standard Portfolio (PDF)</h4>
                      <div className="space-y-4">
                        <Field 
                          label="Archive URI" 
                          value={siteCopy.aboutResumeUrl} 
                          onChange={(v) => updateSiteCopy("aboutResumeUrl", v)} 
                          icon={Link2}
                        />
                        <div className="flex items-center gap-3">
                           <input 
                            type="file" 
                            accept=".pdf"
                            className="hidden" 
                            id="resume-upload" 
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) uploadAsset(f, "resume", (url) => updateSiteCopy("aboutResumeUrl", url));
                            }} 
                          />
                          <ActionButton 
                            onClick={() => document.getElementById("resume-upload")?.click()}
                            variant="secondary"
                            className="w-full"
                          >
                            <Upload size={14} />
                            Synchronize Master PDF
                          </ActionButton>
                        </div>
                        {siteCopy.aboutResumeUrl && (
                          <a 
                            href={siteCopy.aboutResumeUrl} 
                            target="_blank" 
                            className="flex items-center justify-center gap-2 text-[11px] font-extrabold text-[#0020d7] uppercase tracking-widest hover:underline"
                          >
                            <ExternalLink size={12} />
                            Verify Master Sync
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="p-8 rounded-[40px] bg-white border-2 border-[#e4e4e7] space-y-6 group hover:border-[#af52de]/20 transition-all">
                      <div className="flex items-center justify-between">
                         <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#af52de]">Visual Protocol</p>
                         <ImageIcon size={20} className="text-[#af52de] opacity-40" />
                      </div>
                      <h4 className="text-[18px] font-bold tracking-tight text-[#0b0b0c]">Designer Portfolio (PDF)</h4>
                      <div className="space-y-4">
                        <Field 
                          label="Archive URI" 
                          value={siteCopy.aboutDesignResumeUrl} 
                          onChange={(v) => updateSiteCopy("aboutDesignResumeUrl", v)} 
                          icon={Link2}
                        />
                         <div className="flex items-center gap-3">
                           <input 
                            type="file" 
                            accept=".pdf"
                            className="hidden" 
                            id="design-resume-upload" 
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) uploadAsset(f, "resume", (url) => updateSiteCopy("aboutDesignResumeUrl", url));
                            }} 
                          />
                          <ActionButton 
                            onClick={() => document.getElementById("design-resume-upload")?.click()}
                            variant="secondary"
                            className="w-full"
                          >
                            <Upload size={14} />
                            Synchronize Designer PDF
                          </ActionButton>
                        </div>
                        {siteCopy.aboutDesignResumeUrl && (
                          <a 
                            href={siteCopy.aboutDesignResumeUrl} 
                            target="_blank" 
                            className="flex items-center justify-center gap-2 text-[11px] font-extrabold text-[#af52de] uppercase tracking-widest hover:underline"
                          >
                            <ExternalLink size={12} />
                            Verify Designer Sync
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </SectionPanel>
              </div>
            )}
          </motion.div>
        </AnimatePresence>


      </main>
    </AdminSectionWorkspace>
  );
}

function AboutAdminTabs({
  activeTab,
  onChange,
}: {
  activeTab: AboutAdminTab;
  onChange: (tab: AboutAdminTab) => void;
}) {
  return (
    <div className="rounded-[40px] border border-black/5 bg-white p-1.5 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] sticky top-28 z-20 mx-auto max-w-[1400px] mb-12">
      <div className="flex items-center overflow-x-auto scrollbar-hide no-scrollbar gap-1 p-1">
        {aboutAdminTabs.map((tab) => {
          const active = activeTab === tab.id;
          const Icon = tab.icon as any;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-4 rounded-[32px] px-6 py-4 text-left transition-all relative group whitespace-nowrap ${
                active
                  ? "bg-[#0020d7]/[0.03] ring-1 ring-[#0020d7]/20 shadow-sm"
                  : "bg-transparent text-[#86868b] hover:bg-black/[0.02]"
              }`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-all ${
                active 
                  ? "bg-[#0020d7] text-white shadow-lg shadow-[#0020d7]/20" 
                  : "bg-[#f5f5f7] text-[#86868b] group-hover:bg-[#e4e4e7]"
              }`}>
                <Icon size={18} strokeWidth={active ? 2.5 : 2} />
              </div>
              <div className="flex flex-col">
                <span className={`text-[13px] font-extrabold tracking-tight transition-colors ${
                  active ? "text-[#0020d7]" : "text-[#1d1d1f]"
                }`}>
                  {tab.label}
                </span>
                <span className={`text-[10px] font-medium transition-colors ${
                  active ? "text-[#0020d7]/60" : "text-[#86868b]"
                }`}>
                  {tab.description}
                </span>
              </div>
              {active && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 border-2 border-[#0020d7] rounded-[32px] pointer-events-none"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AlignLeftIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="21" x2="3" y1="6" y2="6" />
      <line x1="15" x2="3" y1="12" y2="12" />
      <line x1="17" x2="3" y1="18" y2="18" />
    </svg>
  );
}
