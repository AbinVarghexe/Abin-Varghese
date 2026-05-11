"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import AdminSectionWorkspace, { SectionPanel, SectionTitle, Field, TextareaField, SelectField, ActionButton, TinyButton, StatusBadge } from "@/components/admin/AdminSectionWorkspace";
import { uploadToStorage } from "@/lib/supabase";
import { Upload as UploadIcon, X as XIcon, Loader2, Sparkles, Pencil, AlertCircle, FolderKanban, Code, Palette, Github, Link2, ExternalLink, Trash2, Eye, EyeOff, Save, RefreshCw, Plus, FileText, Type, AlignLeft, Globe, Monitor, Box, PlayCircle } from "lucide-react";
import { IconBrandBehance } from "@tabler/icons-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin } from "@/components/admin/AdminContext";
import { cn } from "@/lib/utils";

type Project = {
  id: string;
  title: string;
  description: string;
  content: string | null;
  type: "CODE" | "FIGMA" | "BEHANCE" | "PINTEREST" | "GRAPHIC";
  mediaType: "IMAGE" | "VIDEO" | "GIF" | "MODEL";
  mediaUrl: string;
  externalUrl: string | null;
  iframeUrl: string | null;
  category: string | null;
  tags: string[];
  dominantColor: string | null;
  previewHeight: number | null;
  featured: boolean;
  createdAt: string;
  workspace?: "coding" | "designing";
};

type ProjectForm = {
  title: string;
  description: string;
  content: string;
  type: "CODE" | "FIGMA" | "BEHANCE" | "PINTEREST" | "GRAPHIC";
  mediaType: "IMAGE" | "VIDEO" | "GIF" | "MODEL";
  mediaUrl: string;
  externalUrl: string;
  iframeUrl: string;
  category: string;
  tags: string;
  dominantColor: string;
  previewHeight: string;
  featured: boolean;
};

type GithubRepoAdminItem = {
  full_name: string;
  name: string;
  description: string | null;
  html_url: string;
  stars: number;
  language: string | null;
  updated_at: string;
  enabled: boolean;
  image_url: string | null;
  is_manual: boolean;
  draftImageUrl: string;
  isSaving?: boolean;
};

const defaultForm: ProjectForm = {
  title: "",
  description: "",
  content: "",
  type: "CODE",
  mediaType: "IMAGE",
  mediaUrl: "",
  externalUrl: "",
  iframeUrl: "",
  category: "",
  tags: "",
  dominantColor: "",
  previewHeight: "",
  featured: false,
};

function extractVideoThumbnail(url: string): string | null {
  if (!url) return null;
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (ytMatch?.[1]) {
    return `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
  }
  return null;
}

function formatBehanceLink(input: string): string {
  let url = input.trim();
  
  // 1. If it's an iframe embed code, extract the src
  if (url.includes('<iframe')) {
    const srcMatch = url.match(/src=["']([^"']+)["']/);
    if (srcMatch?.[1]) {
      url = srcMatch[1];
    }
  }

  // 2. Extract project ID from either gallery or embed URL
  // Matches: behance.net/gallery/12345/Title OR behance.net/embed/project/12345
  const projectIdMatch = url.match(/behance\.net\/(?:gallery|embed\/project)\/(\d+)/);
  
  if (projectIdMatch?.[1]) {
    // Return a clean embed URL with optimal parameters for the preview
    return `https://www.behance.net/embed/project/${projectIdMatch[1]}?share=1&antisocial=1&editable=0`;
  }

  return url;
}

type AdminWorkspace = "coding" | "designing";

function createDefaultForm(workspace: AdminWorkspace, category?: string): ProjectForm {
  return {
    ...defaultForm,
    type: workspace === "coding" ? "CODE" : "BEHANCE",
    category: category || "",
  };
}

type ProjectMainTab = "coding" | "designing";
type ProjectSubTab = 
  | "live-website" | "git-integration" // Coding
  | "graphic" | "web" | "motion" | "vfx-3d"; // Designing

const projectMainTabs: Array<{ id: ProjectMainTab; label: string; icon: React.ElementType }> = [
  { id: "coding", label: "Coding", icon: Code },
  { id: "designing", label: "Designing", icon: Palette },
];

const codingSubTabs: Array<{ id: ProjectSubTab; label: string; icon: React.ElementType }> = [
  { id: "live-website", label: "Live Website", icon: Globe },
  { id: "git-integration", label: "Git Integration", icon: Github },
];

