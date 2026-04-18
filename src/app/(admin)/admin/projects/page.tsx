"use client";

import { useEffect, useState } from "react";
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

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectForm>(defaultForm);
  const [isUploading, setIsUploading] = useState(false);
  const [isFetchingGithub, setIsFetchingGithub] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

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

  useEffect(() => {
    queueMicrotask(() => {
      void loadProjects();
    });
  }, []);

  function selectProject(project: Project) {
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
    setForm(defaultForm);
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
      previewPath="/projects"
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section className="rounded-2xl border border-[var(--color-border-light)] bg-white/90 p-5 xl:col-span-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-[#0b0b0c]">Projects</h3>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-1 text-xs text-[var(--color-text-body)]"
            >
              New
            </button>
          </div>

          <div className="space-y-2">
            {projects.map((project) => {
              const isEditing = selectedId === project.id;
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
                    <p className={`text-sm font-semibold ${isEditing ? "text-blue-800" : "text-[#0b0b0c]"}`}>
                      {project.title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-[var(--color-text-body)]">
                      {project.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
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
              onClick={() => setForm((prev) => ({ ...prev, type: "CODE" }))}
              className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition-all ${
                form.type === "CODE"
                  ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                  : "border-[var(--color-border-light)] bg-[#f8f5f2] text-[var(--color-text-body)] hover:bg-white"
              }`}
            >
              💻 Coding Project
            </button>
            <button
              type="button"
              onClick={() => {
                if (form.type === "CODE") setForm((prev) => ({ ...prev, type: "BEHANCE" }));
              }}
              className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition-all ${
                form.type !== "CODE"
                  ? "border-purple-600 bg-purple-50 text-purple-700 shadow-sm"
                  : "border-[var(--color-border-light)] bg-[#f8f5f2] text-[var(--color-text-body)] hover:bg-white"
              }`}
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

                {form.type !== "BEHANCE" && (
                  <label className="space-y-2 text-sm md:col-span-2">
                    <span className="text-[var(--color-text-body)] flex items-center justify-between">
                      <span>
                        {form.type === "CODE"
                          ? "Project Thumbnail (Image or GIF)"
                          : "Media Asset (URL or Upload)"}
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
            Featured project
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
