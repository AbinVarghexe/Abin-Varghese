"use client";

import { useEffect, useState } from "react";
import AdminSectionWorkspace, { SectionTitle, Field, SectionPanel, ActionButton } from "@/components/admin/AdminSectionWorkspace";
import { Save, Instagram, Image as ImageIcon, Link2, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
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
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-[#86868b]">
        <Sparkles size={32} className="animate-pulse text-[#af52de]" />
        <p className="text-[14px] font-medium tracking-tight">Preparing About Workspace...</p>
      </div>
    );
  }

  return (
    <AdminSectionWorkspace
      sectionLabel="Visual Storytelling"
      sectionTitle="About & Instagram Control"
      sectionDescription="Manage the scrapbook hero and the rotating Instagram highlight cards."
      icon={Instagram}
      iconColor="#0020d7"
    >
      <div className="space-y-10 pb-32">
        <SectionPanel className="p-10 bg-white/50 backdrop-blur-sm">
          <SectionTitle 
            title="Main Hero Scrapbook" 
            copy="The primary large visual asset shown in the About section." 
            icon={ImageIcon} 
          />
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-8">
              <Field
                label="Primary Image URL"
                value={about.aboutImage}
                onChange={(value) => setAbout({ ...about, aboutImage: value })}
                icon={ImageIcon}
              />
              <div className="rounded-[28px] bg-[#f7f4ef]/50 border-2 border-[#e4e4e7] p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle size={24} strokeWidth={2.5} className="text-[#0020d7] mt-1 shrink-0" />
                  <p className="text-[14px] leading-relaxed text-[#4a4a68] font-medium">
                    This image acts as the anchor for the about section. Ensure it has a balanced composition as it will be partially overlaid by text elements in the production environment.
                  </p>
                </div>
              </div>
            </div>
            
            {about.aboutImage && (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[33px] border-4 border-[#e4e4e7] shadow-2xl group">
                <img 
                  src={about.aboutImage} 
                  alt="About Hero" 
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/800x600?text=Hero+Image+Preview"; }}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <Sparkles className="text-white animate-pulse" size={40} />
                </div>
              </div>
            )}
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
                      <Field
                        label="Visual Asset URL"
                        value={about[imageKey] as string}
                        onChange={(value) => setAbout({ ...about, [imageKey]: value })}
                        icon={ImageIcon}
                      />
                      <Field
                        label="Instagram Intelligence Link"
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

                  {/* Hover decoration */}
                  <div className="absolute -top-24 -right-24 h-48 w-48 bg-[#0020d7] rounded-full blur-[100px] opacity-0 group-hover:opacity-[0.05] transition-opacity duration-1000" />
                </div>
              );
            })}
          </div>
        </SectionPanel>

        {/* Persistent Action Bar */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-8">
          <div className="flex items-center justify-between gap-4 p-2.5 rounded-[24px] bg-white/95 border-2 border-[#e4e4e7] shadow-2xl backdrop-blur-md">
            <div className="flex-1 px-4">
              {status ? (
                <div className="flex items-center gap-3">
                  {status.includes("failed") ? (
                    <AlertCircle size={16} strokeWidth={2.5} className="text-[#ff3b30]" />
                  ) : (
                    <div className={`h-2 w-2 rounded-full ${saving ? "bg-[#0020d7] animate-pulse shadow-[0_0_8px_rgba(0,32,215,0.4)]" : "bg-[#34c759] shadow-[0_0_8px_rgba(52,199,89,0.4)]"}`} />
                  )}
                  <p className={`text-[11px] font-extrabold uppercase tracking-widest ${status.includes("failed") ? "text-[#ff3b30]" : "text-[#0b0b0c] opacity-80"}`}>
                    {status}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#34c759] shadow-[0_0_8px_rgba(52,199,89,0.4)]" />
                  <p className="text-[11px] font-extrabold text-[#0b0b0c] uppercase tracking-widest opacity-80">System Standby</p>
                </div>
              )}
            </div>
            <ActionButton
              onClick={saveAbout}
              disabled={saving}
            >
              {saving ? "Syncing..." : "Update Workspace"}
              <Save size={14} strokeWidth={2.5} />
            </ActionButton>
          </div>
        </div>
      </div>
    </AdminSectionWorkspace>
  );
}
