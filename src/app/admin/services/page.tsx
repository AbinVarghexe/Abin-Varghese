"use client";

import { useEffect, useMemo, useState } from "react";
import type { Service, ServiceContent } from "@/constants/services";
import AdminSectionWorkspace from "@/components/admin/AdminSectionWorkspace";

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
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadServices() {
      const response = await fetch("/api/admin/services", { cache: "no-store" });
      if (!response.ok) {
        return;
      }

      const data = await response.json();
      const loadedServices: Service[] = data.services || [];
      setServices(loadedServices);
      if (loadedServices[0]) {
        setSelectedServiceId(loadedServices[0].id);
      }
    }

    queueMicrotask(() => {
      void loadServices();
    });
  }, []);

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId) || null,
    [services, selectedServiceId]
  );

  const projectItems = useMemo(
    () =>
      (selectedService?.contents || [])
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => item.type === "project"),
    [selectedService]
  );

  const selectedProject = projectItems[selectedProjectIndex]?.item;

  function updateSelectedService(patch: Partial<Service>) {
    if (!selectedService) {
      return;
    }

    setServices((current) =>
      current.map((service) =>
        service.id === selectedService.id
          ? {
              ...service,
              ...patch,
            }
          : service
      )
    );
  }

  function updateSelectedProject(patch: Partial<ServiceContent>) {
    if (!selectedService || !selectedProject) {
      return;
    }

    const targetIndex = projectItems[selectedProjectIndex]?.index;
    if (targetIndex === undefined) {
      return;
    }

    setServices((current) =>
      current.map((service) => {
        if (service.id !== selectedService.id) {
          return service;
        }

        const nextContents = [...(service.contents || [])];
        nextContents[targetIndex] = {
          ...nextContents[targetIndex],
          ...patch,
        };

        return {
          ...service,
          contents: nextContents,
        };
      })
    );
  }

  function addProjectShowcase() {
    if (!selectedService) {
      return;
    }

    setServices((current) =>
      current.map((service) => {
        if (service.id !== selectedService.id) {
          return service;
        }

        return {
          ...service,
          contents: [...(service.contents || []), defaultProjectContent],
        };
      })
    );

    setSelectedProjectIndex(projectItems.length);
  }

  function removeProjectShowcase(indexInFiltered: number) {
    if (!selectedService) {
      return;
    }

    const targetIndex = projectItems[indexInFiltered]?.index;
    if (targetIndex === undefined) {
      return;
    }

    setServices((current) =>
      current.map((service) => {
        if (service.id !== selectedService.id) {
          return service;
        }

        const nextContents = [...(service.contents || [])];
        nextContents.splice(targetIndex, 1);

        return {
          ...service,
          contents: nextContents,
        };
      })
    );

    setSelectedProjectIndex(0);
  }

  async function saveServices() {
    setStatus("Saving service section...");

    const response = await fetch("/api/admin/services", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ services }),
    });

    if (!response.ok) {
      setStatus("Save failed.");
      return;
    }

    setStatus("Service section saved.");
  }

  if (!selectedService) {
    return <div className="text-sm text-[var(--color-text-body)]">Loading service section...</div>;
  }

  return (
    <AdminSectionWorkspace
      sectionLabel="Service Section"
      sectionTitle="Services and Subsection Projects"
      sectionDescription="Edit each service and manage project showcase cards shown inside service details pages."
      previewPath="/services"
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section className="rounded-2xl border border-[var(--color-border-light)] bg-white/90 p-5 xl:col-span-3">
          <h3 className="text-lg font-medium text-[#0b0b0c]">Services</h3>
          <div className="mt-4 space-y-2">
            {services.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => {
                  setSelectedServiceId(service.id);
                  setSelectedProjectIndex(0);
                }}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                  selectedServiceId === service.id
                    ? "border-[var(--color-border-medium)] bg-[#eef2ff] text-[#0b0b0c]"
                    : "border-[var(--color-border-light)] bg-[#f8f5f2] text-[var(--color-text-body)]"
                }`}
              >
                {service.title}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--color-border-light)] bg-white/90 p-6 xl:col-span-9">
          <h3 className="text-lg font-medium text-[#0b0b0c]">Service Details</h3>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="text-[var(--color-text-body)]">Title</span>
              <input
                value={selectedService.title}
                onChange={(event) => updateSelectedService({ title: event.target.value })}
                className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="text-[var(--color-text-body)]">Accent Color</span>
              <input
                value={selectedService.accentColor}
                onChange={(event) => updateSelectedService({ accentColor: event.target.value })}
                className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
              />
            </label>

            <label className="space-y-2 text-sm md:col-span-2">
              <span className="text-[var(--color-text-body)]">Description</span>
              <textarea
                rows={3}
                value={selectedService.description}
                onChange={(event) => updateSelectedService({ description: event.target.value })}
                className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
              />
            </label>

            <label className="space-y-2 text-sm md:col-span-2">
              <span className="text-[var(--color-text-body)]">Detailed Description</span>
              <textarea
                rows={4}
                value={selectedService.detailedDescription}
                onChange={(event) =>
                  updateSelectedService({ detailedDescription: event.target.value })
                }
                className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
              />
            </label>

            <label className="space-y-2 text-sm md:col-span-2">
              <span className="text-[var(--color-text-body)]">Provided Services (one per line)</span>
              <textarea
                rows={4}
                value={selectedService.providedServices.join("\n")}
                onChange={(event) =>
                  updateSelectedService({
                    providedServices: event.target.value
                      .split("\n")
                      .map((item) => item.trim())
                      .filter(Boolean),
                  })
                }
                className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
              />
            </label>
          </div>

          <div className="mt-8 rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="text-sm font-semibold text-[#0b0b0c]">Showcase Subsection Projects</h4>
              <button
                type="button"
                onClick={addProjectShowcase}
                className="rounded-full border border-[var(--color-border-light)] bg-white px-3 py-1 text-xs text-[var(--color-text-body)]"
              >
                Add Project
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
              <div className="space-y-2 lg:col-span-4">
                {projectItems.map(({ item }, index) => (
                  <div key={`${item.title}-${index}`} className="rounded-lg border border-[var(--color-border-light)] bg-white p-2">
                    <button
                      type="button"
                      onClick={() => setSelectedProjectIndex(index)}
                      className={`w-full rounded px-2 py-1 text-left text-xs ${
                        selectedProjectIndex === index
                          ? "bg-[#eef2ff] text-[#0b0b0c]"
                          : "text-[var(--color-text-body)]"
                      }`}
                    >
                      {item.title || `Project ${index + 1}`}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeProjectShowcase(index)}
                      className="mt-2 rounded border border-red-300 bg-red-50 px-2 py-1 text-[10px] text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-3 lg:col-span-8">
                {selectedProject ? (
                  <>
                    <label className="space-y-1 text-xs">
                      <span className="text-[var(--color-text-body)]">Title</span>
                      <input
                        value={selectedProject.title}
                        onChange={(event) => updateSelectedProject({ title: event.target.value })}
                        className="w-full rounded-lg border border-[var(--color-border-light)] bg-white px-2 py-1.5 text-sm text-[#0b0b0c]"
                      />
                    </label>

                    <label className="space-y-1 text-xs">
                      <span className="text-[var(--color-text-body)]">Description</span>
                      <textarea
                        rows={3}
                        value={selectedProject.description}
                        onChange={(event) =>
                          updateSelectedProject({ description: event.target.value })
                        }
                        className="w-full rounded-lg border border-[var(--color-border-light)] bg-white px-2 py-1.5 text-sm text-[#0b0b0c]"
                      />
                    </label>

                    <label className="space-y-1 text-xs">
                      <span className="text-[var(--color-text-body)]">Mockup Image URL</span>
                      <input
                        value={selectedProject.mockupImage || ""}
                        onChange={(event) =>
                          updateSelectedProject({ mockupImage: event.target.value })
                        }
                        className="w-full rounded-lg border border-[var(--color-border-light)] bg-white px-2 py-1.5 text-sm text-[#0b0b0c]"
                      />
                    </label>

                    <label className="space-y-1 text-xs">
                      <span className="text-[var(--color-text-body)]">Video URL</span>
                      <input
                        value={selectedProject.videoUrl || ""}
                        onChange={(event) => updateSelectedProject({ videoUrl: event.target.value })}
                        className="w-full rounded-lg border border-[var(--color-border-light)] bg-white px-2 py-1.5 text-sm text-[#0b0b0c]"
                      />
                    </label>

                    <label className="space-y-1 text-xs">
                      <span className="text-[var(--color-text-body)]">Tech Stack (comma separated)</span>
                      <input
                        value={(selectedProject.techStack || []).join(", ")}
                        onChange={(event) =>
                          updateSelectedProject({
                            techStack: event.target.value
                              .split(",")
                              .map((tag) => tag.trim())
                              .filter(Boolean),
                          })
                        }
                        className="w-full rounded-lg border border-[var(--color-border-light)] bg-white px-2 py-1.5 text-sm text-[#0b0b0c]"
                      />
                    </label>
                  </>
                ) : (
                  <p className="text-xs text-[var(--color-text-body)]">No project selected.</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={saveServices}
              className="rounded-full border-[2px] border-[var(--color-border-dark)] bg-[#dbe7ff] px-5 py-2 text-sm font-medium text-[#0020d7] shadow-[0_8px_18px_rgba(0,32,215,0.14)]"
            >
              Save Service Section
            </button>
          </div>

          {status ? <p className="mt-3 text-xs text-[var(--color-text-body)]">{status}</p> : null}
        </section>
      </div>
    </AdminSectionWorkspace>
  );
}
