"use client";

import { useEffect, useMemo, useState } from "react";
import AdminSectionWorkspace, { SectionPanel, SectionTitle, Field, TextareaField, SelectField, ActionButton, TinyButton, StatusBadge } from "@/components/admin/AdminSectionWorkspace";
import { uploadToStorage } from "@/lib/supabase";
import { Upload as UploadIcon, X as XIcon, Loader2, Sparkles, Pencil, AlertCircle, FolderKanban, Code, Palette, Github, Link2, ExternalLink, Trash2, Eye, EyeOff, Save, RefreshCw, Plus, FileText } from "lucide-react";
import { toast } from "sonner";

type Project = {
  id: string;
  title: string;
  description: string;
  content: string | null;
  type: "CODE" | "FIGMA" | "BEHANCE" | "PINTEREST";
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
  type: "CODE" | "FIGMA" | "BEHANCE" | "PINTEREST";
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

type AdminWorkspace = "coding" | "designing";

function createDefaultForm(workspace: AdminWorkspace): ProjectForm {
  return {
    ...defaultForm,
    type: workspace === "coding" ? "CODE" : "BEHANCE",
  };
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [githubRepos, setGithubRepos] = useState<GithubRepoAdminItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeWorkspace, setActiveWorkspace] = useState<AdminWorkspace>("coding");
  const [form, setForm] = useState<ProjectForm>(() => createDefaultForm("coding"));
  const [isUploading, setIsUploading] = useState(false);
  const [isFetchingGithub, setIsFetchingGithub] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isLoadingGithubRepos, setIsLoadingGithubRepos] = useState(true);
  const [uploadingRepoBanner, setUploadingRepoBanner] = useState<string | null>(null);

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

  async function loadProjects() {
    const response = await fetch("/api/admin/projects", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    setProjects(data.projects || []);
  }

  async function loadGithubRepos() {
    setIsLoadingGithubRepos(true);

    try {
      const response = await fetch("/api/admin/github-repos", { cache: "no-store" });

      if (!response.ok) {
        let errMsg = "Failed to load GitHub repositories.";
        try {
          const errData = await response.json();
          errMsg = errData.error || errMsg;
        } catch(e) {
          errMsg = await response.text();
        }
        throw new Error(`Failed to load GitHub repositories: ${errMsg}`);
      }

      const data = await response.json();
      const repos = Array.isArray(data.repos) ? data.repos : [];

      setGithubRepos(
        repos.map((repo: any) => ({
          ...repo,
          draftImageUrl: repo.image_url || "",
          isSaving: false,
        }))
      );
    } catch (error) {
      console.error(error);
      toast.error("Could not load GitHub repository settings.");
    } finally {
      setIsLoadingGithubRepos(false);
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      void Promise.all([loadProjects(), loadGithubRepos()]);
    });
  }, []);

  function updateGithubRepoState(fullName: string, updater: (repo: GithubRepoAdminItem) => GithubRepoAdminItem) {
    setGithubRepos((prev) =>
      prev.map((repo) => (repo.full_name === fullName ? updater(repo) : repo))
    );
  }

  async function saveGithubRepoSettings(repo: GithubRepoAdminItem, overrides?: Partial<GithubRepoAdminItem>) {
    const nextEnabled = overrides?.enabled ?? repo.enabled;
    const nextImageUrl =
      overrides?.draftImageUrl !== undefined
        ? overrides.draftImageUrl
        : repo.draftImageUrl;

    updateGithubRepoState(repo.full_name, (current) => ({
      ...current,
      ...overrides,
      enabled: nextEnabled,
      draftImageUrl: nextImageUrl,
      isSaving: true,
    }));

    try {
      const response = await fetch("/api/admin/github-repos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updates: [
            {
              full_name: repo.full_name,
              enabled: nextEnabled,
              image_url: nextImageUrl.trim() || null,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Could not save repository settings.");
      }

      updateGithubRepoState(repo.full_name, (current) => ({
        ...current,
        enabled: nextEnabled,
        image_url: nextImageUrl.trim() || null,
        draftImageUrl: nextImageUrl,
        isSaving: false,
      }));
    } catch (error) {
      console.error(error);
      updateGithubRepoState(repo.full_name, (current) => ({
        ...current,
        isSaving: false,
      }));
      throw error;
    }
  }

  async function handleGithubRepoEnabledToggle(repo: GithubRepoAdminItem) {
    const nextEnabled = !repo.enabled;

    try {
      await saveGithubRepoSettings(repo, { enabled: nextEnabled });
      toast.success(
        nextEnabled
          ? `${repo.name} is now visible on the website.`
          : `${repo.name} has been hidden from the website.`
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not update repository visibility.";
      toast.error(message);
      await loadGithubRepos();
    }
  }

  async function handleRepoBannerUpload(
    repo: GithubRepoAdminItem,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingRepoBanner(repo.full_name);
    const toastId = toast.loading(`Uploading banner for ${repo.name}...`);

    try {
      const { url, error } = await uploadToStorage(file);
      if (error || !url) {
        throw error || new Error("Upload failed.");
      }

      updateGithubRepoState(repo.full_name, (current) => ({
        ...current,
        draftImageUrl: url,
      }));
      toast.success("Banner uploaded. Save to publish it.", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Banner upload failed.", { id: toastId });
    } finally {
      setUploadingRepoBanner(null);
      event.target.value = "";
    }
  }

  async function handleSaveRepoBanner(repo: GithubRepoAdminItem) {
    try {
      await saveGithubRepoSettings(repo);
      toast.success(`Banner settings saved for ${repo.name}.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not save the banner.";
      toast.error(message);
      await loadGithubRepos();
    }
  }

  function selectProject(project: Project) {
    const workspace = project.workspace || (project.type === "CODE" ? "coding" : "designing");
    setActiveWorkspace(workspace);
    setSelectedId(project.id);
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

  function resetForm() {
    setSelectedId(null);
    setForm(createDefaultForm(activeWorkspace));
  }

  function switchWorkspace(workspace: AdminWorkspace) {
    setActiveWorkspace(workspace);
    setSelectedId(null);
    setForm(createDefaultForm(workspace));
  }

  const sidebarProjects = useMemo(() => {
    return projects.filter((project) => {
      const workspace = project.workspace || (project.type === "CODE" ? "coding" : "designing");
      return workspace === activeWorkspace;
    });
  }, [activeWorkspace, projects]);

  async function setMainWebDesignProject(project: Project) {
    const toastId = toast.loading(`Setting "${project.title}" as the main web design project...`);

    const response = await fetch(`/api/admin/projects/${project.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        featured: true,
        category: project.category || "Web Design",
        type: project.type,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      toast.error(errorData.error || "Could not set the main web design project.", { id: toastId });
      return;
    }

    await loadProjects();

    if (selectedId === project.id) {
      setForm((prev) => ({ ...prev, featured: true }));
    }

    toast.success("Main web design project updated.", { id: toastId });
  }

  function parsePayload() {
    return {
      // Required fields — send as strings so Zod min(1) can validate properly
      title: form.title.trim(),
      description: form.description.trim(),
      mediaUrl: form.mediaUrl.trim(),
      content: form.content.trim() || null,
      type: form.type,
      mediaType: form.mediaType,
      externalUrl: form.externalUrl.trim() || null,
      iframeUrl: form.iframeUrl.trim() || null,
      category: form.category.trim() || null,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      dominantColor: form.dominantColor.trim() || null,
      previewHeight: form.previewHeight ? parseInt(form.previewHeight) : null,
      featured: form.featured,
      workspace: form.type === "CODE" ? "coding" : "designing",
    };
  }

  async function handleGithubFetch() {
    const url = form.externalUrl;
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      toast.error("Invalid GitHub URL. Please use https://github.com/owner/repo");
      return;
    }

    const [, owner, repo] = match;
    const cleanRepo = repo.replace(/\.git$/, "");

    setIsFetchingGithub(true);
    const toastId = toast.loading(`Fetching data for ${owner}/${cleanRepo}...`);

    try {
      const repoRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`);
      if (!repoRes.ok) throw new Error("Repo not found");
      const repoData = await repoRes.json();

      const topicsRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/topics`, {
        headers: { Accept: "application/vnd.github.mercy-preview+json" },
      });
      const topicsData = await topicsRes.json();

      const languagesRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/languages`);
      const languagesData = await languagesRes.json();
      const languages = Object.keys(languagesData);

      const combinedTags = Array.from(
        new Set([...languages, ...(topicsData.names || []), repoData.language])
      ).filter(Boolean);

      setForm((prev) => ({
        ...prev,
        title: prev.title || toTitleCase(cleanRepo),
        description: prev.description || repoData.description || "",
        tags: combinedTags.join(", "),
        iframeUrl: prev.iframeUrl || repoData.homepage || "",
      }));

      toast.success("GitHub data fetched successfully!", { id: toastId });
    } catch {
      toast.error("Failed to fetch GitHub data. Check repo visibility.", { id: toastId });
    } finally {
      setIsFetchingGithub(false);
    }
  }

  function toTitleCase(value: string): string {
    return value
      .replace(/[-_]+/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((s) => s[0].toUpperCase() + s.slice(1))
      .join(" ");
  }

  async function handleAIDesignFetch() {
    if (!form.externalUrl || !form.category) {
      toast.warning("Please provide a link and select a category first.");
      return;
    }

    setIsGeneratingContent(true);
    const toastId = toast.loading("Step 1/2: ✨ Scraping project metadata...");

    try {
      const metaRes = await fetch("/api/admin/projects/fetch-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: form.externalUrl }),
      });

      if (!metaRes.ok) throw new Error("Scraping failed");
      const metaData = await metaRes.json();

      setForm((prev) => ({
        ...prev,
        title: metaData.title || prev.title,
        mediaUrl: metaData.image || prev.mediaUrl,
      }));

      toast.loading("Step 2/2: 🪄 AI generating content...", { id: toastId });

      const genRes = await fetch("/api/admin/projects/generate-ai-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: metaData.title || form.title,
          rawText: metaData.extractedText,
          category: form.category,
        }),
      });

      if (!genRes.ok) {
        const errorData = await genRes.json();
        throw new Error(errorData.error || "AI generation failed");
      }

      const aiData = await genRes.json();

      setForm((prev) => ({
        ...prev,
        description: aiData.description,
        content: aiData.content,
        tags: aiData.tags.join(", "),
      }));

      toast.success("✨ Project drafted successfully!", { id: toastId });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(error);
      toast.error(`Automation failed: ${message}. You may need to fill fields manually.`, {
        id: toastId,
      });
    } finally {
      setIsGeneratingContent(false);
    }
  }

  async function saveProject() {
    const hasMedia = form.mediaUrl.trim();
    const hasExternal = form.externalUrl.trim();
    const hasIframe = form.iframeUrl.trim();

    if (!hasMedia && !hasExternal && !hasIframe) {
      toast.error("Error: Please provide at least a Project Link or a Media Asset (Image/Video).");
      return;
    }

    const toastId = toast.loading(selectedId ? "Updating project..." : "Creating project...");

    const method = selectedId ? "PUT" : "POST";
    const url = selectedId ? `/api/admin/projects/${selectedId}` : "/api/admin/projects";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsePayload()),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // Show the first Zod validation error if present, otherwise fallback
      const details = errorData.details?.[0]?.message || errorData.error || "Unknown error";
      toast.error(`Save failed: ${details}`, { id: toastId });
      console.error("Save error details:", errorData);
      return;
    }

    await loadProjects();
    toast.success(
      selectedId ? "Project updated successfully!" : "Project created successfully!",
      { id: toastId }
    );

    if (!selectedId) {
      resetForm();
    }
  }

  async function deleteProject(id: string) {
    const toastId = toast.loading("Deleting project...");
    const response = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    if (!response.ok) {
      toast.error("Delete failed.", { id: toastId });
      return;
    }

    if (selectedId === id) {
      resetForm();
    }

    await loadProjects();
    toast.success("Project deleted.", { id: toastId });
  }

  return (
    <AdminSectionWorkspace
      sectionLabel="Portfolio Assets"
      sectionTitle="Project Engineering"
      sectionDescription="Add new projects, edit existing entries, and orchestrate featured work visibility."
      icon={FolderKanban}
    >
      <div className="grid grid-cols-1 gap-12 xl:grid-cols-12 pb-32">
        {/* Project List Sidebar */}
        <SectionPanel className="p-10 xl:col-span-4 bg-white/50 backdrop-blur-sm flex flex-col h-fit sticky top-12">
          <SectionTitle 
            title={activeWorkspace === "coding" ? "Coding Projects" : "Design Projects"}
            copy={`${sidebarProjects.length} entities discovered in this workspace.`}
            icon={activeWorkspace === "coding" ? Code : Palette}
          />

          <div className="flex flex-col gap-4">
            <ActionButton variant="secondary" onClick={resetForm}>
              Draft New Entry
              <Plus className="ml-3 inline size-5" strokeWidth={2.5} />
            </ActionButton>
            
            <div className="space-y-4 mt-6">
              {sidebarProjects.map((project) => {
                const isEditing = selectedId === project.id;
                const isWebDesignProject =
                  activeWorkspace === "designing" &&
                  (project.category === "Web Design" || project.type === "FIGMA");
                
                return (
                  <article
                    key={project.id}
                    className={`group relative rounded-[32px] border-2 p-6 transition-all duration-300 ${
                      isEditing
                        ? "border-[#0020d7] bg-white shadow-xl shadow-[#0020d7]/5"
                        : "border-[#e4e4e7] bg-[#f7f4ef]/50 hover:border-[#0020d7]/20 hover:bg-white hover:shadow-lg"
                    }`}
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-[#0020d7]/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#0020d7]">
                              {project.category || (project.type === "CODE" ? "Coding" : "Design")}
                            </span>
                            {isWebDesignProject && project.featured && (
                              <StatusBadge status="success">Main Build</StatusBadge>
                            )}
                          </div>
                          <h4 className={`text-[16px] font-extrabold tracking-tight ${isEditing ? "text-[#0020d7]" : "text-[#0b0b0c]"}`}>
                            {project.title}
                          </h4>
                        </div>
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${isEditing ? "bg-[#0020d7] text-white" : "bg-white border-2 border-[#e4e4e7] text-[#4a4a68]"}`}>
                           {activeWorkspace === "coding" ? <Code size={18} strokeWidth={2.5} /> : <Palette size={18} strokeWidth={2.5} />}
                        </div>
                      </div>

                      <p className="text-[13px] text-[#4a4a68] leading-relaxed font-medium opacity-80 line-clamp-2">
                        {project.description}
                      </p>

                      <div className="flex items-center gap-2 pt-2">
                        {isWebDesignProject && (
                          <TinyButton 
                            variant={project.featured ? "primary" : "default"} 
                            onClick={() => setMainWebDesignProject(project)}
                            disabled={project.featured}
                          >
                            {project.featured ? "Main Build" : "Pin Project"}
                          </TinyButton>
                        )}
                        <TinyButton 
                          variant={isEditing ? "primary" : "default"}
                          onClick={() => isEditing ? resetForm() : selectProject(project)}
                        >
                          {isEditing ? "Discard Edit" : "Configure"}
                        </TinyButton>
                        <TinyButton 
                          variant="danger"
                          onClick={() => deleteProject(project.id)}
                        >
                          <Trash2 size={12} strokeWidth={2.5} />
                        </TinyButton>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {activeWorkspace === "coding" ? (
            <div className="mt-10 border-t-2 border-[#f7f4ef] pt-10">
              <SectionTitle 
                title="Repository Visibility" 
                copy="Control which repositories are projected to the public intelligence layer." 
                icon={Github} 
              />

              <div className="space-y-4">
                {isLoadingGithubRepos ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="rounded-[32px] border-2 border-[#e4e4e7] bg-[#f7f4ef]/30 p-6 animate-pulse"
                    >
                      <div className="h-4 w-2/3 rounded bg-[#e4e4e7]" />
                      <div className="mt-4 h-12 w-full rounded-[18px] bg-[#e4e4e7]" />
                    </div>
                  ))
                ) : githubRepos.length === 0 ? (
                  <div className="rounded-[32px] border-2 border-dashed border-[#e4e4e7] bg-[#f7f4ef]/30 px-6 py-10 text-center">
                    <p className="text-[13px] text-[#4a4a68] font-bold italic opacity-60">No repositories detected in the current cloud.</p>
                  </div>
                ) : (
                  githubRepos.map((repo) => {
                    const isUploadingBanner = uploadingRepoBanner === repo.full_name;

                    return (
                      <article
                        key={repo.full_name}
                        className="group rounded-[32px] border-2 border-[#e4e4e7] bg-[#f7f4ef]/30 p-6 transition-all hover:bg-white hover:shadow-xl"
                      >
                        <div className="flex items-start justify-between gap-6">
                          <div className="min-w-0">
                            <h5 className="truncate text-[15px] font-extrabold text-[#0b0b0c]">
                              {repo.name}
                            </h5>
                            <p className="mt-1 text-[11px] font-extrabold text-[#0020d7] uppercase tracking-widest opacity-60">
                              {repo.full_name}
                            </p>
                            {repo.description && (
                              <p className="mt-3 line-clamp-2 text-[13px] text-[#4a4a68] font-medium leading-relaxed">
                                {repo.description}
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleGithubRepoEnabledToggle(repo)}
                            disabled={repo.isSaving}
                            className={`relative inline-flex h-8 w-14 flex-shrink-0 items-center rounded-full transition-colors duration-300 ${
                              repo.enabled ? "bg-[#0020d7]" : "bg-[#e4e4e7]"
                            } ${repo.isSaving ? "opacity-60" : ""}`}
                          >
                            <span
                              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                                repo.enabled ? "translate-x-7" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>

                        <div className="mt-6">
                          <Field
                            label="Custom Terminal Banner"
                            value={repo.draftImageUrl}
                            onChange={(val) => updateGithubRepoState(repo.full_name, (curr) => ({ ...curr, draftImageUrl: val }))}
                            placeholder="https://... or upload asset"
                            icon={UploadIcon}
                          />
                        </div>

                        <div className="mt-6 flex items-center justify-between gap-4 pt-6 border-t-2 border-[#f7f4ef]">
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 text-[12px] font-extrabold text-[#0020d7] uppercase tracking-widest hover:underline"
                          >
                            <ExternalLink size={14} strokeWidth={2.5} />
                            View Source
                          </a>
                          <TinyButton
                            variant="primary"
                            onClick={() => void handleSaveRepoBanner(repo)}
                            disabled={repo.isSaving}
                          >
                            {repo.isSaving ? "Syncing..." : "Apply Banner"}
                          </TinyButton>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </div>
          ) : null}
        </SectionPanel>

        {/* Project Configuration Workspace */}
        <SectionPanel className="p-10 xl:col-span-8 bg-white/50 backdrop-blur-sm">
          {selectedId ? (
            <div className="mb-8 flex items-center gap-6 rounded-[32px] border-2 border-[#0020d7]/20 bg-[#0020d7]/5 p-6">
              <div className="h-14 w-14 rounded-full bg-[#0020d7] flex items-center justify-center text-white shadow-xl shadow-[#0020d7]/20">
                 <RefreshCw size={28} strokeWidth={2.5} className="animate-spin-slow" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#0020d7]">Calibration Mode</p>
                <h3 className="truncate text-xl font-extrabold text-[#0b0b0c] mt-1">
                  Editing: {projects.find((p) => p.id === selectedId)?.title ?? "Entity"}
                </h3>
              </div>
              <TinyButton onClick={resetForm}>Discard Edit</TinyButton>
            </div>
          ) : (
            <SectionTitle 
              title="Global Project Constructor" 
              copy="Define the architecture and visual narrative for your next masterpiece."
              icon={Plus}
            />
          )}

          <div className="flex gap-4 mb-10">
            <button
              type="button"
              onClick={() => switchWorkspace("coding")}
              className={`flex-1 flex items-center justify-center gap-3 rounded-[24px] border-2 py-5 text-[14px] font-extrabold uppercase tracking-widest transition-all ${
                activeWorkspace === "coding"
                  ? "border-[#0020d7] bg-[#0020d7] text-white shadow-xl shadow-[#0020d7]/20"
                  : "border-[#e4e4e7] bg-[#f7f4ef]/50 text-[#4a4a68] hover:bg-white hover:border-[#0020d7]/20"
              }`}
            >
              <Code size={18} strokeWidth={2.5} />
              Coding Logic
            </button>
            <button
              type="button"
              onClick={() => switchWorkspace("designing")}
              className={`flex-1 flex items-center justify-center gap-3 rounded-[24px] border-2 py-5 text-[14px] font-extrabold uppercase tracking-widest transition-all ${
                activeWorkspace === "designing"
                  ? "border-[#0020d7] bg-[#0020d7] text-white shadow-xl shadow-[#0020d7]/20"
                  : "border-[#e4e4e7] bg-[#f7f4ef]/50 text-[#4a4a68] hover:bg-white hover:border-[#0020d7]/20"
              }`}
            >
              <Palette size={18} strokeWidth={2.5} />
              Visual Design
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
            {/* Dynamic Designing Mode Flow */}
            {form.type !== "CODE" && (
              <div className="md:col-span-2 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <span className="text-[12px] font-extrabold text-[#4a4a68] uppercase tracking-widest px-1">1. Intelligence Category</span>
                    <SelectField
                      label=""
                      value={form.category}
                      onChange={(cat) => {
                        let newType = form.type;
                        let newMediaType = form.mediaType;
                        if (cat === "Web Design") {
                          newType = "FIGMA";
                        } else if (cat === "Motion Graphics" || cat === "VFX & 3D Animation") {
                          newType = "PINTEREST";
                          newMediaType = "VIDEO";
                        } else if (cat === "Graphic design") {
                          newType = "BEHANCE";
                        }
                        setForm((prev) => ({
                          ...prev,
                          category: cat,
                          type: newType,
                          mediaType: newMediaType as ProjectForm["mediaType"],
                        }));
                      }}
                      options={[
                        { label: "Select Category", value: "" },
                        { label: "Graphic design", value: "Graphic design" },
                        { label: "Web Design", value: "Web Design" },
                        { label: "Motion Graphics", value: "Motion Graphics" },
                        { label: "VFX & 3D Animation", value: "VFX & 3D Animation" },
                      ]}
                    />
                  </div>
                  <div className="space-y-4">
                    <span className="text-[12px] font-extrabold text-[#4a4a68] uppercase tracking-widest px-1">2. Target Platform</span>
                    <SelectField
                      label=""
                      value={form.type}
                      onChange={(val) => setForm((prev) => ({ ...prev, type: val as ProjectForm["type"] }))}
                      options={
                        form.category === "Graphic design" ? [
                          { label: "Behance Case Study", value: "BEHANCE" },
                          { label: "Pinterest Pin", value: "PINTEREST" },
                        ] : form.category === "Web Design" ? [
                          { label: "Figma Prototype", value: "FIGMA" },
                          { label: "Behance Case Study", value: "BEHANCE" },
                        ] : form.category === "Motion Graphics" || form.category === "VFX & 3D Animation" ? [
                          { label: "Pinterest Pin", value: "PINTEREST" },
                        ] : [
                          { label: "Behance Case Study", value: "BEHANCE" },
                          { label: "Figma Prototype", value: "FIGMA" },
                          { label: "Pinterest Pin", value: "PINTEREST" },
                        ]
                      }
                    />
                  </div>

                  {form.category && (
                    <div className="md:col-span-2 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500 bg-[#f7f4ef]/50 p-6 rounded-[28px] border-2 border-[#e4e4e7]">
                      <span className="text-[12px] font-extrabold text-[#4a4a68] uppercase tracking-widest px-1">3. External Entity Link</span>
                      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
                        <Field
                          label=""
                          value={form.externalUrl}
                          onChange={(val) => setForm((prev) => ({ ...prev, externalUrl: val }))}
                          placeholder={form.type === "BEHANCE" ? "https://behance.net/..." : "https://..."}
                          icon={Link2}
                        />
                        <div className="pt-1">
                          <ActionButton
                            onClick={handleAIDesignFetch}
                            disabled={isGeneratingContent || !form.externalUrl}
                            className="w-full"
                          >
                            {isGeneratingContent ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <Sparkles size={18} className="text-white" />
                            )}
                            <span className="ml-3">{isGeneratingContent ? "Generating..." : "AI DRAFT"}</span>
                          </ActionButton>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {form.type === "CODE" && (
              <div className="md:col-span-2 space-y-10">
                <div className="rounded-[33px] bg-[#0020d7]/5 border-2 border-[#0020d7]/10 p-8">
                  <div className="space-y-4">
                    <span className="text-[12px] font-extrabold text-[#0020d7] uppercase tracking-widest px-1">
                      1. Intelligence Repository (GitHub)
                    </span>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Field
                          label=""
                          value={form.externalUrl}
                          onChange={(val) => setForm((prev) => ({ ...prev, externalUrl: val }))}
                          onBlur={() => {
                            if (form.externalUrl.includes("github.com")) {
                              handleGithubFetch();
                            }
                          }}
                          placeholder="https://github.com/owner/repo"
                          icon={Github}
                        />
                      </div>
                      <div className="pt-1">
                        <ActionButton
                          onClick={handleGithubFetch}
                          disabled={isFetchingGithub || !form.externalUrl}
                        >
                          {isFetchingGithub ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <RefreshCw size={18} />
                          )}
                          <span className="ml-3">{isFetchingGithub ? "Syncing..." : "SYNC"}</span>
                        </ActionButton>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#0020d7]/60 font-extrabold uppercase tracking-widest px-2">
                      Automated calibration for Title, Narrative, Technologies, and Deployment link.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Core Attribution Fields */}
            {(form.type === "CODE" || form.category) && (
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <Field
                    label="Project Identity"
                    value={form.title}
                    onChange={(val) => setForm((prev) => ({ ...prev, title: val }))}
                    placeholder="Entity Designation"
                    icon={FolderKanban}
                  />
                </div>

                <SelectField
                  label="Visual Medium"
                  value={form.mediaType}
                  onChange={(val) => setForm((prev) => ({ ...prev, mediaType: val as ProjectForm["mediaType"] }))}
                  options={
                    form.type === "CODE" ? [
                      { label: "Static Projection (Image)", value: "IMAGE" },
                      { label: "Kinetic Sequence (GIF)", value: "GIF" },
                    ] : (form.category === "VFX & 3D Animation" || form.category === "Motion Graphics") ? [
                      { label: "High-Frequency Video", value: "VIDEO" },
                      { label: "Spatial Intelligence (3D Model)", value: "MODEL" },
                      { label: "Static Projection (Image)", value: "IMAGE" },
                      { label: "Kinetic Sequence (GIF)", value: "GIF" },
                    ] : [
                      { label: "Static Projection (Image)", value: "IMAGE" },
                      { label: "High-Frequency Video", value: "VIDEO" },
                      { label: "Kinetic Sequence (GIF)", value: "GIF" },
                    ]
                  }
                />

                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <span className="text-[12px] font-extrabold text-[#4a4a68] uppercase tracking-widest">
                      {form.type === "CODE" ? "Projection Thumbnail" : "Main Visual Asset"}
                    </span>
                    {isUploading && <Loader2 size={18} className="animate-spin text-[#0020d7]" />}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
                    <Field
                      label=""
                      value={form.mediaUrl}
                      onChange={(val) => setForm((prev) => ({ ...prev, mediaUrl: val }))}
                      placeholder="https://static.assets..."
                      icon={UploadIcon}
                    />
                    <div className="relative pt-1">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        disabled={isUploading}
                      />
                      <ActionButton variant="secondary" className="w-full">
                        <UploadIcon size={18} strokeWidth={2.5} />
                      </ActionButton>
                    </div>
                  </div>

                  {form.mediaUrl && (
                    <div className="relative mt-6 aspect-video w-full max-w-md overflow-hidden rounded-[28px] border-4 border-[#e4e4e7] bg-[#f7f4ef]/50 shadow-2xl group">
                      {form.mediaType === "VIDEO" ? (
                        <video src={form.mediaUrl} className="h-full w-full object-cover" controls />
                      ) : (
                        <img 
                          src={form.mediaUrl} 
                          alt="Entity Preview" 
                          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Asset+Unavailable"; }}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, mediaUrl: "" }))}
                        className="absolute top-4 right-4 z-20 h-10 w-10 rounded-full bg-black/50 text-white backdrop-blur-md flex items-center justify-center hover:bg-[#ff3b30] transition-colors"
                      >
                        <XIcon size={20} strokeWidth={2.5} />
                      </button>
                    </div>
                  )}
                </div>

                {form.type !== "PINTEREST" && (
                  <Field
                    label={
                      form.type === "BEHANCE" ? "Behance Payload (Embed/URL)" :
                      form.type === "FIGMA" ? "Figma Architecture URL" :
                      form.type === "CODE" ? "Deployment URL (Live Demo)" : "System Embed (Iframe)"
                    }
                    value={form.iframeUrl}
                    onChange={(val) => setForm((prev) => ({ ...prev, iframeUrl: val }))}
                    placeholder="https://deployment..."
                    icon={ExternalLink}
                  />
                )}

                {form.type === "CODE" && (
                  <Field
                    label="Intelligence Stack (Tags)"
                    value={form.tags}
                    onChange={(val) => setForm((prev) => ({ ...prev, tags: val }))}
                    placeholder="React, Next.js, etc."
                    icon={Code}
                  />
                )}

                {form.type !== "CODE" && (
                  <Field
                    label="Brand Signature (Dominant Hex)"
                    value={form.dominantColor}
                    onChange={(val) => setForm((prev) => ({ ...prev, dominantColor: val }))}
                    placeholder="#0020D7"
                    icon={Palette}
                  />
                )}

                <div className="md:col-span-2">
                  <TextareaField
                    label="Strategic Narrative (Description)"
                    value={form.description}
                    onChange={(val) => setForm((prev) => ({ ...prev, description: val }))}
                    placeholder="Brief architectural overview..."
                    icon={FileText}
                    rows={4}
                  />
                </div>

                {form.type !== "CODE" && form.type !== "BEHANCE" && (
                  <div className="md:col-span-2">
                    <TextareaField
                      label="Deep Technical Architecture (Markdown)"
                      value={form.content}
                      onChange={(val) => setForm((prev) => ({ ...prev, content: val }))}
                      placeholder="Comprehensive technical documentation..."
                      icon={FileText}
                      rows={10}
                    />
                  </div>
                )}

                {form.type !== "CODE" && (
                  <div className="md:col-span-2">
                    <Field
                      label="Metadata Attribution (Tags)"
                      value={form.tags}
                      onChange={(val) => setForm((prev) => ({ ...prev, tags: val }))}
                      placeholder="Design, Prototyping, etc."
                      icon={Link2}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-10 flex items-center gap-6 p-8 rounded-[33px] bg-[#f7f4ef]/50 border-2 border-[#e4e4e7]">
            <div className="flex items-center gap-4 text-[#4a4a68]">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
                className="h-6 w-6 rounded-lg border-2 border-[#e4e4e7] text-[#0020d7] focus:ring-[#0020d7]/20"
              />
              <label htmlFor="featured" className="text-[14px] font-extrabold uppercase tracking-widest cursor-pointer select-none">
                {form.category === "Web Design" || form.type === "FIGMA"
                  ? "Elevate to Main Build"
                  : "Highlight as Featured"}
              </label>
            </div>
          </div>

          {/* Persistent Action Bar */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-8">
            <div className="flex items-center justify-between gap-4 p-2.5 rounded-[24px] bg-white/95 border-2 border-[#e4e4e7] shadow-2xl backdrop-blur-md">
              <div className="flex-1 px-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#34c759] shadow-[0_0_8px_rgba(52,199,89,0.4)]" />
                  <p className="text-[11px] font-extrabold text-[#0b0b0c] uppercase tracking-widest opacity-80">Workspace Online</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <TinyButton onClick={resetForm}>Reset</TinyButton>
                <ActionButton
                  onClick={saveProject}
                >
                  {selectedId ? "Sync Updates" : "Deploy Entity"}
                  <Save size={14} strokeWidth={2.5} />
                </ActionButton>
              </div>
            </div>
          </div>
        </SectionPanel>
      </div>
    </AdminSectionWorkspace>
  );
}