const designingSubTabs: Array<{ id: ProjectSubTab; label: string; icon: React.ElementType; category: string }> = [
  { id: "graphic", label: "Graphic Design", icon: Palette, category: "Graphic Design" },
  { id: "web", label: "Web Design", icon: Monitor, category: "Web Design" },
  { id: "motion", label: "Motion Graphics", icon: PlayCircle, category: "Motion Graphics" },
  { id: "vfx-3d", label: "VFX & 3D Animation", icon: Box, category: "VFX & 3D" },
];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [githubRepos, setGithubRepos] = useState<GithubRepoAdminItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeMainTab, setActiveMainTab] = useState<ProjectMainTab>("coding");
  const [activeSubTab, setActiveSubTab] = useState<ProjectSubTab>("live-website");
  const [activeGraphicCategory, setActiveGraphicCategory] = useState<"BEHANCE" | "PINTEREST">("BEHANCE");
  const [isAdding, setIsAdding] = useState(false);
  
  const [form, setForm] = useState<ProjectForm>(() => createDefaultForm("coding"));
  const [isUploading, setIsUploading] = useState(false);
  const [isFetchingGithub, setIsFetchingGithub] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isLoadingGithubRepos, setIsLoadingGithubRepos] = useState(true);
  const [uploadingRepoBanner, setUploadingRepoBanner] = useState<string | null>(null);
  const [isSaving, setIsSavingState] = useState(false);

  const { setSaveAction, setIsSaving, setStatusText } = useAdmin();

  // Showcase states
  type ShowcaseEmbed = { id: string; src: string; title: string };
  const [behanceEmbeds, setBehanceEmbeds] = useState<ShowcaseEmbed[]>([]);
  const [pinterestEmbeds, setPinterestEmbeds] = useState<ShowcaseEmbed[]>([]);
  const [isSavingBehance, setIsSavingBehance] = useState(false);
  const [isSavingPinterest, setIsSavingPinterest] = useState(false);
  const [isLoadingShowcases, setIsLoadingShowcases] = useState(true);

  // Create a ref to store the latest save function to avoid the infinite loop
  const saveActionRef = useRef<(() => Promise<void>) | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading("Uploading image...");

    try {
      const { url, error } = await uploadToStorage(file);
      if (error) throw error;
      if (url) {
        setForm((prev) => ({ ...prev, mediaUrl: url }));
        toast.success("Upload successful.", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload failed.", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  }

  // Define the save functions with useCallback
  const loadProjects = useCallback(async () => {
    const response = await fetch("/api/admin/projects", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    setProjects(data.projects || []);
  }, []);

  const loadGithubRepos = useCallback(async () => {
    setIsLoadingGithubRepos(true);
    try {
      const response = await fetch("/api/admin/github-repos", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load GitHub repositories.");
      const data = await response.json();
      setGithubRepos((data.repos || []).map((repo: any) => ({
        ...repo,
        draftImageUrl: repo.image_url || "",
        isSaving: false,
      })));
    } catch (error) {
      console.error(error);
      toast.error("Could not load GitHub repository settings.");
    } finally {
      setIsLoadingGithubRepos(false);
    }
  }, []);

  const loadShowcases = useCallback(async () => {
    setIsLoadingShowcases(true);
    try {
      const response = await fetch("/api/admin/site-content", { cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.behanceShowcase)) setBehanceEmbeds(data.behanceShowcase);
        if (Array.isArray(data.pinterestShowcase)) setPinterestEmbeds(data.pinterestShowcase);
      }
    } catch (error) {
      console.error("Failed to load showcases:", error);
    } finally {
      setIsLoadingShowcases(false);
    }
  }, []);

  const resetForm = useCallback((workspace?: AdminWorkspace, category?: string, type?: Project["type"]) => {
    setSelectedId(null);
    const defaults = createDefaultForm(
      workspace || (activeMainTab === "coding" ? "coding" : "designing"),
      category || (activeMainTab === "designing" ? designingSubTabs.find(t => t.id === activeSubTab)?.category : undefined)
    );
    setForm({
      ...defaults,
      type: type || (activeSubTab === "graphic" ? activeGraphicCategory : defaults.type),
      mediaType: (category === "Motion Graphics" || category === "VFX & 3D") ? "VIDEO" : defaults.mediaType,
    });
  }, [activeMainTab, activeSubTab, activeGraphicCategory]);

  const saveProject = useCallback(async () => {
    const hasMedia = form.mediaUrl.trim();
    const hasExternal = form.externalUrl.trim();
    const hasIframe = form.iframeUrl.trim();

    if (!hasMedia && !hasExternal && !hasIframe) {
      toast.error("Error: Please provide at least a Project Link or a Media Asset.");
      return;
    }

    setIsSavingState(true);
    const toastId = toast.loading(selectedId ? "Updating project..." : "Creating project...");
    const method = selectedId ? "PUT" : "POST";
    const url = selectedId ? `/api/admin/projects/${selectedId}` : "/api/admin/projects";

    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        previewHeight: form.previewHeight ? parseInt(form.previewHeight) : null,
        workspace: activeMainTab,
        category: form.category || (activeMainTab === "designing" ? designingSubTabs.find(t => t.id === activeSubTab)?.category : null),
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Save failed");

      await loadProjects();
      toast.success(selectedId ? "Project updated!" : "Project created!", { id: toastId });
      setIsAdding(false);
      if (!selectedId) resetForm();
    } catch (err) {
      toast.error("Save failed. Check network logs.", { id: toastId });
    } finally {
      setIsSavingState(false);
    }
  }, [form, selectedId, activeMainTab, activeSubTab, loadProjects, resetForm]);

  async function saveBehanceShowcase() {
    setIsSavingBehance(true);
    const toastId = toast.loading("Updating Behance showcase...");
    try {
      const response = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: 'behanceShowcase', data: behanceEmbeds }),
      });
      if (!response.ok) throw new Error();
      toast.success("Behance updated.", { id: toastId });
    } catch {
      toast.error("Failed to update Behance.", { id: toastId });
    } finally {
      setIsSavingBehance(false);
    }
  }

  async function savePinterestShowcase() {
    setIsSavingPinterest(true);
    const toastId = toast.loading("Updating Pinterest showcase...");
    try {
      const response = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: 'pinterestShowcase', data: pinterestEmbeds }),
      });
      if (!response.ok) throw new Error();
      toast.success("Pinterest updated.", { id: toastId });
    } catch {
      toast.error("Failed to update Pinterest.", { id: toastId });
    } finally {
      setIsSavingPinterest(false);
    }
  }

  // Update the ref whenever the save functions change
  useEffect(() => {
    if (activeMainTab === "designing" && activeSubTab === "graphic") {
      if (activeGraphicCategory === "BEHANCE") {
        saveActionRef.current = saveBehanceShowcase;
      } else {
        saveActionRef.current = savePinterestShowcase;
      }
    } else {
      saveActionRef.current = saveProject;
    }
  }, [activeMainTab, activeSubTab, activeGraphicCategory, saveProject, saveBehanceShowcase, savePinterestShowcase]);

  // Synchronize with global admin controls using a stable bridge
  useEffect(() => {
    const stableSave = async () => {
      if (saveActionRef.current) {
        await saveActionRef.current();
      }
    };

    setSaveAction(() => stableSave);
    setStatusText(isSaving ? "Synchronizing..." : "Workspace Online");
    setIsSaving(isSaving || isSavingBehance || isSavingPinterest);
    
    return () => {
      setSaveAction(null);
    };
  }, [isSaving, isSavingBehance, isSavingPinterest, setSaveAction, setIsSaving, setStatusText]);

  // Auto-fetch video thumbnails
  useEffect(() => {
    const isVideoCategory = form.category === "Motion Graphics" || form.category === "VFX & 3D";
    if (!isVideoCategory || !form.externalUrl) return;

    // YouTube
    const ytThumb = extractVideoThumbnail(form.externalUrl);
    if (ytThumb) {
      if (form.mediaUrl !== ytThumb) {
        setForm(prev => ({ ...prev, mediaUrl: ytThumb }));
      }
      return;
    }

    // Vimeo
    const vimeoMatch = form.externalUrl.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
    if (vimeoMatch?.[1]) {
      const vimeoId = vimeoMatch[1];
      fetch(`https://vimeo.com/api/v2/video/${vimeoId}.json`)
        .then(res => res.json())
        .then(data => {
          if (data?.[0]?.thumbnail_large && form.mediaUrl !== data[0].thumbnail_large) {
            setForm(prev => ({ ...prev, mediaUrl: data[0].thumbnail_large }));
          }
        })
        .catch(() => {});
    }
  }, [form.externalUrl, form.category]);

  useEffect(() => {
    queueMicrotask(() => {
      void Promise.all([loadProjects(), loadGithubRepos(), loadShowcases()]);
    });
  }, [loadProjects, loadGithubRepos, loadShowcases]);

  function selectProject(project: Project) {
    setSelectedId(project.id);
    setIsAdding(false);
    setForm({
      title: project.title,
      description: project.description,
      content: project.content || "",
      type: project.type,
      mediaType: project.mediaType,
      mediaUrl: project.mediaUrl,
      externalUrl: project.externalUrl || "",
      iframeUrl: project.iframeUrl || "",
      category: project.category || "",
      tags: project.tags.join(", "),
      dominantColor: project.dominantColor || "",
      previewHeight: project.previewHeight?.toString() || "",
      featured: project.featured,
    });
  }

  const filteredProjects = useMemo(() => {
    if (activeMainTab === "coding") {
      return projects.filter(p => (p.workspace || (p.type === "CODE" ? "coding" : "designing")) === "coding");
    } else {
      const subTab = designingSubTabs.find(t => t.id === activeSubTab);
      const targetCategory = subTab?.category;
      
      let filtered = projects.filter(p => {
        if (!p.category) return false;
        // Use case-insensitive matching to handle database inconsistencies (e.g. 'Graphic design' vs 'Graphic Design')
        return p.category.toLowerCase() === targetCategory?.toLowerCase();
      });
      
      if (activeSubTab === "graphic") {
        if (activeGraphicCategory === "PINTEREST") {
          // Include PINTEREST type and legacy GRAPHIC type (if it doesn't have an iframe)
          filtered = filtered.filter(p => p.type === "PINTEREST" || (p.type === "GRAPHIC" && !p.iframeUrl));
        } else {
          // Include BEHANCE type and legacy GRAPHIC type (if it has an iframe)
          filtered = filtered.filter(p => p.type === "BEHANCE" || (p.type === "GRAPHIC" && p.iframeUrl));
        }
      }
      
      return filtered;
    }
  }, [projects, activeMainTab, activeSubTab, activeGraphicCategory]);

  async function deleteProject(id: string) {
    const toastId = toast.loading("Deleting project...");
    const response = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    if (!response.ok) {
      toast.error("Delete failed.", { id: toastId });
      return;
    }
    if (selectedId === id) resetForm();
    await loadProjects();
    toast.success("Project deleted.", { id: toastId });
  }

  async function handleGithubFetch() {
    const url = form.externalUrl;
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      toast.error("Invalid GitHub URL.");
      return;
    }
    const [, owner, repo] = match;
    setIsFetchingGithub(true);
    const toastId = toast.loading(`Fetching ${owner}/${repo}...`);
    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo.replace(/\.git$/, "")}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setForm(prev => ({
        ...prev,
        title: prev.title || data.name.replace(/[-_]+/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
        description: prev.description || data.description || "",
        iframeUrl: prev.iframeUrl || data.homepage || "",
      }));
      toast.success("GitHub data synced.", { id: toastId });
    } catch {
      toast.error("Fetch failed.", { id: toastId });
    } finally {
      setIsFetchingGithub(false);
    }
  }

  async function handleGithubRepoEnabledToggle(repo: GithubRepoAdminItem) {
    const nextEnabled = !repo.enabled;
    updateGithubRepoState(repo.full_name, c => ({ ...c, enabled: nextEnabled, isSaving: true }));
    try {
      const response = await fetch("/api/admin/github-repos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates: [{ full_name: repo.full_name, enabled: nextEnabled }] }),
      });
      if (!response.ok) throw new Error();
      toast.success(nextEnabled ? "Repo visible." : "Repo hidden.");
    } catch {
      toast.error("Update failed.");
      await loadGithubRepos();
    } finally {
      updateGithubRepoState(repo.full_name, c => ({ ...c, isSaving: false }));
    }
  }

  function updateGithubRepoState(fullName: string, updater: (repo: GithubRepoAdminItem) => GithubRepoAdminItem) {
    setGithubRepos(prev => prev.map(repo => repo.full_name === fullName ? updater(repo) : repo));
  }

  return (
    <AdminSectionWorkspace
      sectionLabel="Portfolio Assets"
      sectionTitle="Project Management"
      sectionDescription="Organize your coding and design work into specific segments and integrations."
      icon={FolderKanban}
    >
      {/* Main Tab Bar */}
      <div className="flex items-center gap-4 mb-10 overflow-x-auto no-scrollbar pb-2">
        {projectMainTabs.map((tab) => {
          const active = activeMainTab === tab.id;
          const Icon = tab.icon as any;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveMainTab(tab.id);
                const firstSub = tab.id === "coding" ? "live-website" : "graphic";
                setActiveSubTab(firstSub);
                resetForm(tab.id, tab.id === "designing" ? designingSubTabs.find(t => t.id === firstSub)?.category : undefined);
                setIsAdding(false);
              }}
              className={`flex items-center gap-3 px-8 py-4 rounded-[28px] text-[14px] font-extrabold uppercase tracking-widest transition-all border-2 ${
                active 
                  ? "bg-[#0020d7] border-[#0020d7] text-white shadow-xl shadow-[#0020d7]/20" 
                  : "bg-white border-[#e4e4e7] text-[#4a4a68] hover:border-[#0020d7]/20"
              }`}
            >
              <Icon size={18} strokeWidth={2.5} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Sub Tab Bar */}
      <div className="flex flex-col gap-6 mb-12">
        <div className="flex items-center gap-2 p-2 rounded-[32px] bg-white border-2 border-[#e4e4e7] overflow-x-auto no-scrollbar max-w-fit">
          {(activeMainTab === "coding" ? codingSubTabs : designingSubTabs).map((tab) => {
            const active = activeSubTab === tab.id;
            const Icon = tab.icon as any;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSubTab(tab.id);
                  resetForm(activeMainTab, (tab as any).category);
                  setIsAdding(false);
                }}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-[24px] text-[12px] font-bold transition-all ${
                  active 
                    ? "bg-[#f7f4ef] text-[#0020d7] ring-2 ring-[#0020d7]/10" 
                    : "text-[#4a4a68] hover:bg-[#f7f4ef]/50"
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Nested Graphic Category Selector */}
        {activeMainTab === "designing" && activeSubTab === "graphic" && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 px-4 py-2 rounded-[24px] bg-[#f7f4ef]/50 border-2 border-dashed border-[#e4e4e7] max-w-fit"
          >
            {[
              { id: "BEHANCE", label: "Behance", icon: IconBrandBehance },
              { id: "PINTEREST", label: "Pinterest", icon: Palette },
            ].map((cat) => {
              const active = activeGraphicCategory === cat.id;
              const Icon = cat.icon as any;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveGraphicCategory(cat.id as any);
                    resetForm("designing", "Graphic Design", cat.id as any);
                    setIsAdding(false);
                  }}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-extrabold uppercase tracking-widest transition-all ${
                    active 
                      ? "bg-[#0020d7] text-white shadow-lg shadow-[#0020d7]/20" 
                      : "bg-white text-[#4a4a68] border border-[#e4e4e7] hover:bg-[#f7f4ef]"
                  }`}
                >
                  <Icon size={12} />
                  {cat.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </div>

      <main className="max-w-[1400px] mx-auto space-y-10 pb-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeMainTab}-${activeSubTab}-${activeGraphicCategory}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeSubTab === "git-integration" ? (
               <SectionPanel className="bg-white shadow-xl shadow-black/5">
                 <SectionTitle title="GitHub Intelligence Layer" copy="Synchronize your repository visibility." icon={Github} />
                 <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {isLoadingGithubRepos ? (
                     Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-40 rounded-[33px] bg-[#f7f4ef] animate-pulse" />)
                   ) : githubRepos.map(repo => (
                     <div key={repo.full_name} className={`p-8 rounded-[40px] border-2 transition-all ${repo.enabled ? "bg-white border-[#0020d7]/10 shadow-xl shadow-[#0020d7]/5" : "bg-[#f7f4ef]/50 border-[#e4e4e7]"}`}>
                        <div className="flex items-start justify-between mb-6">
                           <div className="min-w-0">
                              <h5 className="text-[15px] font-extrabold text-[#0b0b0c] truncate">{repo.name}</h5>
                              <p className="text-[10px] font-extrabold text-[#0020d7] uppercase tracking-widest opacity-60 truncate">{repo.full_name}</p>
                           </div>
                           <button onClick={() => handleGithubRepoEnabledToggle(repo)} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all ${repo.enabled ? "bg-[#0020d7]" : "bg-[#e4e4e7]"}`}>
                             <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all ${repo.enabled ? "translate-x-6" : "translate-x-1"}`} />
                           </button>
                        </div>
                        <Field label="Terminal Banner" value={repo.draftImageUrl} onChange={(v) => updateGithubRepoState(repo.full_name, c => ({ ...c, draftImageUrl: v }))} />
                     </div>
                   ))}
                 </div>
               </SectionPanel>
            ) : activeMainTab === "designing" && activeSubTab === "graphic" && activeGraphicCategory === "BEHANCE" && !selectedId && !isAdding ? (
              <SectionPanel className="bg-white shadow-xl shadow-black/5">
                <div className="flex items-center justify-between mb-10">
                  <SectionTitle title="Behance Visual Showcase" copy="Manage high-fidelity project embeds and showreels." icon={IconBrandBehance} />
                  <ActionButton onClick={saveBehanceShowcase} disabled={isSavingBehance}>
                    {isSavingBehance ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Sync Behance
                  </ActionButton>
                </div>
                
                <AdminSectionWorkspace.ListEditor
                  title="Embed Index"
                  addLabel="Add Showcase Embed"
                  items={behanceEmbeds}
                  onAdd={() => setBehanceEmbeds([...behanceEmbeds, { id: crypto.randomUUID(), src: "", title: "" }])}
                  onRemove={(idx) => setBehanceEmbeds(behanceEmbeds.filter((_, i) => i !== idx))}
                  columns={2}
                  renderItem={(embed, idx) => (
                    <div className="flex flex-col gap-8">
                      <div className="space-y-6">
                        <Field label="Showcase Title" value={embed.title} onChange={(v) => {
                          const next = [...behanceEmbeds];
                          next[idx] = { ...next[idx], title: v };
                          setBehanceEmbeds(next);
                        }} />
                        <Field label="Behance Iframe Link" value={embed.src} onChange={(v) => {
                          const next = [...behanceEmbeds];
                          next[idx] = { ...next[idx], src: formatBehanceLink(v) };
                          setBehanceEmbeds(next);
                        }} icon={Code} placeholder="https://www.behance.net/embed/project/..." />
                      </div>
                      <div className="aspect-video rounded-[28px] bg-white border-4 border-[#e4e4e7] overflow-hidden relative shadow-inner">
                        {embed.src ? (
                          <iframe 
                            src={embed.src} 
                            className="w-full h-full border-0" 
                            title={embed.title || "Behance Preview"} 
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-4 opacity-20">
                            <IconBrandBehance size={48} />
                            <span className="text-[11px] font-bold uppercase tracking-widest">Embed Preview Standby</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                />
              </SectionPanel>
            ) : !selectedId && !isAdding ? (
              <SectionPanel className="bg-white shadow-xl shadow-black/5">
                <div className="flex items-center justify-between mb-10">
                  <SectionTitle 
                    title={`${activeMainTab === 'coding' ? 'Coding' : (designingSubTabs.find(t => t.id === activeSubTab)?.label || 'Project')} Portfolio`} 
                    copy="Manage your professional works and high-fidelity concepts." 
                    icon={(activeMainTab === 'coding' ? Code : (designingSubTabs.find(t => t.id === activeSubTab)?.icon || Palette)) as any} 
                  />
                  <ActionButton onClick={() => {
                    const subTab = activeMainTab === "coding" ? codingSubTabs.find(t => t.id === activeSubTab) : designingSubTabs.find(t => t.id === activeSubTab);
                    resetForm(activeMainTab, (subTab as any)?.category || "", activeSubTab === "graphic" ? activeGraphicCategory : (activeMainTab === "coding" ? "CODE" : "FIGMA"));
                    setIsAdding(true);
                  }}>
                    <Plus size={14} /> Add {activeMainTab === "coding" ? "Project" : "Asset"}
                  </ActionButton>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProjects.map(p => (
                    <div key={p.id} className="flex flex-col rounded-[40px] border-[3px] border-[#e4e4e7] bg-white shadow-sm group hover:shadow-xl hover:border-[#0020d7]/10 transition-all overflow-hidden">
                      <div className={cn(
                        "bg-[#f7f4ef] relative overflow-hidden",
                        activeGraphicCategory === "PINTEREST" && activeSubTab === "graphic" ? "aspect-[3/4]" : "aspect-video"
                      )}>
                        {p.mediaUrl ? (
                          <img src={p.mediaUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={p.title} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center opacity-20">
                            {activeMainTab === 'coding' ? <Code size={48} /> : <Monitor size={48} />}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                           <TinyButton onClick={() => selectProject(p)}>Edit</TinyButton>
                           <TinyButton variant="danger" onClick={() => deleteProject(p.id)}>Delete</TinyButton>
                        </div>
                      </div>
                      <div className="p-6 border-t-2 border-[#f7f4ef]">
                         <h5 className="text-[14px] font-extrabold text-[#0b0b0c] truncate">{p.title || "Untitled Project"}</h5>
                         <p className="text-[10px] font-bold text-[#0020d7] uppercase tracking-widest mt-1.5 truncate">
                           {p.externalUrl ? p.externalUrl.replace(/https?:\/\/(www\.)?/, "") : "No Link Provided"}
                         </p>
                      </div>
                    </div>
                  ))}

                  {/* Add Card */}
                  <button 
                    onClick={() => {
                      const subTab = activeMainTab === "coding" ? codingSubTabs.find(t => t.id === activeSubTab) : designingSubTabs.find(t => t.id === activeSubTab);
                      resetForm(activeMainTab, (subTab as any)?.category || "", activeSubTab === "graphic" ? activeGraphicCategory : (activeMainTab === "coding" ? "CODE" : "FIGMA"));
                      setIsAdding(true);
                    }}
                    className={cn(
                      "rounded-[40px] border-[4px] border-dashed border-[#e4e4e7] bg-white/50 hover:bg-white hover:border-[#0020d7]/30 hover:shadow-xl transition-all group flex flex-col items-center justify-center gap-4",
                      activeGraphicCategory === "PINTEREST" && activeSubTab === "graphic" ? "min-h-[400px]" : "min-h-[250px]"
                    )}
                  >
                     <div className="h-16 w-16 rounded-full bg-[#f7f4ef] flex items-center justify-center text-[#4a4a68] group-hover:bg-[#0020d7] group-hover:text-white transition-all duration-300">
                        <Plus size={32} strokeWidth={3} />
                     </div>
                     <span className="text-[15px] font-extrabold text-[#4a4a68] uppercase tracking-widest group-hover:text-[#0b0b0c] transition-colors">
                       New {activeMainTab === "coding" ? "Project" : "Asset"}
                     </span>
                  </button>
                </div>
              </SectionPanel>
            ) : (
              <div className="grid grid-cols-1 gap-12 xl:grid-cols-12">
                {/* Editor */}
                <SectionPanel className="xl:col-span-8 bg-white shadow-xl shadow-black/5">
                  <div className="flex items-center justify-between mb-10">
                    <SectionTitle 
                      title={form.type === "PINTEREST" ? (selectedId ? "Edit Pinterest Pin" : "Add New Pin") : (selectedId ? "Refine Entry" : "Draft New Entity")} 
                      copy={form.type === "PINTEREST" ? "Sync your inspiration directly with your board." : "Establish the technical parameters and visual identity."} 
                      icon={form.type === "PINTEREST" ? Palette : form.type === "BEHANCE" ? IconBrandBehance : (selectedId ? Pencil : Sparkles)} 
                    />
                    <div className="flex items-center gap-3">
                      {selectedId && (
                        <TinyButton variant="danger" onClick={() => deleteProject(selectedId)}>
                          <Trash2 size={12} strokeWidth={2.5} />
                        </TinyButton>
                      )}
                      <TinyButton onClick={() => {
                        resetForm();
                        setIsAdding(false);
                      }}>Cancel</TinyButton>
                    </div>
                  </div>

                  {form.type === "PINTEREST" || form.type === "BEHANCE" || form.type === "FIGMA" ? (
                    <div className="space-y-12">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Field 
                          label={form.type === "PINTEREST" ? "Pin Title" : form.type === "BEHANCE" ? "Showcase Title" : (form.category === "Motion Graphics" || form.category === "VFX & 3D") ? "Video Title" : "Project Name"} 
                          value={form.title} 
                          onChange={(v) => setForm({ ...form, title: v })} 
                          icon={Type} 
                          placeholder={form.type === "PINTEREST" ? "e.g. Minimalist Branding Inspiration" : form.type === "BEHANCE" ? "e.g. 2024 Motion Showreel" : (form.category === "Motion Graphics" || form.category === "VFX & 3D") ? "e.g. Brand Identity Motion Reel" : "e.g. ECO HIVE - Sustainable App"} 
                        />
                        {form.type === "PINTEREST" ? (
                          <Field label="Pinterest Link" value={form.externalUrl} onChange={(v) => setForm({ ...form, externalUrl: v })} icon={Link2} placeholder="https://pinterest.com/pin/..." />
                        ) : form.type === "BEHANCE" ? (
                          <Field label="Behance Iframe Link" value={form.iframeUrl} onChange={(v) => setForm({ ...form, iframeUrl: formatBehanceLink(v) })} icon={Code} placeholder="https://www.behance.net/embed/project/..." />
                        ) : (
                          <Field 
                            label={form.category === "Motion Graphics" || form.category === "VFX & 3D" ? "Video Link (YouTube/Vimeo)" : "Project Link (Figma/Live)"} 
                            value={form.externalUrl} 
                            onChange={(v) => setForm({ ...form, externalUrl: v })} 
                            icon={form.category === "Motion Graphics" || form.category === "VFX & 3D" ? PlayCircle : Globe} 
                            placeholder={form.category === "Motion Graphics" || form.category === "VFX & 3D" ? "https://www.youtube.com/watch?v=..." : "https://www.figma.com/file/..."} 
                          />
                        )}
                      </div>

                      <div className="pt-8 border-t-2 border-[#f7f4ef]">
                        <SectionTitle 
                          title={form.type === "PINTEREST" ? "Visual Preview" : (form.category === "Motion Graphics" || form.category === "VFX & 3D") ? "Auto-Generated Thumbnail" : "Mockup / Cover Asset"} 
                          copy={form.type === "PINTEREST" ? "Live synchronization of the pin asset." : (form.category === "Motion Graphics" || form.category === "VFX & 3D") ? "Thumbnail is automatically fetched from the video link above." : "High-fidelity thumbnail for the portfolio grid."} 
                          icon={UploadIcon} 
                        />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                          <div className="space-y-6">
                            <Field label="Media URI" value={form.mediaUrl} onChange={(v) => setForm({ ...form, mediaUrl: v })} icon={UploadIcon} />
                            <input type="file" className="hidden" id="asset-upload" onChange={handleUpload} />
                            <ActionButton onClick={() => document.getElementById("asset-upload")?.click()} disabled={isUploading} variant="secondary" className="w-full">
                               {isUploading ? <Loader2 size={14} className="animate-spin" /> : <UploadIcon size={14} />}
                               Upload {form.type === "PINTEREST" ? "Pin Image" : (form.category === "Motion Graphics" || form.category === "VFX & 3D") ? "Video / Reel" : "Mockup Asset"}
                            </ActionButton>
                          </div>
                          <div className={cn(
                            "rounded-[33px] bg-[#f7f4ef] border-4 border-[#e4e4e7] overflow-hidden flex items-center justify-center relative shadow-inner mx-auto",
                            form.type === "PINTEREST" ? "aspect-[3/4] max-w-[300px]" : "aspect-video w-full"
                          )}>
                            {form.mediaUrl ? (
                              <img src={form.mediaUrl} className="w-full h-full object-cover" alt="Preview" />
                            ) : form.type === "BEHANCE" && form.iframeUrl ? (
                               <iframe src={form.iframeUrl} className="w-full h-full border-0" title="Behance Preview" />
                            ) : (
                              <div className="flex flex-col items-center gap-4 opacity-20">
                                <UploadIcon size={48} />
                                <span className="text-[11px] font-extrabold uppercase tracking-widest text-center px-4">Awaiting Visual</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <Field label="Project Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} icon={Type} />
                      <SelectField
                        label="Category"
                        value={form.category}
                        onChange={(v) => setForm({ ...form, category: v })}
                        options={[
                          { label: "Default Category", value: "" },
                          { label: "Graphic Design", value: "Graphic Design" },
                          { label: "Web Design", value: "Web Design" },
                          { label: "Motion Graphics", value: "Motion Graphics" },
                          { label: "VFX & 3D Animation", value: "VFX & 3D" },
                          { label: "Web App", value: "Web App" },
                          { label: "Mobile", value: "Mobile" },
                        ]}
                      />
                      <TextareaField label="Brief Summary" value={form.description} onChange={(v) => setForm({ ...form, description: v })} className="md:col-span-2" rows={2} icon={AlignLeft} />
                      <Field 
                        label={form.category === "Motion Graphics" || form.category === "VFX & 3D" ? "Video Link (YouTube/Vimeo)" : "Project Link"} 
                        value={form.externalUrl} 
                        onChange={(v) => setForm({ ...form, externalUrl: v })} 
                        icon={form.category === "Motion Graphics" || form.category === "VFX & 3D" ? PlayCircle : ExternalLink} 
                        placeholder="https://..." 
                      />
                      <Field label="Interactive Iframe" value={form.iframeUrl} onChange={(v) => setForm({ ...form, iframeUrl: v })} icon={Code} />
                      
                      <div className="md:col-span-2 pt-6 border-t-2 border-[#f7f4ef] space-y-8">
                        <SectionTitle title="Asset Preview" copy="Live synchronization of media and interactive components." icon={UploadIcon} />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                            <div className="space-y-6">
                              <Field label="Media URI" value={form.mediaUrl} onChange={(v) => setForm({ ...form, mediaUrl: v })} icon={UploadIcon} />
                              <input type="file" className="hidden" id="media-upload" onChange={handleUpload} />
                              <ActionButton onClick={() => document.getElementById("media-upload")?.click()} disabled={isUploading} variant="secondary" className="w-full">
                                {isUploading ? <Loader2 size={14} className="animate-spin" /> : <UploadIcon size={14} />}
                                Upload Asset
                              </ActionButton>
                              <div className="grid grid-cols-2 gap-4">
                                <SelectField
                                  label="Type"
                                  value={form.mediaType}
                                  onChange={(v) => setForm({ ...form, mediaType: v as any })}
                                  options={[
                                    { label: "Image", value: "IMAGE" },
                                    { label: "Video", value: "VIDEO" },
                                    { label: "GIF", value: "GIF" },
                                    { label: "3D Model", value: "MODEL" },
                                  ]}
                                />
                                <Field label="Accent Hex" value={form.dominantColor} onChange={(v) => setForm({ ...form, dominantColor: v })} icon={Palette} />
                              </div>
                            </div>
                            <div className="aspect-video rounded-[33px] bg-[#f7f4ef] border-4 border-[#e4e4e7] overflow-hidden flex items-center justify-center relative shadow-inner">
                              {form.iframeUrl ? (
                                <iframe src={form.iframeUrl} className="w-full h-full border-0" title="Iframe Preview" />
                              ) : form.mediaUrl ? (
                                form.mediaType === "VIDEO" ? (
                                  <video src={form.mediaUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                                ) : (
                                  <img src={form.mediaUrl} className="w-full h-full object-cover" alt="Preview" />
                                )
                              ) : (
                                <div className="flex flex-col items-center gap-4 opacity-20">
                                  <UploadIcon size={48} />
                                  <span className="text-[11px] font-extrabold uppercase tracking-widest">No Asset Loaded</span>
                                </div>
                              )}
                            </div>
                        </div>
                      </div>

                      <div className="md:col-span-2 pt-6 border-t-2 border-[#f7f4ef] space-y-6">
                        <Field label="Stack / Tags" value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} icon={Code} />
                        <TextareaField label="Markdown Narrative" value={form.content} onChange={(v) => setForm({ ...form, content: v })} rows={8} icon={FileText} />
                        <div className="p-6 rounded-[28px] bg-[#f7f4ef]/50 border-2 border-[#e4e4e7] flex items-center gap-4">
                            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="h-6 w-6 rounded-lg border-2 border-[#e4e4e7] text-[#0020d7]" />
                            <span className="text-[13px] font-extrabold uppercase tracking-widest text-[#0b0b0c]">Feature in Highlights</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-12 flex justify-end gap-4 border-t-2 border-[#f7f4ef] pt-10">
                    <ActionButton onClick={saveProject}><Save size={14} />{selectedId ? "Apply Modifications" : "Deploy Project"}</ActionButton>
                  </div>
                </SectionPanel>

                {/* Quick Selector */}
                <div className="xl:col-span-4 space-y-8">
                  <SectionPanel className="p-8 bg-white/50 backdrop-blur-sm sticky top-28">
                    <SectionTitle title="Quick Selector" copy="Manage your project stack." icon={FolderKanban} />
                    <div className="pt-6 border-t-2 border-[#f7f4ef] space-y-4">
                      <div className="grid grid-cols-2 gap-3 max-h-[700px] overflow-y-auto no-scrollbar pr-1 pb-4">
                        <button onClick={() => { resetForm(); setIsAdding(true); }} className={`flex flex-col items-center justify-center gap-3 p-4 rounded-[24px] border-2 border-dashed transition-all aspect-square ${!selectedId && isAdding ? "bg-[#0020d7]/5 border-[#0020d7] text-[#0020d7]" : "bg-white/50 border-[#e4e4e7] text-[#4a4a68] hover:border-[#0020d7]/30"}`}>
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${!selectedId && isAdding ? "bg-[#0020d7] text-white" : "bg-[#f7f4ef]"}`}><Plus size={20} strokeWidth={3} /></div>
                          <span className="text-[11px] font-extrabold uppercase tracking-widest">Add New</span>
                        </button>
                        {filteredProjects.map(p => (
                          <button key={p.id} onClick={() => selectProject(p)} className={`flex flex-col text-left rounded-[24px] border-2 transition-all overflow-hidden aspect-square relative group ${selectedId === p.id ? "border-[#0020d7] ring-4 ring-[#0020d7]/5" : "bg-white border-[#e4e4e7] hover:border-[#0020d7]/20"}`}>
                            <div className="flex-1 bg-[#f7f4ef] relative overflow-hidden">
                              {p.mediaUrl ? <img src={p.mediaUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" /> : <div className="w-full h-full flex items-center justify-center opacity-20"><FolderKanban size={24} /></div>}
                              {p.featured && <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-[#0020d7] text-white flex items-center justify-center"><Sparkles size={12} /></div>}
                            </div>
                            <div className={`p-3 border-t-2 ${selectedId === p.id ? "bg-[#0020d7] border-[#0020d7] text-white" : "bg-white border-[#f7f4ef] text-[#0b0b0c]"}`}>
                              <span className="text-[10px] font-bold truncate block">{p.title}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </SectionPanel>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </AdminSectionWorkspace>
  );
}
