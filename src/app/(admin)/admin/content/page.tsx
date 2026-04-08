"use client";

import { useEffect, useState, type ReactNode } from "react";
import AdminSectionWorkspace from "@/components/admin/AdminSectionWorkspace";
import {
  siteCopyDefaults,
  type SiteCopyComparisonFeature,
  type SiteCopyContent,
  type SiteCopyCreativeCategory,
  type SiteCopyFaqItem,
  type SiteCopyReviewItem,
  type SiteCopyTimelineEntry,
} from "@/lib/site-copy-content";

type ArraySectionProps<T> = {
  title: string;
  description?: string;
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: T, index: number) => ReactNode;
};

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--color-border-light)] bg-white/90 p-6">
      <h3 className="text-lg font-medium text-[#0b0b0c]">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--color-text-body)]">
          {description}
        </p>
      ) : null}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function FieldLabel({
  label,
  hint,
}: {
  label: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <span className="block text-sm text-[var(--color-text-body)]">{label}</span>
      {hint ? <p className="text-xs text-[var(--color-text-body)]/80">{hint}</p> : null}
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  return (
    <label className="space-y-2 text-sm">
      <FieldLabel label={label} hint={hint} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
      />
    </label>
  );
}

function TextAreaInput({
  label,
  value,
  onChange,
  rows = 4,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="space-y-2 text-sm">
      <FieldLabel label={label} hint={hint} />
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
      />
    </label>
  );
}

function ArraySection<T>({
  title,
  description,
  items,
  onAdd,
  onRemove,
  renderItem,
}: ArraySectionProps<T>) {
  return (
    <div className="rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-[#0b0b0c]">{title}</h4>
          {description ? (
            <p className="mt-1 text-xs text-[var(--color-text-body)]">{description}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-full border border-[var(--color-border-light)] bg-white px-3 py-1 text-xs text-[var(--color-text-body)]"
        >
          Add Item
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {items.map((item, index) => (
          <div key={index} className="rounded-xl border border-[var(--color-border-light)] bg-white p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-body)]">
                Item {index + 1}
              </span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="rounded-full border border-red-300 bg-red-50 px-3 py-1 text-xs text-red-700"
              >
                Remove
              </button>
            </div>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminContentPage() {
  const [siteCopy, setSiteCopy] = useState<SiteCopyContent>(siteCopyDefaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      try {
        const response = await fetch("/api/admin/site-copy", { cache: "no-store" });
        if (!response.ok) {
          setStatus("Failed to load site copy.");
          return;
        }

        const data = await response.json();
        setSiteCopy(data.siteCopy || siteCopyDefaults);
      } finally {
        setLoading(false);
      }
    }

    queueMicrotask(() => {
      void loadData();
    });
  }, []);

  function patch<K extends keyof SiteCopyContent>(key: K, value: SiteCopyContent[K]) {
    setSiteCopy((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function updateArrayItem<K extends keyof SiteCopyContent, T extends SiteCopyContent[K] extends Array<infer U> ? U : never>(
    key: K,
    index: number,
    value: T
  ) {
    setSiteCopy((current) => {
      const items = [...(current[key] as T[])];
      items[index] = value;
      return {
        ...current,
        [key]: items,
      };
    });
  }

  function addArrayItem<K extends keyof SiteCopyContent, T extends SiteCopyContent[K] extends Array<infer U> ? U : never>(
    key: K,
    value: T
  ) {
    setSiteCopy((current) => ({
      ...current,
      [key]: [...(current[key] as T[]), value],
    }));
  }

  function removeArrayItem<K extends keyof SiteCopyContent, T extends SiteCopyContent[K] extends Array<infer U> ? U : never>(
    key: K,
    index: number
  ) {
    setSiteCopy((current) => ({
      ...current,
      [key]: (current[key] as T[]).filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  async function saveSiteCopy() {
    setSaving(true);
    setStatus("Saving site copy...");

    try {
      const response = await fetch("/api/admin/site-copy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteCopy }),
      });

      if (!response.ok) {
        setStatus("Save failed.");
        return;
      }

      setStatus("Site copy saved.");
    } catch {
      setStatus("Save failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-sm text-[var(--color-text-body)]">Loading site copy...</div>;
  }

  return (
    <AdminSectionWorkspace
      sectionLabel="Site Copy"
      sectionTitle="Global Content Editor"
      sectionDescription="Edit the remaining hardcoded headings, intros, footer text, about timeline, FAQ items, highlights, and other section copy from one place. Use square brackets in a heading to mark the accented word or phrase, for example: My Creative [Toolbox]."
      previewPath="/"
    >
      <SectionCard
        title="Hero and Home Intro"
        description="Controls the extra home section copy that was previously hardcoded."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextInput
            label="Hero status line"
            value={siteCopy.heroStatusLine}
            onChange={(value) => patch("heroStatusLine", value)}
          />
          <TextInput
            label="Home about heading"
            value={siteCopy.homeAboutHeading}
            onChange={(value) => patch("homeAboutHeading", value)}
            hint="Use [brackets] around the accented word."
          />
          <TextAreaInput
            label="Home about copy"
            value={siteCopy.homeAboutBody}
            onChange={(value) => patch("homeAboutBody", value)}
            rows={4}
          />
          <TextInput
            label="Home about CTA label"
            value={siteCopy.homeAboutCtaLabel}
            onChange={(value) => patch("homeAboutCtaLabel", value)}
          />
        </div>
      </SectionCard>

      <SectionCard title="Creative Toolbox">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextInput
            label="Toolbox heading"
            value={siteCopy.homeToolboxHeading}
            onChange={(value) => patch("homeToolboxHeading", value)}
            hint="Use [brackets] around the accented word."
          />
          <div className="md:col-span-2">
            <TextAreaInput
              label="Toolbox intro"
              value={siteCopy.homeToolboxIntro}
              onChange={(value) => patch("homeToolboxIntro", value)}
              rows={3}
            />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] p-4">
          <h4 className="text-sm font-semibold text-[#0b0b0c]">Toolbox category labels</h4>
          <p className="mt-1 text-xs text-[var(--color-text-body)]">
            The three category ids are fixed so the toolbox interaction keeps working.
          </p>
          <div className="mt-4 space-y-4">
            {siteCopy.homeToolCategories.map((item, index) => (
              <div
                key={item.id}
                className="rounded-xl border border-[var(--color-border-light)] bg-white p-4"
              >
                <div className="mb-4 text-xs uppercase tracking-[0.18em] text-[var(--color-text-body)]">
                  {item.id}
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <TextInput
                    label={`Category ${index + 1} name`}
                    value={item.name}
                    onChange={(value) =>
                      updateArrayItem("homeToolCategories", index, { ...item, name: value })
                    }
                  />
                  <TextInput
                    label="Description"
                    value={item.description}
                    onChange={(value) =>
                      updateArrayItem("homeToolCategories", index, {
                        ...item,
                        description: value,
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Recent Projects and Creative Work">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextInput
            label="Recent projects heading"
            value={siteCopy.homeRecentHeading}
            onChange={(value) => patch("homeRecentHeading", value)}
            hint="Use [brackets] around the accented word."
          />
          <TextInput
            label="Web block title"
            value={siteCopy.homeRecentWebTitle}
            onChange={(value) => patch("homeRecentWebTitle", value)}
          />
          <div className="md:col-span-2">
            <TextAreaInput
              label="Recent projects intro"
              value={siteCopy.homeRecentIntro}
              onChange={(value) => patch("homeRecentIntro", value)}
              rows={3}
            />
          </div>
          <div className="md:col-span-2">
            <TextAreaInput
              label="Web block copy"
              value={siteCopy.homeRecentWebCopy}
              onChange={(value) => patch("homeRecentWebCopy", value)}
              rows={4}
            />
          </div>
          <TextInput
            label="Web block CTA label"
            value={siteCopy.homeRecentWebCtaLabel}
            onChange={(value) => patch("homeRecentWebCtaLabel", value)}
          />
          <TextInput
            label="Creative work title"
            value={siteCopy.homeCreativeTitle}
            onChange={(value) => patch("homeCreativeTitle", value)}
          />
          <div className="md:col-span-2">
            <TextAreaInput
              label="Creative work intro"
              value={siteCopy.homeCreativeCopy}
              onChange={(value) => patch("homeCreativeCopy", value)}
              rows={3}
            />
          </div>
          <TextInput
            label="Creative work CTA label"
            value={siteCopy.homeCreativeCtaLabel}
            onChange={(value) => patch("homeCreativeCtaLabel", value)}
          />
        </div>

        <ArraySection
          title="Creative carousel cards"
          items={siteCopy.homeCreativeCategories}
          onAdd={() =>
            addArrayItem("homeCreativeCategories", {
              title: "New category",
              description: "",
              image: "",
            } as SiteCopyCreativeCategory)
          }
          onRemove={(index) => removeArrayItem("homeCreativeCategories", index)}
          renderItem={(item, index) => (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextInput
                label="Title"
                value={item.title}
                onChange={(value) =>
                  updateArrayItem("homeCreativeCategories", index, { ...item, title: value })
                }
              />
              <TextInput
                label="Image URL"
                value={item.image}
                onChange={(value) =>
                  updateArrayItem("homeCreativeCategories", index, { ...item, image: value })
                }
              />
              <div className="md:col-span-2">
                <TextAreaInput
                  label="Description"
                  value={item.description}
                  onChange={(value) =>
                    updateArrayItem("homeCreativeCategories", index, {
                      ...item,
                      description: value,
                    })
                  }
                  rows={3}
                />
              </div>
            </div>
          )}
        />
      </SectionCard>

      <SectionCard
        title="Home Services and Highlights"
        description="The home services card copy now pulls from the saved services section. These fields control the section header and the editable highlight stack below it."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextInput
            label="Home services heading"
            value={siteCopy.homeServicesHeading}
            onChange={(value) => patch("homeServicesHeading", value)}
            hint="Use [brackets] around the accented word."
          />
          <TextInput
            label="Highlights heading"
            value={siteCopy.homeReviewsHeading}
            onChange={(value) => patch("homeReviewsHeading", value)}
            hint="Use [brackets] around the accented word."
          />
          <div className="md:col-span-2">
            <TextAreaInput
              label="Home services intro"
              value={siteCopy.homeServicesIntro}
              onChange={(value) => patch("homeServicesIntro", value)}
              rows={3}
            />
          </div>
          <div className="md:col-span-2">
            <TextAreaInput
              label="Highlights intro"
              value={siteCopy.homeReviewsIntro}
              onChange={(value) => patch("homeReviewsIntro", value)}
              rows={3}
            />
          </div>
        </div>

        <ArraySection
          title="Highlight cards"
          items={siteCopy.homeReviewsItems}
          onAdd={() =>
            addArrayItem("homeReviewsItems", {
              id: `highlight-${siteCopy.homeReviewsItems.length + 1}`,
              name: "New highlight",
              content: "",
              designation: "",
              rating: 0,
            } as SiteCopyReviewItem)
          }
          onRemove={(index) => removeArrayItem("homeReviewsItems", index)}
          renderItem={(item, index) => (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextInput
                label="Name"
                value={item.name}
                onChange={(value) =>
                  updateArrayItem("homeReviewsItems", index, { ...item, name: value })
                }
              />
              <TextInput
                label="Designation / label"
                value={item.designation || ""}
                onChange={(value) =>
                  updateArrayItem("homeReviewsItems", index, {
                    ...item,
                    designation: value,
                  })
                }
              />
              <label className="space-y-2 text-sm">
                <FieldLabel label="Rating (0 to 5)" />
                <input
                  type="number"
                  min={0}
                  max={5}
                  value={item.rating}
                  onChange={(event) =>
                    updateArrayItem("homeReviewsItems", index, {
                      ...item,
                      rating: Number(event.target.value),
                    })
                  }
                  className="w-full rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-2 text-sm text-[#0b0b0c]"
                />
              </label>
              <TextInput
                label="Internal id"
                value={item.id}
                onChange={(value) =>
                  updateArrayItem("homeReviewsItems", index, { ...item, id: value })
                }
              />
              <div className="md:col-span-2">
                <TextAreaInput
                  label="Content"
                  value={item.content}
                  onChange={(value) =>
                    updateArrayItem("homeReviewsItems", index, { ...item, content: value })
                  }
                  rows={4}
                />
              </div>
            </div>
          )}
        />
      </SectionCard>

      <SectionCard title="About Page Copy">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextAreaInput
            label="Scrapbook sticky note"
            value={siteCopy.aboutStickyNote}
            onChange={(value) => patch("aboutStickyNote", value)}
            rows={3}
          />
          <TextInput
            label="Footer tag"
            value={siteCopy.aboutFooterTag}
            onChange={(value) => patch("aboutFooterTag", value)}
          />
          <TextInput
            label="Book intro title"
            value={siteCopy.aboutIntroTitle}
            onChange={(value) => patch("aboutIntroTitle", value)}
          />
          <TextInput
            label="Desk book image"
            value={siteCopy.aboutBookImage}
            onChange={(value) => patch("aboutBookImage", value)}
          />
          <div className="md:col-span-2">
            <TextAreaInput
              label="Lower right note"
              value={siteCopy.aboutLowerRightNote}
              onChange={(value) => patch("aboutLowerRightNote", value)}
              rows={4}
            />
          </div>
          <div className="md:col-span-2">
            <TextAreaInput
              label="Book intro body"
              value={siteCopy.aboutIntroBody}
              onChange={(value) => patch("aboutIntroBody", value)}
              rows={9}
              hint="Use blank lines between paragraphs."
            />
          </div>
          <div className="md:col-span-2">
            <TextAreaInput
              label="Typewriter quote"
              value={siteCopy.aboutTypewriterQuote}
              onChange={(value) => patch("aboutTypewriterQuote", value)}
              rows={4}
            />
          </div>
          <TextInput
            label="Timeline title"
            value={siteCopy.aboutTimelineTitle}
            onChange={(value) => patch("aboutTimelineTitle", value)}
          />
        </div>

        <ArraySection
          title="Timeline entries"
          items={siteCopy.aboutTimelineEntries}
          onAdd={() =>
            addArrayItem("aboutTimelineEntries", {
              role: "New role",
              organization: "",
              duration: "",
              copy: "",
            } as SiteCopyTimelineEntry)
          }
          onRemove={(index) => removeArrayItem("aboutTimelineEntries", index)}
          renderItem={(item, index) => (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextInput
                label="Role"
                value={item.role}
                onChange={(value) =>
                  updateArrayItem("aboutTimelineEntries", index, { ...item, role: value })
                }
              />
              <TextInput
                label="Organization"
                value={item.organization}
                onChange={(value) =>
                  updateArrayItem("aboutTimelineEntries", index, {
                    ...item,
                    organization: value,
                  })
                }
              />
              <TextInput
                label="Duration"
                value={item.duration}
                onChange={(value) =>
                  updateArrayItem("aboutTimelineEntries", index, { ...item, duration: value })
                }
              />
              <div className="md:col-span-2">
                <TextAreaInput
                  label="Copy"
                  value={item.copy}
                  onChange={(value) =>
                    updateArrayItem("aboutTimelineEntries", index, { ...item, copy: value })
                  }
                  rows={3}
                />
              </div>
            </div>
          )}
        />
      </SectionCard>

      <SectionCard title="Services Page Copy">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextInput
            label="Hero title"
            value={siteCopy.servicesHeroTitle}
            onChange={(value) => patch("servicesHeroTitle", value)}
          />
          <TextInput
            label="Why section eyebrow"
            value={siteCopy.servicesWhyEyebrow}
            onChange={(value) => patch("servicesWhyEyebrow", value)}
          />
          <TextInput
            label="Why section heading"
            value={siteCopy.servicesWhyHeading}
            onChange={(value) => patch("servicesWhyHeading", value)}
            hint="Use [brackets] around the accented word."
          />
          <TextInput
            label="Why section CTA URL"
            value={siteCopy.servicesWhyCtaUrl}
            onChange={(value) => patch("servicesWhyCtaUrl", value)}
          />
          <div className="md:col-span-2">
            <TextAreaInput
              label="Why section intro"
              value={siteCopy.servicesWhyIntro}
              onChange={(value) => patch("servicesWhyIntro", value)}
              rows={4}
            />
          </div>
          <TextInput
            label="Why section CTA label"
            value={siteCopy.servicesWhyCtaLabel}
            onChange={(value) => patch("servicesWhyCtaLabel", value)}
          />
          <TextInput
            label="FAQ eyebrow"
            value={siteCopy.servicesFaqEyebrow}
            onChange={(value) => patch("servicesFaqEyebrow", value)}
          />
          <TextInput
            label="FAQ heading"
            value={siteCopy.servicesFaqHeading}
            onChange={(value) => patch("servicesFaqHeading", value)}
            hint="Use [brackets] around the accented word."
          />
          <div className="md:col-span-2">
            <TextAreaInput
              label="FAQ intro"
              value={siteCopy.servicesFaqIntro}
              onChange={(value) => patch("servicesFaqIntro", value)}
              rows={3}
            />
          </div>
          <TextInput
            label="FAQ CTA helper text"
            value={siteCopy.servicesFaqCtaText}
            onChange={(value) => patch("servicesFaqCtaText", value)}
          />
          <TextInput
            label="FAQ CTA button label"
            value={siteCopy.servicesFaqCtaLabel}
            onChange={(value) => patch("servicesFaqCtaLabel", value)}
          />
        </div>

        <ArraySection
          title="Why work with me features"
          items={siteCopy.servicesWhyFeatures}
          onAdd={() =>
            addArrayItem("servicesWhyFeatures", {
              label: "New comparison point",
              others: false,
              me: true,
            } as SiteCopyComparisonFeature)
          }
          onRemove={(index) => removeArrayItem("servicesWhyFeatures", index)}
          renderItem={(item, index) => (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <TextInput
                label="Label"
                value={item.label}
                onChange={(value) =>
                  updateArrayItem("servicesWhyFeatures", index, { ...item, label: value })
                }
              />
              <label className="flex items-center gap-3 rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-3 text-sm">
                <input
                  type="checkbox"
                  checked={item.others}
                  onChange={(event) =>
                    updateArrayItem("servicesWhyFeatures", index, {
                      ...item,
                      others: event.target.checked,
                    })
                  }
                />
                Others column
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-[var(--color-border-light)] bg-[#f8f5f2] px-3 py-3 text-sm">
                <input
                  type="checkbox"
                  checked={item.me}
                  onChange={(event) =>
                    updateArrayItem("servicesWhyFeatures", index, {
                      ...item,
                      me: event.target.checked,
                    })
                  }
                />
                Me column
              </label>
            </div>
          )}
        />

        <ArraySection
          title="FAQ items"
          items={siteCopy.servicesFaqItems}
          onAdd={() =>
            addArrayItem("servicesFaqItems", {
              question: "New question",
              answer: "",
            } as SiteCopyFaqItem)
          }
          onRemove={(index) => removeArrayItem("servicesFaqItems", index)}
          renderItem={(item, index) => (
            <div className="grid grid-cols-1 gap-4">
              <TextInput
                label="Question"
                value={item.question}
                onChange={(value) =>
                  updateArrayItem("servicesFaqItems", index, { ...item, question: value })
                }
              />
              <TextAreaInput
                label="Answer"
                value={item.answer}
                onChange={(value) =>
                  updateArrayItem("servicesFaqItems", index, { ...item, answer: value })
                }
                rows={3}
              />
            </div>
          )}
        />
      </SectionCard>

      <SectionCard title="Contact and Footer">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextInput
            label="Contact eyebrow"
            value={siteCopy.contactEyebrow}
            onChange={(value) => patch("contactEyebrow", value)}
          />
          <TextInput
            label="Contact heading"
            value={siteCopy.contactHeading}
            onChange={(value) => patch("contactHeading", value)}
          />
          <div className="md:col-span-2">
            <TextAreaInput
              label="Contact support line"
              value={siteCopy.contactSupportLine}
              onChange={(value) => patch("contactSupportLine", value)}
              rows={3}
            />
          </div>
          <TextInput
            label="Contact giant text"
            value={siteCopy.contactGiantText}
            onChange={(value) => patch("contactGiantText", value)}
          />
          <TextInput
            label="Footer eyebrow / brand line"
            value={siteCopy.footerBrandEyebrow}
            onChange={(value) => patch("footerBrandEyebrow", value)}
          />
          <div className="md:col-span-2">
            <TextAreaInput
              label="Footer support copy"
              value={siteCopy.footerSupportCopy}
              onChange={(value) => patch("footerSupportCopy", value)}
              rows={3}
            />
          </div>
          <TextInput
            label="Footer email"
            value={siteCopy.footerEmail}
            onChange={(value) => patch("footerEmail", value)}
          />
          <TextInput
            label="Footer CTA heading"
            value={siteCopy.footerCtaHeading}
            onChange={(value) => patch("footerCtaHeading", value)}
          />
          <TextInput
            label="Footer CTA copy"
            value={siteCopy.footerCtaCopy}
            onChange={(value) => patch("footerCtaCopy", value)}
          />
          <TextInput
            label="Footer copyright"
            value={siteCopy.footerCopyright}
            onChange={(value) => patch("footerCopyright", value)}
          />
          <TextInput
            label="Footer credit"
            value={siteCopy.footerCredit}
            onChange={(value) => patch("footerCredit", value)}
            hint="Leave blank to hide."
          />
        </div>
      </SectionCard>

      <div className="sticky bottom-4 z-20 flex items-center gap-3 rounded-full border border-[var(--color-border-light)] bg-white/95 px-4 py-3 shadow-[0_18px_42px_rgba(16,24,40,0.12)] backdrop-blur">
        <button
          type="button"
          onClick={saveSiteCopy}
          disabled={saving}
          className="rounded-full border-[2px] border-[var(--color-border-dark)] bg-[#dbe7ff] px-5 py-2 text-sm font-medium text-[#0020d7] shadow-[0_8px_18px_rgba(0,32,215,0.14)] disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Site Copy"}
        </button>
        {status ? <p className="text-xs text-[var(--color-text-body)]">{status}</p> : null}
      </div>
    </AdminSectionWorkspace>
  );
}
