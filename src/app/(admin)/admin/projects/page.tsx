"use client";

import { useEffect, useState } from "react";
import AdminSectionWorkspace from "@/components/admin/AdminSectionWorkspace";

type Project = {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  demoUrl: string | null;
  githubUrl: string | null;
  tags: string[];
  featured: boolean;
  createdAt: string;
};

type ProjectForm = {
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  demoUrl: string;
  githubUrl: string;
  tags: string;
  featured: boolean;
};

const defaultForm: ProjectForm = {
  title: "",
  description: "",
  content: "",
  imageUrl: "",
  demoUrl: "",
  githubUrl: "",
  tags: "",
  featured: false,
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectForm>(defaultForm);
  const [status, setStatus] = useState<string | null>(null);

  async function loadProjects() {
    const response = await fetch("/api/admin/projects", { cache: "no-store" });
    if (!response.ok) {
      return;
    }

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
      content: project.content,
      imageUrl: project.imageUrl,
      demoUrl: project.demoUrl || "",
      githubUrl: project.githubUrl || "",
      tags: project.tags.join(", "),
      featured: project.featured,
    });
  }

  function resetForm() {
    setSelectedId(null);
    setForm(defaultForm);
  }

  function parsePayload() {
    return {
      title: form.title,
      description: form.description,
      content: form.content,
      imageUrl: form.imageUrl,
      demoUrl: form.demoUrl.trim() || null,
      githubUrl: form.githubUrl.trim() || null,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      featured: form.featured,
    };
  }

  async function saveProject() {
    setStatus("Saving project...");

    const method = selectedId ? "PUT" : "POST";
    const url = selectedId ? `/api/admin/projects/${selectedId}` : "/api/admin/projects";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsePayload()),
    });

    if (!response.ok) {
      setStatus("Project save failed.");
      return;
    }

    await loadProjects();
    setStatus("Project saved.");

    if (!selectedId) {
      resetForm();
    }
  }

  async function deleteProject(id: string) {
    const response = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setStatus("Delete failed.");
      return;
    }

    if (selectedId === id) {
      resetForm();
    }

    await loadProjects();
    setStatus("Project deleted.");
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
            {projects.map((project) => (
              <article
                key={project.id}
                className={`rounded-lg border p-3 ${
                  selectedId === project.id
                    ? "border-[var(--color-border-medium)] bg-[#eef2ff]"
                    : "border-[var(--color-border-light)] bg-[#f8f5f2]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => selectProject(project)}
                  className="w-full text-left"
                >
                  <p className="text-sm font-medium text-[#0b0b0c]">{project.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-[var(--color-text-body)]">{project.description}</p>
                </button>
                <button
                  type="button"
                  onClick={() => deleteProject(project.id)}
                  className="mt-3 rounded border border-red-300 bg-red-50 px-2 py-1 text-xs text-red-700"
                >
                  Delete
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--color-border-light)] bg-white/90 p-6 xl:col-span-8">
          <h3 className="text-lg font-medium text-[#0b0b0c]">
            {selectedId ? "Edit Project" : "Create Project"}
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="text-[var(--color-text-body)]">Title</span>
              <input
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="text-[var(--color-text-body)]">Image URL</span>
              <input
                value={form.imageUrl}
                onChange={(event) => setForm({ ...form, imageUrl: event.target.value })}
                className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
              />
            </label>

            <label className="space-y-2 text-sm md:col-span-2">
              <span className="text-[var(--color-text-body)]">Short Description</span>
              <textarea
                rows={3}
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
              />
            </label>

            <label className="space-y-2 text-sm md:col-span-2">
              <span className="text-[var(--color-text-body)]">Detailed Content</span>
              <textarea
                rows={6}
                value={form.content}
                onChange={(event) => setForm({ ...form, content: event.target.value })}
                className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="text-[var(--color-text-body)]">Demo URL</span>
              <input
                value={form.demoUrl}
                onChange={(event) => setForm({ ...form, demoUrl: event.target.value })}
                className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="text-[var(--color-text-body)]">GitHub URL</span>
              <input
                value={form.githubUrl}
                onChange={(event) => setForm({ ...form, githubUrl: event.target.value })}
                className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
              />
            </label>

            <label className="space-y-2 text-sm md:col-span-2">
              <span className="text-[var(--color-text-body)]">Tags (comma separated)</span>
              <input
                value={form.tags}
                onChange={(event) => setForm({ ...form, tags: event.target.value })}
                className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
              />
            </label>
          </div>

          <label className="mt-4 inline-flex items-center gap-2 text-sm text-[#0b0b0c]">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) => setForm({ ...form, featured: event.target.checked })}
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

          {status ? <p className="mt-3 text-xs text-[var(--color-text-body)]">{status}</p> : null}
        </section>
      </div>
    </AdminSectionWorkspace>
  );
}
