"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import AdminSectionWorkspace, { 
  SectionTitle, 
  Field, 
  TextareaField, 
  SectionPanel, 
  TinyButton, 
  ActionButton,
  SelectField
} from "@/components/admin/AdminSectionWorkspace";
import { 
  Save, 
  Layers, 
  Package, 
  Plus, 
  Trash2, 
  Palette, 
  Type, 
  AlignLeft, 
  List, 
  Monitor, 
  Smartphone, 
  Video, 
  Code, 
  ImageIcon,
  Sparkles,
  ChevronRight,
  Layout,
  ExternalLink,
  Loader2,
  RefreshCw,
  Globe
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin } from "@/components/admin/AdminContext";
import type { Service, ServiceContent } from "@/constants/services";

const defaultProjectContent: ServiceContent = {
  type: "project",
  title: "New showcase project",
  description: "",
  projectLinks: [],
  techStack: [],
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number>(0);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { setSaveAction, setIsSaving, setStatusText } = useAdmin();
  const saveActionRef = useRef<(() => Promise<void>) | null>(null);

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
    saveActionRef.current = saveServices;
  }, [saveServices]);

  useEffect(() => {
    const stableSave = async () => {
      if (saveActionRef.current) {
        await saveActionRef.current();
      }
    };
    
    setSaveAction(() => stableSave);
    setStatusText(saving ? "Syncing..." : "System Standby");
    setIsSaving(saving);
    
    return () => {
      setSaveAction(null);
    };
  }, [saving, setSaveAction, setIsSaving, setStatusText]);

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

  const [refreshingProjects, setRefreshingProjects] = useState(false);

  const loadAllProjects = useCallback(async () => {
    setRefreshingProjects(true);
    try {
      // 1. Fetch standard projects
      const projResponse = await fetch("/api/admin/projects", { cache: "no-store" });
      let projectsList = [];
      if (projResponse.ok) {
        const data = await projResponse.json();
        projectsList = data.projects || [];
      }

      // 2. Fetch showcase items (Behance/Pinterest)
      const contentResponse = await fetch("/api/admin/site-content", { cache: "no-store" });
      if (contentResponse.ok) {
        const data = await contentResponse.json();
        
        // Convert Behance embeds to Project shape
        const behanceProjects = (data.behanceShowcase || []).map((item: any) => ({
          id: item.id,
          title: item.title || "Untitled Behance Project",
          type: "BEHANCE",
          mediaType: "IMAGE",
          mediaUrl: "", // Showcases usually have iframeUrls
          externalUrl: item.src, // Use the src as the link
          tags: ["Behance", "Showcase"],
          workspace: "designing",
          isShowcaseItem: true
        }));

        // Convert Pinterest items to Project shape
        const pinterestProjects = (data.pinterestShowcase || []).map((item: any) => ({
          id: item.id,
          title: item.title || "Untitled Pinterest Project",
          type: "PINTEREST",
          mediaType: "IMAGE",
          mediaUrl: item.src,
          externalUrl: item.src,
          tags: ["Pinterest", "Showcase"],
          workspace: "designing",
          isShowcaseItem: true
        }));

        setAllProjects([...projectsList, ...behanceProjects, ...pinterestProjects]);
      } else {
        setAllProjects(projectsList);
      }
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setRefreshingProjects(false);
    }
  }, []);

  useEffect(() => {
    void loadAllProjects();
  }, [loadAllProjects]);

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
              <div className="lg:col-span-6">
                <Field
                  label="Projects Redirect URL (e.g., /projects#graphics)"
                  value={selectedService.projectsUrl || ""}
                  onChange={(v) => updateSelectedService({ projectsUrl: v })}
                  icon={Globe}
                />
              </div>
              <div className="lg:col-span-6">
                <Field
                  label="Redirect Button Label (e.g., View More)"
                  value={selectedService.projectsLabel || ""}
                  onChange={(v) => updateSelectedService({ projectsLabel: v })}
                  icon={Type}
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
            <SectionTitle title="Project Showcases" copy="Curate high-fidelity deep-dive cards." icon={Package} />

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
                  <span className="text-[10px] font-extrabold text-[#4a4a68] uppercase tracking-widest group-hover:text-[#0b0b0c]">Add Showcase</span>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="md:col-span-2">
                        <div className="flex flex-col gap-6 p-6 rounded-[24px] bg-white border-2 border-[#0020d7]/10 mb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-[#0020d7]/5 flex items-center justify-center text-[#0020d7]">
                                <Package size={18} />
                              </div>
                              <h4 className="text-[13px] font-extrabold text-[#0b0b0c] uppercase tracking-wider">Project Linkage</h4>
                            </div>
                            <button 
                              onClick={() => loadAllProjects()}
                              className={`p-2 rounded-full hover:bg-zinc-100 transition-colors ${refreshingProjects ? 'animate-spin' : ''}`}
                              title="Refresh projects list"
                            >
                              <RefreshCw size={14} className="text-zinc-400" />
                            </button>
                          </div>
                          
                          <AdminSectionWorkspace.SelectField
                            label="Synchronize with Existing Project"
                            value={selectedProject.projectId || ""}
                            options={[
                              { label: "None (Internal Showcase Only)", value: "" },
                              ...allProjects.map(p => ({ label: `[${p.type}] ${p.title}`, value: p.id }))
                            ]}
                            onChange={(v) => {
                              const project = allProjects.find(p => p.id === v);
                              if (project) {
                                // Intelligent mapping based on project type/category
                                const isVideo = project.category?.toLowerCase().includes("motion") || 
                                              project.category?.toLowerCase().includes("vfx") || 
                                              project.mediaType === "VIDEO";
                                
                                const links = [];
                                if (project.externalUrl) {
                                  let icon: any = "ExternalLink";
                                  if (project.externalUrl.includes("github.com")) icon = "Github";
                                  else if (project.externalUrl.includes("figma.com")) icon = "Figma";
                                  else if (project.externalUrl.includes("behance.net")) icon = "ExternalLink";
                                  
                                  links.push({ 
                                    label: isVideo ? "Watch Reel" : project.externalUrl.includes("behance.net") ? "View on Behance" : "View Project", 
                                    url: project.externalUrl, 
                                    icon 
                                  });
                                }

                                updateSelectedProject({
                                  projectId: project.id,
                                  projectSlug: project.slug,
                                  title: project.title,
                                  description: project.description,
                                  mockupImage: project.mediaUrl || (project.type === 'BEHANCE' ? "" : ""),
                                  videoUrl: isVideo ? project.externalUrl || "" : "",
                                  iframeUrl: project.isShowcaseItem || project.type === 'BEHANCE' ? project.externalUrl : "",
                                  techStack: project.tags || [],
                                  projectLinks: links,
                                });
                                toast.success(`Deep-synced with "${project.title}"`);
                              } else {
                                updateSelectedProject({ projectId: "", projectSlug: "", iframeUrl: "" });
                              }
                            }}
                          />
                          
                          {selectedProject.projectId && (
                            <div className="flex items-center gap-2">
                              <TinyButton 
                                onClick={() => {
                                  const project = allProjects.find(p => p.id === selectedProject.projectId);
                                  if (project) {
                                    const isVideo = project.category?.toLowerCase().includes("motion") || 
                                                  project.category?.toLowerCase().includes("vfx") || 
                                                  project.mediaType === "VIDEO";
                                    
                                    const links = [];
                                    if (project.externalUrl) {
                                      let icon: any = "ExternalLink";
                                      if (project.externalUrl.includes("github.com")) icon = "Github";
                                      else if (project.externalUrl.includes("figma.com")) icon = "Figma";
                                      else if (project.externalUrl.includes("behance.net")) icon = "ExternalLink";
                                      
                                      links.push({ 
                                        label: isVideo ? "Watch Reel" : project.externalUrl.includes("behance.net") ? "View on Behance" : "View Project", 
                                        url: project.externalUrl, 
                                        icon 
                                      });
                                    }

                                    updateSelectedProject({
                                      projectSlug: project.slug,
                                      title: project.title,
                                      description: project.description,
                                      mockupImage: project.mediaUrl || (project.type === 'BEHANCE' ? "" : ""),
                                      videoUrl: isVideo ? project.externalUrl || "" : "",
                                      iframeUrl: project.isShowcaseItem || project.type === 'BEHANCE' ? project.externalUrl : "",
                                      techStack: project.tags || [],
                                      projectLinks: links,
                                    });
                                    toast.success("Full project synchronization complete");
                                  }
                                }}
                                variant="primary"
                                className="w-full justify-center py-3"
                              >
                                <RefreshCw size={12} className="mr-2" /> Full System Sync
                              </TinyButton>
                            </div>
                          )}
                        </div>
                      </div>
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
