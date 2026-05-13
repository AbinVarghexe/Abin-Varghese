"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminSectionWorkspace, { 
  SectionTitle, 
  Field, 
  TextareaField, 
  SectionPanel, 
  ActionButton,
} from "@/components/admin/AdminSectionWorkspace";
import { 
  Layers, 
  Package, 
  Plus, 
  Trash2, 
  Palette, 
  Type, 
  AlignLeft, 
  List, 
  Video, 
  Code, 
  ImageIcon,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Unlink,
  FolderKanban,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin } from "@/components/admin/AdminContext";
import type { Service, ServiceContent } from "@/constants/services";
import type { BehanceShowcaseEmbed } from "@/lib/site-content";
import {
  mapPortfolioProjectToServiceShowcase,
  mapBehanceShowcaseEmbedToServiceContent,
  SERVICE_LINK_BEHANCE_PREFIX,
  isBehanceShowcaseServiceLink,
  parseBehanceShowcaseLinkId,
  type AdminProjectForShowcase,
} from "@/lib/map-portfolio-project-to-service-showcase";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PORTFOLIO_SELECT_NONE = "__portfolio_none__";

const defaultProjectContent: ServiceContent = {
  type: "project",
  title: "New showcase project",
  description: "",
  projectLinks: [],
  techStack: [],
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [portfolioProjects, setPortfolioProjects] = useState<AdminProjectForShowcase[]>([]);
  const [behanceShowcaseEmbeds, setBehanceShowcaseEmbeds] = useState<BehanceShowcaseEmbed[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number>(0);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { setSaveAction, setIsSaving, setStatusText } = useAdmin();

  const saveServices = useCallback(async () => {
    setSaving(true);
    const toastId = toast.loading("Synchronizing service portfolio...");
    try {
      const response = await fetch("/api/admin/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services }),
      });
      if (!response.ok) throw new Error("Save failed");
      toast.success("Portfolio synchronized successfully.", { id: toastId });
    } catch {
      toast.error("Portfolio synchronization failed.", { id: toastId });
    } finally {
      setSaving(false);
    }
  }, [services]);

  useEffect(() => {
    setSaveAction(saveServices);
    setStatusText(saving ? "Syncing..." : "System Standby");
    setIsSaving(saving);
    
    return () => {
      setSaveAction(null);
    };
  }, [saveServices, saving, setSaveAction, setIsSaving, setStatusText]);

  useEffect(() => {
    async function loadLinkSources() {
      const [projectsRes, siteRes] = await Promise.all([
        fetch("/api/admin/projects", { cache: "no-store" }),
        fetch("/api/admin/site-content", { cache: "no-store" }),
      ]);
      if (projectsRes.ok) {
        const data = await projectsRes.json();
        setPortfolioProjects(data.projects || []);
      }
      if (siteRes.ok) {
        const data = await siteRes.json();
        setBehanceShowcaseEmbeds(Array.isArray(data.behanceShowcase) ? data.behanceShowcase : []);
      }
    }
    void loadLinkSources();
  }, []);

  useEffect(() => {
    async function loadServices() {
      const response = await fetch("/api/admin/services", { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      const loadedServices: Service[] = data.services || [];
      setServices(loadedServices);
      if (loadedServices[0]) setSelectedServiceId(loadedServices[0].id);
    }
    void loadServices();
  }, []);

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId) || null,
    [services, selectedServiceId]
  );

  const projectItems = useMemo(
    () => (selectedService?.contents || [])
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.type === "project"),
    [selectedService]
  );

  const selectedProject = projectItems[selectedProjectIndex]?.item;

  const linkedSelectValue = useMemo(() => {
    const linkedId = selectedProject?.linkedProjectId;
    if (!linkedId) {
      return PORTFOLIO_SELECT_NONE;
    }
    if (isBehanceShowcaseServiceLink(linkedId)) {
      const embedId = parseBehanceShowcaseLinkId(linkedId);
      return embedId && behanceShowcaseEmbeds.some((e) => e.id === embedId)
        ? linkedId
        : PORTFOLIO_SELECT_NONE;
    }
    return portfolioProjects.some((p) => p.id === linkedId) ? linkedId : PORTFOLIO_SELECT_NONE;
  }, [selectedProject?.linkedProjectId, portfolioProjects, behanceShowcaseEmbeds]);

  const linkedSourceMissing = useMemo(() => {
    const linkedId = selectedProject?.linkedProjectId;
    if (!linkedId) {
      return false;
    }
    if (isBehanceShowcaseServiceLink(linkedId)) {
      const embedId = parseBehanceShowcaseLinkId(linkedId);
      return Boolean(embedId && !behanceShowcaseEmbeds.some((e) => e.id === embedId));
    }
    return !portfolioProjects.some((p) => p.id === linkedId);
  }, [selectedProject?.linkedProjectId, portfolioProjects, behanceShowcaseEmbeds]);

  const sortedPortfolioProjects = useMemo(
    () =>
      [...portfolioProjects].sort((a, b) =>
        (a.title || "").localeCompare(b.title || "", undefined, { sensitivity: "base" })
      ),
    [portfolioProjects]
  );

  const sortedBehanceEmbeds = useMemo(
    () =>
      [...behanceShowcaseEmbeds].sort((a, b) =>
        (a.title || "").localeCompare(b.title || "", undefined, { sensitivity: "base" })
      ),
    [behanceShowcaseEmbeds]
  );

  function updateSelectedService(patch: Partial<Service>) {
    if (!selectedService) return;
    setServices((current) => current.map((s) => s.id === selectedService.id ? { ...s, ...patch } : s));
  }

  function updateSelectedProject(patch: Partial<ServiceContent>) {
    if (!selectedService || !selectedProject) return;
    const targetIndex = projectItems[selectedProjectIndex]?.index;
    if (targetIndex === undefined) return;

    setServices((current) => current.map((s) => {
      if (s.id !== selectedService.id) return s;
      const nextContents = [...(s.contents || [])];
      nextContents[targetIndex] = { ...nextContents[targetIndex], ...patch };
      return { ...s, contents: nextContents };
    }));
  }

  function applyLinkedPortfolioProject(projectId: string) {
    const p = portfolioProjects.find((x) => x.id === projectId);
    if (!p) return;
    updateSelectedProject(mapPortfolioProjectToServiceShowcase(p));
  }

  function applyLinkedSource(rawId: string) {
    if (rawId.startsWith(SERVICE_LINK_BEHANCE_PREFIX)) {
      const embedId = rawId.slice(SERVICE_LINK_BEHANCE_PREFIX.length);
      const embed = behanceShowcaseEmbeds.find((e) => e.id === embedId);
      if (embed) {
        updateSelectedProject(mapBehanceShowcaseEmbedToServiceContent(embed));
      }
      return;
    }
    applyLinkedPortfolioProject(rawId);
  }

  async function syncSelectedShowcaseFromPortfolio() {
    const id = selectedProject?.linkedProjectId;
    if (!id) return;

    if (isBehanceShowcaseServiceLink(id)) {
      const res = await fetch("/api/admin/site-content", { cache: "no-store" });
      if (!res.ok) {
        toast.error("Could not reload Behance showcase data.");
        return;
      }
      const data = await res.json();
      const list: BehanceShowcaseEmbed[] = Array.isArray(data.behanceShowcase)
        ? data.behanceShowcase
        : [];
      setBehanceShowcaseEmbeds(list);
      const embedId = parseBehanceShowcaseLinkId(id);
      const embed = embedId ? list.find((e) => e.id === embedId) : undefined;
      if (embed) {
        updateSelectedProject(mapBehanceShowcaseEmbedToServiceContent(embed));
        toast.success("Showcase synced from Behance embed.");
      } else {
        toast.error("That Behance embed is no longer in the list.");
      }
      return;
    }

    applyLinkedPortfolioProject(id);
    toast.success("Showcase refreshed from Projects.");
  }

  function unlinkSelectedShowcase() {
    updateSelectedProject({ linkedProjectId: undefined });
  }

  function addProjectShowcase() {
    if (!selectedService) return;
    setServices((current) => current.map((s) => {
      if (s.id !== selectedService.id) return s;
      return { ...s, contents: [...(s.contents || []), defaultProjectContent] };
    }));
    setSelectedProjectIndex(projectItems.length);
  }

  function removeProjectShowcase(indexInFiltered: number) {
    if (!selectedService) return;
    const targetIndex = projectItems[indexInFiltered]?.index;
    if (targetIndex === undefined) return;

    setServices((current) => current.map((s) => {
      if (s.id !== selectedService.id) return s;
      const nextContents = [...(s.contents || [])];
      nextContents.splice(targetIndex, 1);
      return { ...s, contents: nextContents };
    }));
    setSelectedProjectIndex(0);
  }

  if (!selectedService) {
    return (
      <div className="flex items-center justify-center min-h-[500px] bg-[#f7f4ef]/50 rounded-[33px] border-[5px] border-[#e4e4e7]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="h-16 w-16 border-4 border-[#0020d7]/10 border-t-[#0020d7] rounded-full animate-spin" />
            <Layers className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#0020d7]" size={24} />
          </div>
          <p className="text-[14px] font-extrabold text-[#0b0b0c] uppercase tracking-[0.25em]">Initializing Workspace</p>
        </div>
      </div>
    );
  }

  return (
    <AdminSectionWorkspace
      sectionLabel="Service Architecture"
      sectionTitle="Service Portfolio Manager"
      sectionDescription="Refine your professional offerings. Manage detailed service descriptions and showcase project deep-dives."
      icon={Layers}
      iconColor="#0020d7"
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
        
        {/* Navigation Sidebar */}
        <aside className="xl:col-span-3 space-y-8">
          <SectionPanel className="p-5 bg-white shadow-xl shadow-black/5">
            <h3 className="px-4 py-3 text-[11px] font-extrabold text-[#4a4a68] uppercase tracking-[0.2em] mb-3">Professional Segments</h3>
            <div className="space-y-2">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => { setSelectedServiceId(service.id); setSelectedProjectIndex(0); }}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-[18px] text-[13px] font-bold transition-all active:scale-[0.98] ${
                    selectedServiceId === service.id 
                      ? "bg-[#0b0b0c] text-white shadow-xl shadow-black/20" 
                      : "bg-[#f7f4ef] text-[#4a4a68] hover:bg-[#e4e4e7] hover:text-[#0b0b0c]"
                  }`}
                >
                  <span className="truncate">{service.title}</span>
                  <ChevronRight size={14} className={selectedServiceId === service.id ? "opacity-100" : "opacity-0"} />
                </button>
              ))}
            </div>
          </SectionPanel>

          <SectionPanel className="p-8 bg-[#f7f4ef] border-dashed border-[#e4e4e7]">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Sparkles className="text-[#0020d7]" size={24} />
              </div>
              <div>
                <p className="text-[14px] font-extrabold text-[#0b0b0c] tracking-tight">Portfolio Intelligence</p>
                <p className="text-[12px] text-[#4a4a68] mt-1.5 leading-relaxed font-medium">Each category houses specialized project deep-dives to demonstrate high-fidelity expertise.</p>
              </div>
            </div>
          </SectionPanel>
        </aside>

        {/* Main Content Area */}
        <main className="xl:col-span-9 space-y-10 pb-32">
          
          {/* Primary Details Panel */}
          <SectionPanel className="flex flex-col gap-10 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <SectionTitle title="Segment Identity" copy="Core visual and descriptive properties." icon={Type} />
              <div 
                className="h-10 w-10 rounded-[14px] border-2 border-white shadow-lg ring-4 ring-[#f7f4ef]" 
                style={{ backgroundColor: selectedService.accentColor }} 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6">
                <Field
                  label="Primary Designation"
                  value={selectedService.title}
                  onChange={(v) => updateSelectedService({ title: v })}
                  icon={Type}
                />
              </div>
              <div className="lg:col-span-6">
                <Field
                  label="Brand Accent Color"
                  value={selectedService.accentColor}
                  onChange={(v) => updateSelectedService({ accentColor: v })}
                  icon={Palette}
                />
              </div>
              <div className="lg:col-span-12">
                <TextareaField
                  label="Elevator Pitch"
                  value={selectedService.description}
                  onChange={(v) => updateSelectedService({ description: v })}
                  rows={2}
                  icon={AlignLeft}
                />
              </div>
              <div className="lg:col-span-12">
                <TextareaField
                  label="Detailed Narrative"
                  value={selectedService.detailedDescription}
                  onChange={(v) => updateSelectedService({ detailedDescription: v })}
                  rows={4}
                  icon={AlignLeft}
                />
              </div>
              <div className="lg:col-span-12">
                <TextareaField
                  label="Deliverables (Line-separated list)"
                  value={selectedService.providedServices.join("\n")}
                  onChange={(v) => updateSelectedService({
                    providedServices: v.split("\n").map(s => s.trim()).filter(Boolean)
                  })}
                  rows={6}
                  icon={List}
                />
              </div>
            </div>
          </SectionPanel>

          {/* Showcase Projects Panel */}
          <SectionPanel className="flex flex-col gap-10 bg-white/50 backdrop-blur-sm">
            <SectionTitle
              title="Project Showcases"
              copy="Link rows to items from Admin → Projects, or edit fields manually when not linked."
              icon={Package}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Project Tab List */}
              <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 content-start">
                <AnimatePresence mode="popLayout">
                  {projectItems.map(({ item }, idx) => (
                    <motion.div key={idx} layout className="group relative">
                      <button
                        onClick={() => setSelectedProjectIndex(idx)}
                        className={`w-full flex items-center justify-between px-5 py-4 rounded-[20px] text-[12px] font-extrabold transition-all border-2 active:scale-[0.98] h-full ${
                          selectedProjectIndex === idx 
                            ? "bg-[#0020d7]/5 border-[#0020d7]/30 text-[#0020d7] shadow-sm" 
                            : "bg-white border-[#e4e4e7] text-[#4a4a68] hover:border-[#0020d7]/20 hover:text-[#0b0b0c]"
                        }`}
                      >
                        <span className="truncate">{item.title || `Asset ${idx + 1}`}</span>
                        <div className={`h-2 w-2 rounded-full transition-all ${selectedProjectIndex === idx ? "bg-[#0020d7] scale-125 shadow-[0_0_8px_rgba(0,32,215,0.4)]" : "bg-[#e4e4e7]"}`} />
                      </button>
                      <button
                        onClick={() => removeProjectShowcase(idx)}
                        className="absolute -right-2 -top-2 h-7 w-7 flex items-center justify-center rounded-full bg-[#ff3b30] text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-xl shadow-[#ff3b30]/20 z-10"
                      >
                        <Trash2 size={12} strokeWidth={2.5} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* Visual Add Card */}
                <button 
                  onClick={addProjectShowcase}
                  className="flex flex-col items-center justify-center p-6 rounded-[20px] border-[3px] border-dashed border-[#e4e4e7] bg-white/50 hover:bg-white hover:border-[#0020d7]/30 transition-all gap-3 group min-h-[68px]"
                >
                  <div className="h-7 w-7 rounded-full bg-[#f7f4ef] flex items-center justify-center text-[#4a4a68] group-hover:bg-[#0020d7] group-hover:text-white transition-all">
                    <Plus size={16} strokeWidth={3} />
                  </div>
                  <span className="text-[10px] font-extrabold text-[#4a4a68] uppercase tracking-widest group-hover:text-[#0b0b0c]">Add showcase</span>
                </button>

                {projectItems.length === 0 && (
                  <div className="p-10 rounded-[28px] border-4 border-dashed border-[#e4e4e7] text-center bg-white/50 hidden">
                    <p className="text-[12px] font-extrabold text-[#4a4a68] uppercase tracking-widest opacity-40 italic">Empty Showcase Repository</p>
                  </div>
                )}
              </div>

              {/* Project Editor Area */}
              <div className="lg:col-span-8">
                {selectedProject ? (
                  <motion.div 
                    key={selectedProjectIndex}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="p-8 rounded-[33px] bg-[#f7f4ef]/40 border-2 border-[#e4e4e7] space-y-8"
                  >
                    <div className="rounded-[24px] border-2 border-[#e4e4e7] bg-white p-6 shadow-sm">
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
                        <div className="w-full min-w-[min(100%,22rem)] flex-1 space-y-2.5 lg:min-w-[min(100%,28rem)]">
                          <span className="text-[13px] font-bold tracking-tight text-[#4a4a68] ml-1 flex items-center gap-2">
                            <FolderKanban size={14} className="shrink-0 text-[#0020d7]" strokeWidth={2} />
                            Link source
                          </span>
                          <p className="text-[12px] leading-relaxed text-[#4a4a68] ml-1 -mt-1 font-medium">
                            Choose a row from Admin → Projects, or a Behance embed from Admin → Projects → Graphic Design → Behance. Leave unlinked to edit this showcase manually.
                          </p>
                          <Select
                            value={linkedSelectValue}
                            onValueChange={(id) => {
                              if (id === PORTFOLIO_SELECT_NONE) {
                                unlinkSelectedShowcase();
                                return;
                              }
                              applyLinkedSource(id);
                            }}
                          >
                            <SelectTrigger
                              className="h-auto min-h-[52px] w-full max-w-none min-w-[min(100%,20rem)] rounded-[18px] border-2 border-[#e4e4e7] bg-white px-5 py-3.5 text-left text-[14px] font-medium text-[#0b0b0c] shadow-sm transition-all hover:border-[#0020d7]/35 focus:border-[#0020d7] focus:ring-4 focus:ring-[#0020d7]/8 focus:outline-none data-[placeholder]:text-[#c1c1c1] [&>svg]:text-[#4a4a68]"
                              aria-label="Choose portfolio project or Behance embed"
                            >
                              <SelectValue placeholder="Choose a project or Behance embed…" />
                            </SelectTrigger>
                            <SelectContent
                              position="popper"
                              sideOffset={6}
                              className="z-[100] max-h-[min(380px,var(--radix-select-content-available-height))] w-[max(var(--radix-select-trigger-width),min(100%,28rem))] max-w-[min(96vw,44rem)] rounded-[18px] border-2 border-[#e4e4e7] bg-white p-1.5 shadow-xl"
                            >
                              <SelectItem
                                value={PORTFOLIO_SELECT_NONE}
                                className="cursor-pointer rounded-xl py-3 pr-8 text-[13px] font-medium text-[#4a4a68] focus:bg-[#f7f4ef] focus:text-[#0b0b0c]"
                              >
                                Not linked — manual showcase fields
                              </SelectItem>
                              {sortedBehanceEmbeds.length + sortedPortfolioProjects.length > 0 ? (
                                <SelectSeparator className="my-1 bg-[#e4e4e7]" />
                              ) : null}
                              {sortedBehanceEmbeds.length > 0 ? (
                                <SelectGroup>
                                  <SelectLabel className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#4a4a68]">
                                    Behance showcase embeds
                                  </SelectLabel>
                                  {sortedBehanceEmbeds.map((embed) => (
                                    <SelectItem
                                      key={embed.id}
                                      value={`${SERVICE_LINK_BEHANCE_PREFIX}${embed.id}`}
                                      className="cursor-pointer rounded-xl py-3 pr-8 text-[13px] font-medium focus:bg-[#0020d7]/8 focus:text-[#0b0b0c]"
                                    >
                                      <span className="line-clamp-2 text-left">
                                        {embed.title?.trim() || "Untitled"}{" "}
                                        <span className="text-[11px] font-semibold text-[#4a4a68]">
                                          · Behance
                                        </span>
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              ) : null}
                              {sortedBehanceEmbeds.length > 0 && sortedPortfolioProjects.length > 0 ? (
                                <SelectSeparator className="my-1 bg-[#e4e4e7]" />
                              ) : null}
                              {sortedPortfolioProjects.length > 0 ? (
                                <SelectGroup>
                                  <SelectLabel className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#4a4a68]">
                                    Portfolio projects (database)
                                  </SelectLabel>
                                  {sortedPortfolioProjects.map((p) => {
                                    const meta = [
                                      p.workspace,
                                      p.category,
                                      p.type === "BEHANCE" ? "Behance-type project" : null,
                                    ]
                                      .filter(Boolean)
                                      .join(" · ");
                                    return (
                                      <SelectItem
                                        key={p.id}
                                        value={p.id}
                                        className="cursor-pointer rounded-xl py-3 pr-8 text-[13px] font-medium focus:bg-[#0020d7]/8 focus:text-[#0b0b0c]"
                                      >
                                        <span className="line-clamp-2 text-left">
                                          {meta ? `${p.title} (${meta})` : p.title}
                                        </span>
                                      </SelectItem>
                                    );
                                  })}
                                </SelectGroup>
                              ) : null}
                            </SelectContent>
                          </Select>
                          {selectedProject.linkedProjectId && linkedSourceMissing ? (
                            <p className="rounded-[14px] border border-amber-200 bg-amber-50 px-4 py-2.5 text-[12px] font-medium leading-relaxed text-amber-900">
                              This link no longer matches Projects or Behance embeds. Pick an item again or clear the link.
                            </p>
                          ) : null}
                        </div>
                        <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col lg:pt-8">
                          <button
                            type="button"
                            disabled={!selectedProject.linkedProjectId}
                            onClick={syncSelectedShowcaseFromPortfolio}
                            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#0020d7]/25 bg-[#0020d7]/5 px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider text-[#0020d7] transition-all hover:bg-[#0020d7]/10 disabled:cursor-not-allowed disabled:opacity-45 active:scale-[0.98]"
                          >
                            <RefreshCw size={15} strokeWidth={2} className="shrink-0" />
                            Sync from source
                          </button>
                          <button
                            type="button"
                            disabled={!selectedProject.linkedProjectId}
                            onClick={() => unlinkSelectedShowcase()}
                            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#e4e4e7] bg-white px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider text-[#4a4a68] transition-all hover:bg-[#f7f4ef] disabled:cursor-not-allowed disabled:opacity-45 active:scale-[0.98]"
                          >
                            <Unlink size={15} strokeWidth={2} className="shrink-0" />
                            Clear link
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="md:col-span-2">
                        <Field
                          label="Showcase Heading"
                          value={selectedProject.title}
                          onChange={(v) => updateSelectedProject({ title: v })}
                          icon={Type}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <TextareaField
                          label="Showcase Brief"
                          value={selectedProject.description}
                          onChange={(v) => updateSelectedProject({ description: v })}
                          rows={3}
                          icon={AlignLeft}
                        />
                      </div>
                      <Field
                        label="Mockup Asset URL"
                        value={selectedProject.mockupImage || ""}
                        onChange={(v) => updateSelectedProject({ mockupImage: v })}
                        icon={ImageIcon}
                      />
                      <Field
                        label="Motion Preview URL"
                        value={selectedProject.videoUrl || ""}
                        onChange={(v) => updateSelectedProject({ videoUrl: v })}
                        icon={Video}
                      />
                      <div className="md:col-span-2">
                        <Field
                          label="Tech Ecosystem (Comma separated)"
                          value={(selectedProject.techStack || []).join(", ")}
                          onChange={(v) => updateSelectedProject({
                            techStack: v.split(",").map(t => t.trim()).filter(Boolean)
                          })}
                          icon={Code}
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full min-h-[300px] flex items-center justify-center p-12 rounded-[33px] bg-[#f7f4ef] border-4 border-dashed border-[#e4e4e7]">
                    <p className="text-[14px] font-extrabold text-[#4a4a68] uppercase tracking-[0.2em] opacity-40">Select segment to refine</p>
                  </div>
                )}
              </div>
            </div>
          </SectionPanel>

        </main>
      </div>
    </AdminSectionWorkspace>
  );
}
