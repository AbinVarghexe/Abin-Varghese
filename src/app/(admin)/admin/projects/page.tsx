"use client";

import { useEffect, useMemo, useState } from "react";
import AdminSectionWorkspace from "@/components/admin/AdminSectionWorkspace";
import { uploadToStorage } from "@/lib/supabase";
import { Upload as UploadIcon, X as XIcon, Loader2, Sparkles, Pencil, AlertCircle } from "lucide-react";
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
      sectionLabel="Project Section"
      sectionTitle="Project CRUD Management"
      sectionDescription="Add new projects, edit existing entries, and control featured work visibility."
      previewPath={activeWorkspace === "coding" ? "/projects?workspace=coding" : "/projects?workspace=designing"}
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section className="rounded-2xl border border-[var(--color-border-light)] bg-white/90 p-5 xl:col-span-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-[#0b0b0c]">
                {activeWorkspace === "coding" ? "Coding Projects" : "Designing Projects"}
              </h3>
              <p className="mt-1 text-xs text-[var(--color-text-body)]">
                {sidebarProjects.length} item{sidebarProjects.length === 1 ? "" : "s"} in this workspace
              </p>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-1 text-xs text-[var(--color-text-body)]"
            >
              New
            </button>
          </div>

          <div className="space-y-2">
            {sidebarProjects.map((project) => {
              const isEditing = selectedId === project.id;
              const isWebDesignProject =
                activeWorkspace === "designing" &&
                (project.category === "Web Design" || project.type === "FIGMA");
              return (
                <article
                  key={project.id}
                  className={`rounded-xl border p-3 transition-all ${
                    isEditing
                      ? "border-blue-400 bg-blue-50 ring-2 ring-blue-200 shadow-sm"
                      : "border-[var(--color-border-light)] bg-[#f8f5f2] hover:border-[var(--color-border-medium)] hover:bg-white"
                  }`}
                >
                  {/* Project info */}
                  <div className="mb-2">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <p className={`text-sm font-semibold ${isEditing ? "text-blue-800" : "text-[#0b0b0c]"}`}>
                        {project.title}
                      </p>
                      <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-600">
                        {project.category || (project.type === "CODE" ? "Coding" : "Design")}
                      </span>
                      {isWebDesignProject && project.featured ? (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700">
                          Main
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-xs text-[var(--color-text-body)]">
                      {project.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    {isWebDesignProject ? (
                      <button
                        type="button"
                        onClick={() => setMainWebDesignProject(project)}
                        disabled={project.featured}
                        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                          project.featured
                            ? "border-blue-200 bg-blue-50 text-blue-500 cursor-default"
                            : "border-blue-200 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                        }`}
                      >
                        <Sparkles size={11} />
                        {project.featured ? "Main Project" : "Set as Main"}
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => isEditing ? resetForm() : selectProject(project)}
                      className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                        isEditing
                          ? "border-blue-400 bg-blue-100 text-blue-700 hover:bg-blue-200"
                          : "border-[var(--color-border-light)] bg-white text-[#0b0b0c] hover:bg-[#eef2ff] hover:border-blue-300 hover:text-blue-700"
                      }`}
                    >
                      <Pencil size={11} />
                      {isEditing ? "Cancel Edit" : "Edit"}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteProject(project.id)}
                      className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-all hover:bg-red-100 hover:border-red-300"
                    >
                      <XIcon size={11} />
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {activeWorkspace === "coding" ? (
            <div className="mt-6 border-t border-[var(--color-border-light)] pt-5">
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-[#0b0b0c]">Repository Visibility</h4>
                <p className="mt-1 text-xs text-[var(--color-text-body)]">
                  Turn repositories on or off for the public coding section and set a custom banner for each one.
                </p>
              </div>

              <div className="space-y-3">
                {isLoadingGithubRepos ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] p-3"
                    >
                      <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-200" />
                      <div className="mt-2 h-3 w-full animate-pulse rounded bg-zinc-200" />
                      <div className="mt-3 h-9 w-full animate-pulse rounded-xl bg-zinc-200" />
                    </div>
                  ))
                ) : githubRepos.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[var(--color-border-light)] bg-[#f8f5f2] px-4 py-6 text-center text-xs text-[var(--color-text-body)]">
                    No GitHub repositories were found for the coding section.
                  </div>
                ) : (
                  githubRepos.map((repo) => {
                    const isUploadingBanner = uploadingRepoBanner === repo.full_name;

                    return (
                      <article
                        key={repo.full_name}
                        className="rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#0b0b0c]">
                              {repo.name}
                            </p>
                            <p className="mt-1 text-[11px] text-[var(--color-text-body)]">
                              {repo.full_name}
                            </p>
                            {repo.description ? (
                              <p className="mt-2 line-clamp-2 text-xs text-[var(--color-text-body)]">
                                {repo.description}
                              </p>
                            ) : null}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleGithubRepoEnabledToggle(repo)}
                            disabled={repo.isSaving}
                            className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition ${
                              repo.enabled ? "bg-blue-600" : "bg-zinc-300"
                            } ${repo.isSaving ? "opacity-60" : ""}`}
                            aria-pressed={repo.enabled}
                            aria-label={`Toggle ${repo.name} visibility`}
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                                repo.enabled ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>

                        <div className="mt-3">
                          <label className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[var(--color-text-body)]">
                            Custom banner
                          </label>
                          <div className="flex gap-2">
                            <input
                              value={repo.draftImageUrl}
                              onChange={(e) =>
                                updateGithubRepoState(repo.full_name, (current) => ({
                                  ...current,
                                  draftImageUrl: e.target.value,
                                }))
                              }
                              placeholder="https://... or upload an image"
                              className="w-full rounded-xl border border-[var(--color-border-light)] bg-white px-3 py-2 text-xs text-[#0b0b0c]"
                            />
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => void handleRepoBannerUpload(repo, e)}
                                className="absolute inset-0 cursor-pointer opacity-0"
                                disabled={isUploadingBanner}
                              />
                              <button
                                type="button"
                                className="flex h-full items-center rounded-xl border border-[var(--color-border-light)] bg-white px-3 hover:bg-[#f8f5f2]"
                              >
                                {isUploadingBanner ? (
                                  <Loader2 size={14} className="animate-spin text-blue-500" />
                                ) : (
                                  <UploadIcon size={14} className="text-gray-500" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2">
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-medium text-blue-700 underline-offset-4 hover:underline"
                          >
                            Open repository
                          </a>
                          <button
                            type="button"
                            onClick={() => void handleSaveRepoBanner(repo)}
                            disabled={repo.isSaving}
                            className="rounded-lg border border-[var(--color-border-light)] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#0b0b0c] hover:bg-[#eef2ff] disabled:opacity-60"
                          >
                            {repo.isSaving ? "Saving..." : "Save Banner"}
                          </button>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </div>
          ) : null}
        </section>

        <section className="rounded-2xl border border-[var(--color-border-light)] bg-white/90 p-6 xl:col-span-8">
          {/* Edit-mode banner */}
          {selectedId ? (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-blue-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-blue-800">Editing project</p>
                <p className="truncate text-xs text-blue-600 mt-0.5">
                  {projects.find((p) => p.id === selectedId)?.title ?? ""}
                </p>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="ml-auto flex-shrink-0 rounded-lg border border-blue-200 bg-white px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
              >
                Discard
              </button>
            </div>
          ) : (
            <h3 className="mb-5 text-lg font-medium text-[#0b0b0c]">Create New Project</h3>
          )}

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => switchWorkspace("coding")}
              className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition-all ${
                activeWorkspace === "coding"
                  ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                  : "border-[var(--color-border-light)] bg-[#f8f5f2] text-[var(--color-text-body)] hover:bg-white"
              }`}
              aria-pressed={activeWorkspace === "coding"}
            >
              💻 Coding Project
            </button>
            <button
              type="button"
              onClick={() => switchWorkspace("designing")}
              className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition-all ${
                activeWorkspace === "designing"
                  ? "border-purple-600 bg-purple-50 text-purple-700 shadow-sm"
                  : "border-[var(--color-border-light)] bg-[#f8f5f2] text-[var(--color-text-body)] hover:bg-white"
              }`}
              aria-pressed={activeWorkspace === "designing"}
            >
              🎨 Designing Project
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Dynamic Designing Mode Flow */}
            {form.type !== "CODE" && (
              <div className="md:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl bg-zinc-50 border border-zinc-200 p-4">
                  <div className="space-y-2 text-sm">
                    <span className="font-semibold text-zinc-900">1. Select Design Category</span>
                    <select
                      value={form.category}
                      onChange={(e) => {
                        const cat = e.target.value;
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
                      className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-[#0b0b0c]"
                    >
                      <option value="">Select Category</option>
                      <option value="Graphic design">Graphic design</option>
                      <option value="Web Design">Web Design</option>
                      <option value="Motion Graphics">Motion Graphics</option>
                      <option value="VFX & 3D Animation">VFX &amp; 3D Animation</option>
                    </select>
                  </div>
                  <div className="space-y-2 text-sm">
                    <span className="font-semibold text-zinc-900">2. Platform</span>
                    <select
                      value={form.type}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, type: e.target.value as ProjectForm["type"] }))
                      }
                      className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-[#0b0b0c]"
                    >
                      {form.category === "Graphic design" ? (
                        <>
                          <option value="BEHANCE">Behance Case Study</option>
                          <option value="PINTEREST">Pinterest Pin</option>
                        </>
                      ) : form.category === "Web Design" ? (
                        <>
                          <option value="FIGMA">Figma Prototype</option>
                          <option value="BEHANCE">Behance Case Study</option>
                        </>
                      ) : form.category === "Motion Graphics" ||
                        form.category === "VFX & 3D Animation" ? (
                        <option value="PINTEREST">Pinterest Pin</option>
                      ) : (
                        <>
                          <option value="BEHANCE">Behance Case Study</option>
                          <option value="FIGMA">Figma Prototype</option>
                          <option value="PINTEREST">Pinterest Pin</option>
                        </>
                      )}
                    </select>
                  </div>

                  {form.category && (
                    <div className="md:col-span-2 space-y-2 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                      <span className="font-semibold text-zinc-900">3. Paste Project Link</span>
                      <div className="flex gap-2">
                        <input
                          value={form.externalUrl}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, externalUrl: e.target.value }))
                          }
                          placeholder={
                            form.type === "BEHANCE" ? "https://behance.net/..." : "https://..."
                          }
                          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-[#0b0b0c]"
                        />
                        <button
                          type="button"
                          onClick={handleAIDesignFetch}
                          disabled={isGeneratingContent || !form.externalUrl}
                          className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-zinc-800 disabled:opacity-50"
                        >
                          {isGeneratingContent ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Sparkles size={14} className="text-amber-400" />
                          )}
                          {isGeneratingContent ? "Generating..." : "Fetch & AI Draft"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {form.type === "CODE" && (
              <div className="md:col-span-2 space-y-6">
                <div className="rounded-2xl bg-blue-50/50 border border-blue-100 p-4">
                  <div className="space-y-2 text-sm">
                    <span className="font-semibold text-blue-900">
                      1. Paste GitHub Repository URL
                    </span>
                    <div className="flex gap-2">
                      <input
                        value={form.externalUrl}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, externalUrl: e.target.value }))
                        }
                        onBlur={() => {
                          if (form.externalUrl.includes("github.com")) {
                            handleGithubFetch();
                          }
                        }}
                        placeholder="https://github.com/owner/repo"
                        className="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm text-[#0b0b0c]"
                      />
                      <button
                        type="button"
                        onClick={handleGithubFetch}
                        disabled={isFetchingGithub || !form.externalUrl}
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-blue-700 disabled:opacity-50 shadow-sm"
                      >
                        {isFetchingGithub ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Sparkles size={14} className="text-white" />
                        )}
                        {isFetchingGithub ? "Fetching..." : "Fetch & Sync"}
                      </button>
                    </div>
                    <p className="text-[10px] text-blue-600/70 font-medium px-1">
                      This will automatically draft your Title, Description, Tags, and Live Link.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-fields shown after category/fetch or for CODE mode */}
            {(form.type === "CODE" || form.category) && (
              <>
                <label className="space-y-2 text-sm md:col-span-2">
                  <span className="text-[var(--color-text-body)]">Project Title</span>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="My Awesome Project"
                    className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
                  />
                </label>

                <div className="space-y-2 text-sm">
                  <span className="text-[var(--color-text-body)]">Media Type</span>
                  <select
                    value={form.mediaType}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        mediaType: e.target.value as ProjectForm["mediaType"],
                      }))
                    }
                    className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
                  >
                    {form.type === "CODE" ? (
                      <>
                        <option value="IMAGE">Static Image</option>
                        <option value="GIF">Animated GIF</option>
                      </>
                    ) : form.category === "VFX & 3D Animation" ||
                      form.category === "Motion Graphics" ? (
                      <>
                        <option value="VIDEO">Video</option>
                        <option value="MODEL">3D Model (GLB/GLTF)</option>
                        <option value="IMAGE">Static Image</option>
                        <option value="GIF">Animated GIF</option>
                      </>
                    ) : (
                      <>
                        <option value="IMAGE">Static Image</option>
                        <option value="VIDEO">Video</option>
                        <option value="GIF">Animated GIF</option>
                      </>
                    )}
                  </select>
                </div>

                {(form.type === "CODE" || Boolean(form.category)) && (
                  <label className="space-y-2 text-sm md:col-span-2">
                    <span className="text-[var(--color-text-body)] flex items-center justify-between">
                      <span>
                        {form.type === "CODE"
                          ? "Project Thumbnail (Image or GIF)"
                          : "Cover Image / Media Asset"}
                      </span>
                      {isUploading && <Loader2 size={14} className="animate-spin text-blue-500" />}
                    </span>
                    <div className="flex gap-2">
                      <input
                        value={form.mediaUrl}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, mediaUrl: e.target.value }))
                        }
                        placeholder="https://..."
                        className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
                      />
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          disabled={isUploading}
                        />
                        <button
                          type="button"
                          className="flex h-full items-center rounded-xl border border-[var(--color-border-light)] bg-white px-3 hover:bg-[#f8f5f2]"
                        >
                          <UploadIcon size={16} className="text-gray-500" />
                        </button>
                      </div>
                    </div>

                    {/* Media Preview — handles IMAGE, GIF, and VIDEO */}
                    {form.mediaUrl && (
                      <div className="relative mt-2 aspect-video w-full max-w-[220px] overflow-hidden rounded-lg border bg-black/5">
                        {form.mediaType === "VIDEO" ? (
                          <video
                            src={form.mediaUrl}
                            className="h-full w-full object-cover"
                            controls
                          />
                        ) : (
                          <img
                            src={form.mediaUrl}
                            alt="Preview"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://placehold.co/600x400?text=Preview+Unavailable";
                            }}
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, mediaUrl: "" }))}
                          className="absolute top-1 right-1 z-10 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                        >
                          <XIcon size={12} />
                        </button>
                      </div>
                    )}
                  </label>
                )}

                {form.type !== "PINTEREST" && (
                  <label className="space-y-2 text-sm">
                    <span className="text-[var(--color-text-body)]">
                      {form.type === "BEHANCE"
                        ? "Behance Embed Code/URL"
                        : form.type === "FIGMA"
                        ? "Figma Prototype URL"
                        : form.type === "CODE"
                        ? "Live Demo / Website URL"
                        : "Embed URL (Iframe)"}
                    </span>
                    <input
                      value={form.iframeUrl}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, iframeUrl: e.target.value }))
                      }
                      placeholder="https://..."
                      className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
                    />
                  </label>
                )}

                {form.type === "CODE" && (
                  <label className="space-y-2 text-sm">
                    <span className="text-[var(--color-text-body)]">Technologies / Tags</span>
                    <input
                      value={form.tags}
                      onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
                      placeholder="React, Next.js, etc."
                      className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
                    />
                  </label>
                )}

                {form.type !== "CODE" && (
                  <label className="space-y-2 text-sm">
                    <span className="text-[var(--color-text-body)]">Dominant Color (Hex)</span>
                    <input
                      value={form.dominantColor}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, dominantColor: e.target.value }))
                      }
                      placeholder="#1a1a1a"
                      className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
                    />
                  </label>
                )}

                {form.type !== "BEHANCE" && (
                  <label className="space-y-2 text-sm md:col-span-2">
                    <span className="text-[var(--color-text-body)]">Short Description</span>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, description: e.target.value }))
                      }
                      className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
                    />
                  </label>
                )}

                {form.type !== "CODE" && form.type !== "BEHANCE" && (
                  <label className="space-y-2 text-sm md:col-span-2">
                    <span className="text-[var(--color-text-body)]">
                      Detailed Case Study (Markdown)
                    </span>
                    <textarea
                      rows={10}
                      value={form.content}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, content: e.target.value }))
                      }
                      className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
                    />
                  </label>
                )}

                {form.type !== "CODE" && (
                  <label className="space-y-2 text-sm md:col-span-2">
                    <span className="text-[var(--color-text-body)]">Tags (comma separated)</span>
                    <input
                      value={form.tags}
                      onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
                      className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
                    />
                  </label>
                )}
              </>
            )}
          </div>

          <label className="mt-4 inline-flex items-center gap-2 text-sm text-[#0b0b0c]">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
            />
            {form.category === "Web Design" || form.type === "FIGMA"
              ? "Main project in Web Design section"
              : "Featured project"}
          </label>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={saveProject}
              className="rounded-full border-[2px] border-[var(--color-border-dark)] bg-[#dbe7ff] px-5 py-2 text-sm font-medium text-[#0020d7] shadow-[0_8px_18px_rgba(0,32,215,0.14)]"
            >
              {selectedId ? "Update Project" : "Create Project"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-[var(--color-border-light)] bg-[#f8f5f2] px-4 py-2 text-sm text-[var(--color-text-body)]"
            >
              Reset
            </button>
          </div>
        </section>
      </div>
    </AdminSectionWorkspace>
  );
}
