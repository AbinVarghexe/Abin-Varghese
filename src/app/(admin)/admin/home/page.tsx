"use client";

import { useEffect, useMemo, useState } from "react";
import type React from "react";
import {
  ExternalLink,
  ImageIcon,
  Plus,
  Upload,
  Wrench,
  Home,
  Package,
  FolderKanban,
  Building2,
  User,
  Layers,
  Trophy,
  Save,
  ArrowUp,
  ArrowDown,
  Trash2,
  Sparkles,
  Zap,
  Globe,
  Settings,
  ShieldCheck,
  Layout,
  MousePointer2,
  AlignLeft,
  Monitor,
  Code,
  Loader2
} from "lucide-react";
import AdminSectionWorkspace, { 
  SectionTitle, 
  Field, 
  TextareaField, 
  SectionPanel, 
  TinyButton, 
  ListEditor, 
  ActionButton, 
  StatusBadge,
  SelectField
} from "@/components/admin/AdminSectionWorkspace";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { aboutContentDefaults, type AboutContent } from "@/lib/about-content-defaults";
import { heroContentDefaults, type HeroContent } from "@/lib/hero-content-defaults";
import { homeContentDefaults, type HomeContent } from "@/lib/home-content-defaults";
import { type SiteCopyContent, siteCopyDefaults, type SiteCopyTool } from "@/types/site-copy";
import type { Service } from "@/constants/services";
import type { Achievement } from "@/lib/achievements";

type ProjectOption = {
  id: string;
  title: string;
  category?: string;
  imageUrl?: string;
  workspace?: string;
  liveUrl?: string | null;
};

type DraftAchievement = Achievement & { localId: string; persisted: boolean };

type HomeAdminTab = "hero" | "toolbox" | "projects" | "brands" | "about" | "services" | "achievements";

const homeAdminTabs: Array<{
  id: HomeAdminTab;
  label: string;
  description: string;
  icon: React.ElementType;
}> = [
  { id: "hero", label: "Hero Context", description: "Intro, CTA, socials", icon: Home },
  { id: "toolbox", label: "Toolbox Assets", description: "Categories, tools, icons", icon: Package },
  { id: "projects", label: "Featured Work", description: "Curated work selections", icon: FolderKanban },
  { id: "brands", label: "Brand Node", description: "Scrolling partner logos", icon: Building2 },
  { id: "about", label: "Identity", description: "Bio and profile imagery", icon: User },
  { id: "services", label: "Offerings", description: "Core service architecture", icon: Layers },
  { id: "achievements", label: "Milestones", description: "Verified success cards", icon: Trophy },
];

const DESIGN_TOOL_DOMAINS = [
  "figma.com",
  "behance.net",
  "dribbble.com",
  "pinterest.com",
  "pinterest.co",
  "canva.com",
  "sketch.com",
  "invisionapp.com",
  "adobe.com",
  "framer.com",
  "zeplin.io",
  "miro.com",
];

function isLiveWebsiteUrl(url?: string | null): boolean {
  if (!url) return false;
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return !DESIGN_TOOL_DOMAINS.some(d => hostname === d || hostname.endsWith(`.${d}`));
  } catch {
    return false;
  }
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function AdminHomePage() {
  const [hero, setHero] = useState<HeroContent>(heroContentDefaults);
  const [home, setHome] = useState<HomeContent>(homeContentDefaults);
  const [about, setAbout] = useState<AboutContent>(aboutContentDefaults);
  const [siteCopy, setSiteCopy] = useState<SiteCopyContent>(siteCopyDefaults);
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [achievements, setAchievements] = useState<DraftAchievement[]>([]);
  const [deletedAchievementIds, setDeletedAchievementIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<HomeAdminTab>("hero");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [contentRes, copyRes, projectsRes, servicesRes, achievementsRes] = await Promise.all([
          fetch("/api/admin/site-content", { cache: "no-store" }),
          fetch("/api/admin/site-copy", { cache: "no-store" }),
          fetch("/api/admin/all-projects", { cache: "no-store" }),
          fetch("/api/admin/services", { cache: "no-store" }),
          fetch("/api/admin/achievements", { cache: "no-store" }),
        ]);

        if (contentRes.ok) {
          const data = await contentRes.json();
          setHero(data.hero || heroContentDefaults);
          setHome({ ...homeContentDefaults, ...(data.home || {}) });
          setAbout({ ...aboutContentDefaults, ...(data.about || {}) });
        }
        if (copyRes.ok) {
          const data = await copyRes.json();
          setSiteCopy({ ...siteCopyDefaults, ...(data.siteCopy || {}) });
        }
        if (projectsRes.ok) setProjects(await projectsRes.json());
        if (servicesRes.ok) {
          const data = await servicesRes.json();
          setServices(data.services || []);
        }
        if (achievementsRes.ok) {
          const data: Achievement[] = await achievementsRes.json();
          setAchievements(
            data.map((item) => ({
              ...item,
              localId: item.id || uid("achievement"),
              persisted: Boolean(item.id),
            }))
          );
        }
      } catch (error) {
        toast.error("Initialization failure. System offline.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const selectedProjects = useMemo(() => siteCopy.homeRecentWebProjectIds || [], [siteCopy.homeRecentWebProjectIds]);

  function updateSiteCopy<K extends keyof SiteCopyContent>(field: K, value: SiteCopyContent[K]) {
    setSiteCopy((current) => ({ ...current, [field]: value }));
  }

  async function uploadLogo(file: File, onUrl: (url: string) => void) {
    const formData = new FormData();
    formData.append("file", file);
    const toastId = toast.loading("Uploading asset...");
    const response = await fetch("/api/admin/upload/logo", { method: "POST", body: formData });
    if (!response.ok) {
      toast.error("Asset upload failed.", { id: toastId });
      return;
    }
    const data = await response.json();
    onUrl(data.url);
    toast.success("Asset live.", { id: toastId });
  }

  function moveSelectedProject(id: string, direction: -1 | 1) {
    const current = [...selectedProjects];
    const index = current.indexOf(id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= current.length) return;
    [current[index], current[target]] = [current[target], current[index]];
    updateSiteCopy("homeRecentWebProjectIds", current);
  }

  function toggleProject(id: string) {
    const current = selectedProjects;
    updateSiteCopy(
      "homeRecentWebProjectIds",
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }
  function addService() {
    const newService: Service = {
      id: uid("service"),
      title: "New Service",
      description: "Brief description",
      detailedDescription: "Detailed description",
      accentColor: "#0020d7",
      providedServices: [],
    };
    setServices([...services, newService]);
  }

  function updateService(id: string, updates: Partial<Service>) {
    setServices(services.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  }

  function removeService(id: string) {
    setServices(services.filter((s) => s.id !== id));
  }

  function addAchievement() {
    const newAchievement: DraftAchievement = {
      localId: uid("achievement"),
      title: "New Achievement",
      description: "Description",
      date: new Date().toISOString().split("T")[0],
      category: "Award",
      imageUrl: "",
      externalLink: "",
      featured: false,
      orderIndex: achievements.length,
      persisted: false,
    };
    setAchievements([...achievements, newAchievement]);
  }

  function updateAchievement(localId: string, updates: Partial<DraftAchievement>) {
    setAchievements(achievements.map((a) => (a.localId === localId ? { ...a, ...updates } : a)));
  }

  function removeAchievement(localId: string) {
    const target = achievements.find((a) => a.localId === localId);
    if (target?.id) {
      setDeletedAchievementIds((prev) => [...prev, target.id as string]);
    }
    setAchievements(achievements.filter((a) => a.localId !== localId));
  }

  async function saveHome() {
    setSaving(true);
    const toastId = toast.loading("Deploying homepage updates...");
    try {
      const requests = [
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
        fetch("/api/admin/services", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ services }),
        }),
      ];

      for (const id of deletedAchievementIds) {
        requests.push(fetch(`/api/admin/achievements/${id}`, { method: "DELETE" }));
      }

      for (const item of achievements) {
        const payload = {
          title: item.title,
          description: item.description,
          date: item.date,
          category: item.category,
          imageUrl: item.imageUrl || "",
          externalLink: item.externalLink || "",
          featured: item.featured,
          orderIndex: item.orderIndex,
        };
        requests.push(
          fetch(item.persisted && item.id ? `/api/admin/achievements/${item.id}` : "/api/admin/achievements", {
            method: item.persisted && item.id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        );
      }

      const responses = await Promise.all(requests);
      const allOk = responses.every(r => r.ok);

      if (!allOk) {
        throw new Error("One or more requests failed.");
      }

      setDeletedAchievementIds([]);
      toast.success("Homepage successfully synchronized.", { id: toastId });
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
          <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#0020d7]" size={24} />
        </div>
        <p className="text-[14px] font-extrabold text-[#0b0b0c] uppercase tracking-[0.25em]">Initialising Command Deck</p>
      </div>
    );
  }

  return (
    <AdminSectionWorkspace
      sectionLabel="Core Engine"
      sectionTitle="Central Command Deck"
      sectionDescription="Orchestrate your public presence. Unified control for all homepage modules and assets."
      icon={Globe}
      iconColor="#0020d7"
    >
      <HomeAdminTabs activeTab={activeTab} onChange={setActiveTab} />

      <main className="max-w-[1400px] mx-auto space-y-10 pb-40">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeTab === "hero" && (
                <SectionPanel className="flex flex-col gap-10 bg-white/50 backdrop-blur-sm">
                  <SectionTitle title="Hero Identity" copy="Establish the primary narrative for your brand's entry point." icon={Layout} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Field label="Introductory Salutation" value={hero.heroGreeting} onChange={(v) => setHero({ ...hero, heroGreeting: v })} icon={MousePointer2} />
                    <Field label="Primary Designation (Name)" value={hero.heroName} onChange={(v) => setHero({ ...hero, heroName: v })} icon={User} />
                    <TextareaField label="Core Narrative / Role" value={hero.heroSubcopy} onChange={(v) => setHero({ ...hero, heroSubcopy: v })} className="md:col-span-2" rows={3} icon={AlignLeft} />
                    <Field label="Location Metadata" value={hero.heroAvailabilityText} onChange={(v) => setHero({ ...hero, heroAvailabilityText: v })} icon={Globe} />
                    <Field label="System Status Line" value={siteCopy.heroStatusLine} onChange={(v) => updateSiteCopy("heroStatusLine", v)} icon={Zap} />
                  </div>

                  <div className="pt-10 border-t-2 border-[#f7f4ef]">
                    <SectionTitle title="Call to Action Protocols" copy="Manage redirect destinations and button labels." icon={Zap} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                      <div className="p-8 rounded-[33px] bg-[#f7f4ef]/50 border-2 border-[#e4e4e7] space-y-6 relative overflow-hidden group">
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#0020d7]">Primary Protocol</p>
                        <Field label="Button Label" value={hero.heroCtaPrimaryLabel} onChange={(v) => setHero({ ...hero, heroCtaPrimaryLabel: v })} />
                        <Field label="Redirect URI" value={hero.heroCtaPrimaryUrl} onChange={(v) => setHero({ ...hero, heroCtaPrimaryUrl: v })} icon={ExternalLink} />
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Zap size={40} className="text-[#0020d7]" />
                        </div>
                      </div>
                      <div className="p-8 rounded-[33px] bg-white border-2 border-[#e4e4e7] space-y-6 relative overflow-hidden group">
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#4a4a68]">Secondary Protocol</p>
                        <Field label="Button Label" value={hero.heroCtaSecondaryLabel} onChange={(v) => setHero({ ...hero, heroCtaSecondaryLabel: v })} />
                        <Field label="Redirect URI" value={hero.heroCtaSecondaryUrl} onChange={(v) => setHero({ ...hero, heroCtaSecondaryUrl: v })} icon={ExternalLink} />
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                          <Settings size={40} className="text-[#0b0b0c]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-10 border-t-2 border-[#f7f4ef]">
                    <SectionTitle title="Social Nodes" copy="Direct links to external professional ecosystems." icon={Globe} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">
                      {(Object.keys(home.socialLinks) as Array<keyof HomeContent["socialLinks"]>).map((key) => (
                        <div key={key} className="p-6 rounded-[28px] bg-white border-2 border-[#e4e4e7] hover:border-[#0020d7]/10 transition-all shadow-sm">
                          <Field
                            label={key.charAt(0).toUpperCase() + key.slice(1)}
                            value={home.socialLinks[key]}
                            onChange={(v) => setHome({ ...home, socialLinks: { ...home.socialLinks, [key]: v } })}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </SectionPanel>
              )}

              {activeTab === "toolbox" && (
                <SectionPanel className="flex flex-col gap-8">
                  <SectionTitle title="Creative Toolbox" copy="Curate the technology stack and design tools." icon={Package} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Module Heading" value={siteCopy.homeToolboxHeading} onChange={(v) => updateSiteCopy("homeToolboxHeading", v)} icon={Package} />
                    <TextareaField label="Module Narrative" value={siteCopy.homeToolboxIntro} onChange={(v) => updateSiteCopy("homeToolboxIntro", v)} rows={2} icon={AlignLeft} />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {siteCopy.homeToolCategories.map((item, idx) => (
                      <div key={item.id} className="p-4 rounded-[28px] bg-white border-2 border-[#e4e4e7]">
                        <div className="grid grid-cols-1 gap-4">
                          <Field label="Domain Name" value={item.name} onChange={(v) => {
                            const next = [...siteCopy.homeToolCategories];
                            next[idx] = { ...next[idx], name: v };
                            updateSiteCopy("homeToolCategories", next);
                          }} />
                          <Field label="Brief Description" value={item.description} onChange={(v) => {
                            const next = [...siteCopy.homeToolCategories];
                            next[idx] = { ...next[idx], description: v };
                            updateSiteCopy("homeToolCategories", next);
                          }} />
                        </div>
                        <div className="flex items-center justify-end mt-2">
                          <button type="button" onClick={() => updateSiteCopy("homeToolCategories", siteCopy.homeToolCategories.filter((_, i) => i !== idx))}
                            className="text-sm text-[#d63939] hover:underline">
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => updateSiteCopy("homeToolCategories", [...siteCopy.homeToolCategories, { id: uid("cat"), name: "New Domain", description: "" }])}
                      className="flex items-center justify-center p-4 rounded-[28px] bg-[#f7f4ef] border-2 border-[#e4e4e7] hover:bg-[#e4e4e7]">
                      Add Domain
                    </button>
                  </div>

                  <ToolboxToolsEditor
                    categories={siteCopy.homeToolCategories}
                    tools={siteCopy.homeTools}
                    onChange={(t) => updateSiteCopy("homeTools", t)}
                    onUpload={uploadLogo}
                  />
                </SectionPanel>
              )}

              {activeTab === "projects" && (
                <SectionPanel className="flex flex-col gap-10 bg-white/50 backdrop-blur-sm">
                  <SectionTitle title="Featured Repository" copy="Curate high-impact work for the landing page." icon={FolderKanban} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Field label="Section Heading" value={siteCopy.homeRecentHeading} onChange={(v) => updateSiteCopy("homeRecentHeading", v)} />
                    <TextareaField label="Intro Narrative" value={siteCopy.homeRecentIntro} onChange={(v) => updateSiteCopy("homeRecentIntro", v)} rows={2} />
                  </div>

                  <div className="p-10 rounded-[40px] bg-[#f7f4ef] border-2 border-[#e4e4e7]">
                    <h4 className="text-[15px] font-extrabold text-[#0b0b0c] mb-8 flex items-center gap-3">
                      <ShieldCheck size={20} className="text-[#0020d7]" /> Selection Interface
                    </h4>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(() => {
                          const liveProjects = projects.filter(p => isLiveWebsiteUrl(p.liveUrl) && p.workspace !== "designing");
                          if (liveProjects.length === 0) {
                            return <p className="col-span-full text-center text-[#4a4a68]">No live projects available.</p>;
                          }
                          return liveProjects.map(p => {
                            const active = selectedProjects.includes(p.id);
                            return (
                              <button 
                                key={p.id} 
                                onClick={() => toggleProject(p.id)}
                                className={`group/card rounded-[24px] border-2 text-left transition-all active:scale-[0.97] overflow-hidden ${
                                  active ? "bg-white border-[#0020d7] shadow-2xl shadow-black/10 ring-4 ring-[#0020d7]/5" : "bg-white/50 border-[#e4e4e7] opacity-60 hover:opacity-100 hover:border-[#0020d7]/20"
                                }`}
                              >
                                {p.imageUrl ? (
                                  <div className="aspect-video w-full bg-[#f7f4ef] overflow-hidden relative">
                                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105" />
                                    {active && (
                                      <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-[#0020d7] flex items-center justify-center shadow-lg">
                                        <ShieldCheck size={12} className="text-white" />
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="aspect-video w-full bg-[#f7f4ef] flex items-center justify-center">
                                    <ImageIcon size={28} className="text-[#4a4a68] opacity-20" />
                                  </div>
                                )}
                                <div className="p-4 space-y-2">
                                  <p className="text-[14px] font-extrabold truncate tracking-tight">{p.title}</p>
                                  <p className="text-[11px] text-[#4a4a68] uppercase font-extrabold tracking-widest">{p.category || "General"}</p>
                                  {p.liveUrl && (
                                    <p className="text-[10px] text-[#0020d7] truncate flex items-center gap-1 font-semibold opacity-70">
                                      <Globe size={10} strokeWidth={2.5} />
                                      {p.liveUrl.replace(/^https?:\/\//, "")}
                                    </p>
                                  )}
                                </div>
                              </button>
                            );
                          });
                        })()}
                      </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[11px] font-extrabold text-[#4a4a68] uppercase tracking-[0.25em] px-2">Active Sequencing</p>
                    <div className="space-y-3">
                      {selectedProjects.map((id, idx) => {
                        const p = projects.find(x => x.id === id);
                        return (
                          <div key={id} className="flex items-center justify-between p-5 rounded-[24px] bg-white border-2 border-[#e4e4e7] group hover:border-[#0020d7]/30 transition-all">
                            <div className="flex items-center gap-5">
                              <div className="h-10 w-10 rounded-[14px] bg-[#f7f4ef] border border-[#e4e4e7] flex items-center justify-center text-[14px] font-extrabold text-[#0b0b0c]">{idx + 1}</div>
                              <p className="text-[14px] font-extrabold tracking-tight">{p?.title || id}</p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                              <TinyButton onClick={() => moveSelectedProject(id, -1)}><ArrowUp size={14} strokeWidth={2.5} /></TinyButton>
                              <TinyButton onClick={() => moveSelectedProject(id, 1)}><ArrowDown size={14} strokeWidth={2.5} /></TinyButton>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </SectionPanel>
              )}

              {activeTab === "brands" && (
                <SectionPanel className="flex flex-col gap-10 bg-white/50 backdrop-blur-sm">
                  <SectionTitle title="Partner Ecosystem" copy="Manage the scrolling brand strip logos." icon={Building2} />
                  <ListEditor
                    title="Logo Index"
                    addLabel="Add Brand"
                    items={home.scrollingLogos}
                    onAdd={() => setHome({ ...home, scrollingLogos: [...home.scrollingLogos, ""] })}
                    onRemove={(idx) => setHome({ ...home, scrollingLogos: home.scrollingLogos.filter((_, i) => i !== idx) })}
                    renderItem={(logo, idx) => (
                      <div className="flex items-center gap-8 p-4 rounded-[28px] bg-[#f7f4ef]/50 border-2 border-transparent hover:border-[#0020d7]/20 transition-all">
                        <div className="h-24 w-24 rounded-[22px] bg-white flex items-center justify-center border-2 border-[#e4e4e7] overflow-hidden p-4 shadow-sm ring-4 ring-transparent hover:ring-[#0020d7]/5 transition-all shrink-0">
                          {logo ? <img src={logo} className="w-full h-full object-contain" /> : <ImageIcon className="text-[#4a4a68] opacity-30" size={32} />}
                        </div>
                        <div className="flex-1 space-y-4">
                          <Field label="Logo URI" value={logo} onChange={(v) => {
                            const next = [...home.scrollingLogos];
                            next[idx] = v;
                            setHome({ ...home, scrollingLogos: next });
                          }} />
                          <div className="flex items-center gap-3">
                            <input 
                              type="file" 
                              className="hidden" 
                              id={`brand-upload-${idx}`} 
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) uploadLogo(f, (url) => {
                                  const next = [...home.scrollingLogos];
                                  next[idx] = url;
                                  setHome({ ...home, scrollingLogos: next });
                                });
                              }} 
                            />
                            <button 
                              onClick={() => document.getElementById(`brand-upload-${idx}`)?.click()}
                              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#e4e4e7] text-[10px] font-extrabold uppercase tracking-widest hover:bg-[#0b0b0c] hover:text-white transition-all active:scale-95 shadow-sm"
                            >
                              <Upload size={12} strokeWidth={2.5} />
                              Replace Asset
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  />
                </SectionPanel>
              )}

              {activeTab === "about" && (
                <SectionPanel className="flex flex-col gap-10 bg-white/50 backdrop-blur-sm">
                  <SectionTitle title="Identity Architecture" copy="Bio narrative and profile visual assets." icon={User} />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[1, 2, 3].map(num => (
                      <div key={num} className="flex flex-col gap-6 p-8 rounded-[40px] bg-white border-2 border-[#e4e4e7] shadow-sm group">
                        <div className="aspect-[4/5] rounded-[28px] bg-[#f7f4ef] border-2 border-[#e4e4e7] flex items-center justify-center overflow-hidden relative shadow-inner">
                          {((about as any)[`homeAboutImage${num}`]) ? (
                            <img src={(about as any)[`homeAboutImage${num}`]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          ) : (
                            <ImageIcon size={40} className="text-[#4a4a68] opacity-20" />
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                             <div className="bg-white/20 backdrop-blur-md rounded-full p-4 border border-white/30">
                               <Upload size={24} className="text-white" />
                             </div>
                          </div>
                        </div>
                        <Field 
                          label={`Asset URI ${num}`} 
                          value={(about as any)[`homeAboutImage${num}`]} 
                          onChange={(v) => setAbout({ ...about, [`homeAboutImage${num}`]: v } as any)} 
                          icon={ImageIcon}
                        />
                      </div>
                    ))}
                    <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t-2 border-[#f7f4ef]">
                      <Field label="Section Heading" value={siteCopy.homeAboutHeading} onChange={(v) => updateSiteCopy("homeAboutHeading", v)} />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="CTA Label" value={siteCopy.homeAboutCtaLabel} onChange={(v) => updateSiteCopy("homeAboutCtaLabel", v)} />
                        <Field label="CTA Destination" value={siteCopy.homeAboutCtaUrl} onChange={(v) => updateSiteCopy("homeAboutCtaUrl", v)} icon={ExternalLink} />
                      </div>
                      <TextareaField label="Narrative Payload" value={siteCopy.homeAboutBody} onChange={(v) => updateSiteCopy("homeAboutBody", v)} className="md:col-span-2" rows={8} icon={AlignLeft} />
                    </div>
                  </div>
                </SectionPanel>
              )}
              {activeTab === "services" && (
                <ListEditor
                  title="Service Offerings"
                  addLabel="Add Service Protocol"
                  items={services}
                  onAdd={addService}
                  onRemove={(idx) => removeService(services[idx].id)}
                  icon={Layers}
                  renderItem={(service) => (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field label="Service Title" value={service.title} onChange={(v) => updateService(service.id, { title: v })} icon={Sparkles} />
                        <Field label="Accent Color Hex" value={service.accentColor} onChange={(v) => updateService(service.id, { accentColor: v })} icon={Zap} />
                        <Field label="Redirect Destination" value={service.projectsUrl || ""} onChange={(v) => updateService(service.id, { projectsUrl: v })} icon={ExternalLink} />
                        <Field label="Redirect Label" value={service.projectsLabel || ""} onChange={(v) => updateService(service.id, { projectsLabel: v })} icon={MousePointer2} />
                      </div>
                      <TextareaField label="Brief Summary" value={service.description} onChange={(v) => updateService(service.id, { description: v })} rows={2} icon={AlignLeft} />
                      <TextareaField label="Detailed Narrative" value={service.detailedDescription} onChange={(v) => updateService(service.id, { detailedDescription: v })} rows={4} icon={AlignLeft} />
                    </div>
                  )}
                />
              )}

              {activeTab === "achievements" && (
                <ListEditor
                  title="Highlighted Milestones"
                  addLabel="Register Achievement"
                  items={achievements}
                  onAdd={addAchievement}
                  onRemove={(idx) => removeAchievement(achievements[idx].localId)}
                  icon={Trophy}
                  renderItem={(achievement) => (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                      <div className="md:col-span-5 space-y-6">
                        <div className="aspect-video rounded-[33px] bg-[#f7f4ef] border-4 border-[#e4e4e7] flex items-center justify-center overflow-hidden relative group shadow-inner">
                          {achievement.imageUrl ? (
                            <img src={achievement.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          ) : (
                            <ImageIcon size={48} className="text-[#4a4a68] opacity-20" />
                          )}
                          <input 
                            type="file" 
                            className="hidden" 
                            id={`achievement-img-${achievement.localId}`} 
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) uploadLogo(f, (url) => updateAchievement(achievement.localId, { imageUrl: url }));
                            }}
                          />
                          <div 
                            onClick={() => document.getElementById(`achievement-img-${achievement.localId}`)?.click()}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer pointer-events-auto"
                          >
                             <div className="bg-white/20 backdrop-blur-md rounded-full p-4 border border-white/30">
                               <Upload size={24} className="text-white" />
                             </div>
                          </div>
                        </div>
                        <Field label="Evidence Asset URI" value={achievement.imageUrl} onChange={(v) => updateAchievement(achievement.localId, { imageUrl: v })} icon={ImageIcon} />
                      </div>
                      
                      <div className="md:col-span-7 grid grid-cols-1 gap-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Field label="Achievement Title" value={achievement.title} onChange={(v) => updateAchievement(achievement.localId, { title: v })} icon={Sparkles} />
                          <Field label="Category Label" value={achievement.category} onChange={(v) => updateAchievement(achievement.localId, { category: v })} icon={Package} />
                          <Field label="Completion Date" value={achievement.date || ""} onChange={(v) => updateAchievement(achievement.localId, { date: v })} icon={Globe} />
                          <Field label="Evidence Link" value={achievement.externalLink} onChange={(v) => updateAchievement(achievement.localId, { externalLink: v })} icon={ExternalLink} />
                        </div>
                        
                        <div className="flex items-center gap-4 p-6 rounded-[28px] bg-[#f7f4ef]/50 border-2 border-[#e4e4e7] shadow-sm">
                           <input 
                             type="checkbox" 
                             checked={achievement.featured} 
                             onChange={(e) => updateAchievement(achievement.localId, { featured: e.target.checked })}
                             className="h-6 w-6 rounded-lg border-2 border-[#e4e4e7] text-[#0020d7] focus:ring-[#0020d7]/20"
                           />
                           <span className="text-[14px] font-extrabold text-[#0b0b0c] uppercase tracking-widest opacity-80">Feature in High-Priority Highlights</span>
                        </div>

                        <TextareaField label="Narrative Context" value={achievement.description} onChange={(v) => updateAchievement(achievement.localId, { description: v })} rows={3} icon={AlignLeft} />
                      </div>
                    </div>
                  )}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Persistent Action Bar */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-8">
            <div className="flex items-center justify-between gap-4 p-2.5 rounded-[24px] bg-white/95 border-2 border-[#e4e4e7] shadow-2xl backdrop-blur-md">
              <div className="flex-1 px-4">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${saving ? "bg-[#0020d7] animate-pulse shadow-[0_0_8px_rgba(0,32,215,0.4)]" : "bg-[#34c759] shadow-[0_0_8px_rgba(52,199,89,0.4)]"}`} />
                  <p className="text-[11px] font-extrabold text-[#0b0b0c] uppercase tracking-widest opacity-80">
                    {saving ? "Deploying..." : "System Standby"}
                  </p>
                </div>
              </div>
              <ActionButton onClick={saveHome} disabled={saving}>
                {saving ? "Syncing..." : "Sync Changes"}
                <Save size={14} strokeWidth={2.5} />
              </ActionButton>
            </div>
          </div>
        </main>

    </AdminSectionWorkspace>
  );
}



// Field definition moved to import from AdminSectionWorkspace


function HomeAdminTabs({
  activeTab,
  onChange,
}: {
  activeTab: HomeAdminTab;
  onChange: (tab: HomeAdminTab) => void;
}) {
  return (
    <div className="rounded-[40px] border border-black/5 bg-white p-1.5 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] sticky top-28 z-20 mx-auto max-w-[1400px] mb-12">
      <div className="flex items-center overflow-x-auto scrollbar-hide no-scrollbar gap-1 p-1">
        {homeAdminTabs.map((tab) => {
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

function ToolboxToolsEditor({
  categories,
  tools,
  onChange,
  onUpload,
}: {
  categories: SiteCopyContent["homeToolCategories"];
  tools: SiteCopyTool[];
  onChange: (tools: SiteCopyTool[]) => void;
  onUpload: (file: File, onUrl: (url: string) => void) => Promise<void>;
}) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || "all");
  const [expandedToolId, setExpandedToolId] = useState<string | null>(null);
  const categoryOptions = categories.map((category) => ({ label: category.name, value: category.id }));
  const visibleTools = activeCategory === "all" ? tools : tools.filter((tool) => tool.category === activeCategory);

  function addTool(category = categories[0]?.id || "design") {
    onChange([
      ...tools,
      {
        id: uid("tool"),
        name: "New Tool",
        description: "",
        icon: "https://skillicons.dev/icons?i=vscode",
        category,
        url: "",
      },
    ]);
    setActiveCategory(category);
  }

  function updateTool(id: string, patch: Partial<SiteCopyTool>) {
    onChange(tools.map((tool) => (tool.id === id ? { ...tool, ...patch } : tool)));
  }

  function removeTool(id: string) {
    onChange(tools.filter((tool) => tool.id !== id));
  }

  return (
    <div className="mt-10 rounded-[40px] border-2 border-[#e4e4e7] bg-[#f7f4ef]/40 p-10">
      <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
        <div>
          <h4 className="text-[18px] font-extrabold text-[#0b0b0c] tracking-tight">System Toolbox</h4>
          <p className="mt-1.5 text-[14px] text-[#4a4a68] font-medium leading-relaxed">Preview icons, assign categories, and manage redirection protocols.</p>
        </div>
        <button 
          onClick={() => addTool(activeCategory === "all" ? undefined : activeCategory)}
          className="flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-[#0020d7] text-white text-[11px] font-extrabold uppercase tracking-widest hover:bg-[#0020d7]/90 transition-all active:scale-95 shadow-xl shadow-[#0020d7]/20"
        >
          <Plus size={14} strokeWidth={3} />
          Add Tool
        </button>
      </div>

      <div className="flex flex-wrap gap-2.5 mb-10">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`rounded-full px-6 py-2 text-[11px] font-extrabold uppercase tracking-widest transition-all ${activeCategory === "all" ? "bg-[#0b0b0c] text-white shadow-xl shadow-black/20" : "bg-white border-2 border-[#e4e4e7] text-[#4a4a68] hover:bg-[#e4e4e7]"}`}
        >
          All <span className="ml-2 opacity-40">{tools.length}</span>
        </button>
        {categories.map((category) => {
          const count = tools.filter((tool) => tool.category === category.id).length;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-full px-6 py-2 text-[11px] font-extrabold uppercase tracking-widest transition-all ${activeCategory === category.id ? "bg-[#0b0b0c] text-white shadow-xl shadow-black/20" : "bg-white border-2 border-[#e4e4e7] text-[#4a4a68] hover:bg-[#e4e4e7]"}`}
            >
              {category.name} <span className="ml-2 opacity-40">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {visibleTools.map((tool) => (
          <div key={tool.id} className="rounded-[33px] border-2 border-[#e4e4e7] bg-white p-8 shadow-sm hover:shadow-2xl hover:border-[#0020d7]/20 transition-all group relative overflow-hidden">
            <div className="flex items-start gap-6 relative z-10">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[24px] bg-[#f7f4ef] border border-[#e4e4e7] p-4 shadow-inner ring-4 ring-transparent group-hover:ring-[#0020d7]/5 transition-all">
                {tool.icon ? (
                  <img src={tool.icon} alt="" className="h-full w-full object-contain" />
                ) : (
                  <ImageIcon className="size-10 text-[#4a4a68] opacity-20" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <input
                    value={tool.name}
                    onChange={(event) => updateTool(tool.id, { name: event.target.value })}
                    placeholder="Tool name"
                    className="min-w-[160px] flex-1 border-0 border-b-2 border-[#f7f4ef] bg-transparent px-0 py-1 text-[18px] font-extrabold text-[#0b0b0c] outline-none focus:border-[#0020d7] transition-all"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setExpandedToolId(expandedToolId === tool.id ? null : tool.id)}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest transition-all ${expandedToolId === tool.id ? "bg-[#0020d7] text-white shadow-lg shadow-[#0020d7]/20" : "bg-[#f7f4ef] text-[#4a4a68] hover:bg-[#e4e4e7]"}`}
                    >
                      {expandedToolId === tool.id ? "Done" : "Details"}
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">
                  <div className="space-y-1">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#4a4a68] opacity-60 ml-1">Classification</p>
                    <select 
                      value={tool.category} 
                      onChange={(e) => updateTool(tool.id, { category: e.target.value })}
                      className="w-full bg-[#f7f4ef] border-2 border-[#e4e4e7] rounded-full px-5 py-2 text-[12px] font-bold text-[#0b0b0c] outline-none focus:border-[#0020d7] appearance-none"
                    >
                      {categoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                  <label className="flex items-end">
                    <span className="sr-only">Upload icon</span>
                    <span className="inline-flex cursor-pointer items-center rounded-full border-2 border-[#e4e4e7] bg-white px-5 py-2 text-[10px] font-extrabold uppercase tracking-widest text-[#4a4a68] hover:bg-[#0b0b0c] hover:text-white transition-all shadow-sm">
                      <Upload className="mr-2 size-3.5" strokeWidth={2.5} />
                      Asset Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          void onUpload(file, (url) => updateTool(tool.id, { icon: url }));
                        }}
                      />
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t-2 border-[#f7f4ef]">
              <p className="mb-3 text-[10px] font-extrabold uppercase tracking-widest text-[#4a4a68] opacity-60 ml-1">Icon Intelligence</p>
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
                {toolIconPresets.map((preset) => (
                  <button
                    key={`${tool.id}-${preset.name}`}
                    type="button"
                    title={preset.name}
                    onClick={() => updateTool(tool.id, { icon: preset.icon })}
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] border-2 bg-white p-2.5 transition-all active:scale-90 ${tool.icon === preset.icon ? "border-[#0020d7] bg-[#0020d7]/5 shadow-xl shadow-[#0020d7]/10" : "border-[#f7f4ef] hover:border-[#0020d7]/20"}`}
                  >
                    <img src={preset.icon} alt={preset.name} className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            {expandedToolId === tool.id ? (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 grid grid-cols-1 gap-6 rounded-[24px] bg-[#f7f4ef]/50 p-6 border-2 border-[#e4e4e7]"
              >
                <Field label="Custom icon URL" value={tool.icon} onChange={(value) => updateTool(tool.id, { icon: value })} />
                <Field label="Redirect URL" value={tool.url || ""} onChange={(value) => updateTool(tool.id, { url: value })} />
                <TextareaField label="Description" value={tool.description} onChange={(value) => updateTool(tool.id, { description: value })} className="md:col-span-2" rows={3} />
              </motion.div>
            ) : null}

            <div className="mt-6 flex justify-between items-center">
              <div className="flex items-center gap-2">
                {tool.url && <div className="px-3 py-1 rounded-full bg-[#34c759]/10 text-[#34c759] text-[9px] font-extrabold uppercase tracking-widest border border-[#34c759]/20">Linked</div>}
              </div>
              <button 
                type="button" 
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[#ff3b30] text-[10px] font-extrabold uppercase tracking-widest hover:bg-[#ff3b30]/10 transition-all" 
                onClick={() => removeTool(tool.id)}
              >
                <Trash2 size={12} strokeWidth={2.5} />
                Detach
              </button>
            </div>
            
            {/* Hover decoration */}
            <div className="absolute -top-10 -right-10 h-24 w-24 bg-[#0020d7] rounded-full blur-[60px] opacity-0 group-hover:opacity-[0.03] transition-opacity" />
          </div>
        ))}
        {visibleTools.length === 0 ? (
          <div className="lg:col-span-2 rounded-[33px] border-4 border-dashed border-[#e4e4e7] bg-white p-16 text-center">
            <div className="h-20 w-20 rounded-[28px] bg-[#f7f4ef] flex items-center justify-center mx-auto mb-6">
              <Package className="size-10 text-[#4a4a68] opacity-30" />
            </div>
            <p className="text-[16px] font-extrabold text-[#0b0b0c] tracking-tight">Empty Classification Repository</p>
            <p className="text-[13px] text-[#4a4a68] mt-2 mb-8 font-medium">Add tools to populate this system module.</p>
            <button 
              onClick={() => addTool(activeCategory === "all" ? undefined : activeCategory)}
              className="px-8 py-3 rounded-full bg-[#0b0b0c] text-white text-[11px] font-extrabold uppercase tracking-widest hover:bg-[#0020d7] transition-all shadow-xl shadow-black/20"
            >
              Add First Tool
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

const toolIconPresets = [
  { name: "VS Code", icon: "https://skillicons.dev/icons?i=vscode" },
  { name: "Figma", icon: "https://skillicons.dev/icons?i=figma" },
  { name: "React", icon: "https://skillicons.dev/icons?i=react" },
  { name: "Next.js", icon: "https://skillicons.dev/icons?i=nextjs" },
  { name: "TypeScript", icon: "https://skillicons.dev/icons?i=ts" },
  { name: "Tailwind", icon: "https://skillicons.dev/icons?i=tailwind" },
  { name: "Node.js", icon: "https://skillicons.dev/icons?i=nodejs" },
  { name: "Supabase", icon: "https://skillicons.dev/icons?i=supabase" },
  { name: "PostgreSQL", icon: "https://skillicons.dev/icons?i=postgres" },
  { name: "Adobe Illustrator", icon: "https://skillicons.dev/icons?i=ai" },
  { name: "Adobe Photoshop", icon: "https://skillicons.dev/icons?i=ps" },
];




