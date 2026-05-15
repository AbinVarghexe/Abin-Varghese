"use client";

import { useEffect, useState, type ReactNode } from "react";
import AdminSectionWorkspace, {
  SectionPanel,
  SectionTitle,
  Field,
  TextareaField,
  ActionButton,
  TinyButton,
} from "@/components/admin/AdminSectionWorkspace";
import {
  FileText,
  Home,
  PenTool,
  Layers,
  Sparkles,
  User,
  Quote,
  HelpCircle,
  Plus,
  Trash2,
  Globe,
  Loader2,
  Check,
  Zap,
  Search,
  Link,
  Image as ImageIcon,
  Phone,
  Download,
  Navigation,
  Settings,
} from "lucide-react";
import {
  siteCopyDefaults,
  type SiteCopyComparisonFeature,
  type SiteCopyContent,
  type SiteCopyCreativeCategory,
  type SiteCopyFaqItem,
  type SiteCopyReviewItem,
  type SiteCopyTimelineEntry,
} from "@/types/site-copy";

type ArraySectionProps<T> = {
  title: string;
  description?: string;
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: T, index: number) => ReactNode;
};

function ArraySection<T>({
  title,
  description,
  items,
  onAdd,
  onRemove,
  renderItem,
}: ArraySectionProps<T>) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-[13px] font-bold text-[#1d1d1f]">{title}</h4>
          {description ? (
            <p className="text-[11px] text-[#86868b] mt-0.5">{description}</p>
          ) : null}
        </div>
        <TinyButton onClick={onAdd} variant="primary">
          <Plus size={10} className="mr-1.5 inline" />
          Add Entry
        </TinyButton>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map((item, index) => (
          <div key={index} className="relative p-6 rounded-2xl bg-[#f5f5f7]/50 border border-black/5 group">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <TinyButton onClick={() => onRemove(index)} variant="danger">
                <Trash2 size={10} />
              </TinyButton>
            </div>
            <div className="mb-4 inline-flex px-2 py-0.5 rounded-md bg-black/5 text-[9px] font-bold uppercase tracking-widest text-[#86868b]">
              Index 0{index + 1}
            </div>
            {renderItem(item, index)}
          </div>
        ))}
        {items.length === 0 && (
          <div className="py-8 border-2 border-dashed border-black/5 rounded-2xl flex flex-col items-center justify-center text-[#86868b]">
            <Plus size={20} className="mb-2 opacity-20" />
            <span className="text-[12px]">No entries added yet</span>
          </div>
        )}
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
    void loadData();
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
    setStatus("Saving changes...");
    try {
      const response = await fetch("/api/admin/site-copy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteCopy }),
      });
      if (!response.ok) {
        setStatus("Error persisting changes.");
        return;
      }
      setStatus("Global content synchronized.");
    } catch {
      setStatus("Failed to sync.");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 3000);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-[#007aff]" />
      </div>
    );
  }

  return (
    <AdminSectionWorkspace
      sectionLabel="Atomic Content"
      sectionTitle="Global Content Editor"
      sectionDescription="Refine every hardcoded string across the platform. Use [brackets] to inject thematic accents into headings."
      icon={FileText}
      iconColor="#00c7be"
    >
      <div className="grid grid-cols-1 gap-8">
        
        {/* HERO & HOME INTRO */}
        <SectionPanel className="space-y-8">
          <SectionTitle 
            title="Hero & Home Introduction" 
            copy="Primary narrative controls for the landing experience." 
            icon={Home}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field
              label="Hero Status Line"
              value={siteCopy.heroStatusLine}
              onChange={(value) => patch("heroStatusLine", value)}
              icon={Zap}
            />
            <div className="md:col-span-2">
              <TextareaField
                label="Sliding roles strip (comma-separated)"
                value={siteCopy.homeSlidingRoles}
                onChange={(value) => patch("homeSlidingRoles", value)}
                rows={2}
                icon={Sparkles}
                placeholder="Creative Director, UI Designer, Frontend Engineer"
              />
              <p className="mt-2 text-[12px] text-[#6e6e73] ml-1">
                Shown on the home page between brands and about. The diagonal scrolling banner phrases are edited under Admin → Home → Hero → Landing marquees.
              </p>
            </div>
            <Field
              label="Home About Heading"
              value={siteCopy.homeAboutHeading}
              onChange={(value) => patch("homeAboutHeading", value)}
              icon={Home}
            />
            <TextareaField
              label="Home About Copy"
              value={siteCopy.homeAboutBody}
              onChange={(value) => patch("homeAboutBody", value)}
              rows={4}
              icon={FileText}
            />
            <Field
              label="Home About CTA Label"
              value={siteCopy.homeAboutCtaLabel}
              onChange={(value) => patch("homeAboutCtaLabel", value)}
              icon={Layers}
            />
          </div>
        </SectionPanel>

        {/* CREATIVE TOOLBOX */}
        <SectionPanel className="space-y-8">
          <SectionTitle 
            title="Creative Toolbox" 
            copy="Define your technical arsenal and category descriptions." 
            icon={PenTool}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field
              label="Toolbox Heading"
              value={siteCopy.homeToolboxHeading}
              onChange={(value) => patch("homeToolboxHeading", value)}
              icon={PenTool}
            />
            <div className="md:col-span-2">
              <TextareaField
                label="Toolbox Intro Description"
                value={siteCopy.homeToolboxIntro}
                onChange={(value) => patch("homeToolboxIntro", value)}
                rows={3}
                icon={FileText}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[13px] font-bold text-[#1d1d1f] ml-1 uppercase tracking-wider">Toolbox Categories</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {siteCopy.homeToolCategories.map((item, index) => (
                <div key={item.id} className="p-6 rounded-2xl bg-[#f5f5f7]/50 border border-black/5 space-y-4">
                  <span className="text-[10px] font-bold text-[#007aff] uppercase tracking-widest">{item.id}</span>
                  <Field
                    label="Name"
                    value={item.name}
                    onChange={(value) => updateArrayItem("homeToolCategories", index, { ...item, name: value })}
                  />
                  <TextareaField
                    label="Description"
                    value={item.description}
                    onChange={(value) => updateArrayItem("homeToolCategories", index, { ...item, description: value })}
                    rows={3}
                  />
                </div>
              ))}
            </div>
          </div>
        </SectionPanel>

        {/* RECENT PROJECTS */}
        <SectionPanel className="space-y-8">
          <SectionTitle 
            title="Project Showcases" 
            copy="Manage headings and intros for featured work sections." 
            icon={Layers}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field
              label="Recent Projects Heading"
              value={siteCopy.homeRecentHeading}
              onChange={(value) => patch("homeRecentHeading", value)}
              icon={Layers}
            />
            <Field
              label="Web Block Title"
              value={siteCopy.homeRecentWebTitle}
              onChange={(value) => patch("homeRecentWebTitle", value)}
              icon={Globe}
            />
            <div className="md:col-span-2">
              <TextareaField
                label="Recent Projects Intro"
                value={siteCopy.homeRecentIntro}
                onChange={(value) => patch("homeRecentIntro", value)}
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <TextareaField
                label="Web Block Copy"
                value={siteCopy.homeRecentWebCopy}
                onChange={(value) => patch("homeRecentWebCopy", value)}
                rows={4}
              />
            </div>
            <Field
              label="Web Block CTA Label"
              value={siteCopy.homeRecentWebCtaLabel}
              onChange={(value) => patch("homeRecentWebCtaLabel", value)}
            />
            <Field
              label="Creative Work Title"
              value={siteCopy.homeCreativeTitle}
              onChange={(value) => patch("homeCreativeTitle", value)}
              icon={Sparkles}
            />
            <div className="md:col-span-2">
              <TextareaField
                label="Creative Work Intro"
                value={siteCopy.homeCreativeCopy}
                onChange={(value) => patch("homeCreativeCopy", value)}
                rows={3}
              />
            </div>
            <Field
              label="Creative Work CTA Label"
              value={siteCopy.homeCreativeCtaLabel}
              onChange={(value) => patch("homeCreativeCtaLabel", value)}
            />
          </div>

          <ArraySection
            title="Creative Carousel Modules"
            items={siteCopy.homeCreativeCategories}
            onAdd={() => addArrayItem("homeCreativeCategories", { title: "New Module", description: "", image: "" } as SiteCopyCreativeCategory)}
            onRemove={(index) => removeArrayItem("homeCreativeCategories", index)}
            renderItem={(item, index) => (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field
                  label="Module Title"
                  value={item.title}
                  onChange={(value) => updateArrayItem("homeCreativeCategories", index, { ...item, title: value })}
                />
                <Field
                  label="Cover Asset URL"
                  value={item.image}
                  onChange={(value) => updateArrayItem("homeCreativeCategories", index, { ...item, image: value })}
                />
                <div className="md:col-span-2">
                  <TextareaField
                    label="Module Narrative"
                    value={item.description}
                    onChange={(value) => updateArrayItem("homeCreativeCategories", index, { ...item, description: value })}
                    rows={3}
                  />
                </div>
              </div>
            )}
          />
        </SectionPanel>

        {/* HIGHLIGHTS */}
        <SectionPanel className="space-y-8">
          <SectionTitle 
            title="Highlights & Endorsements" 
            copy="Manage the social proof stack on the homepage." 
            icon={Quote}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field
              label="Home Services Heading"
              value={siteCopy.homeServicesHeading}
              onChange={(value) => patch("homeServicesHeading", value)}
            />
            <Field
              label="Highlights Heading"
              value={siteCopy.homeReviewsHeading}
              onChange={(value) => patch("homeReviewsHeading", value)}
            />
            <TextareaField
              label="Services Intro"
              value={siteCopy.homeServicesIntro}
              onChange={(value) => patch("homeServicesIntro", value)}
              rows={3}
            />
            <TextareaField
              label="Highlights Intro"
              value={siteCopy.homeReviewsIntro}
              onChange={(value) => patch("homeReviewsIntro", value)}
              rows={3}
            />
          </div>

          <ArraySection
            title="High-Fidelity Highlight Cards"
            items={siteCopy.homeReviewsItems}
            onAdd={() => addArrayItem("homeReviewsItems", { id: `H-${Date.now()}`, name: "New Highlight", content: "", designation: "", rating: 5 } as SiteCopyReviewItem)}
            onRemove={(index) => removeArrayItem("homeReviewsItems", index)}
            renderItem={(item, index) => (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field
                  label="Author / Entity"
                  value={item.name}
                  onChange={(value) => updateArrayItem("homeReviewsItems", index, { ...item, name: value })}
                />
                <Field
                  label="Position / Label"
                  value={item.designation || ""}
                  onChange={(value) => updateArrayItem("homeReviewsItems", index, { ...item, designation: value })}
                />
                <div className="md:col-span-2">
                  <TextareaField
                    label="Endorsement Content"
                    value={item.content}
                    onChange={(value) => updateArrayItem("homeReviewsItems", index, { ...item, content: value })}
                    rows={4}
                  />
                </div>
              </div>
            )}
          />
        </SectionPanel>

        {/* ABOUT PAGE */}
        <SectionPanel className="space-y-8">
          <SectionTitle 
            title="About Narrative" 
            copy="Fine-tune your personal brand story and timeline." 
            icon={User}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextareaField
              label="Scrapbook Sticky Note"
              value={siteCopy.aboutStickyNote}
              onChange={(value) => patch("aboutStickyNote", value)}
              rows={3}
            />
            <Field
              label="Footer Tagline"
              value={siteCopy.aboutFooterTag}
              onChange={(value) => patch("aboutFooterTag", value)}
            />
            <Field
              label="Intro Narrative Title"
              value={siteCopy.aboutIntroTitle}
              onChange={(value) => patch("aboutIntroTitle", value)}
            />
            <Field
              label="Book Asset URL"
              value={siteCopy.aboutBookImage}
              onChange={(value) => patch("aboutBookImage", value)}
            />
            <div className="md:col-span-2">
              <TextareaField
                label="Primary About Copy"
                value={siteCopy.aboutIntroBody}
                onChange={(value) => patch("aboutIntroBody", value)}
                rows={8}
              />
            </div>
          </div>

          <ArraySection
            title="Career & Experience Timeline"
            items={siteCopy.aboutTimelineEntries}
            onAdd={() => addArrayItem("aboutTimelineEntries", { role: "New Position", organization: "", duration: "", copy: "" } as SiteCopyTimelineEntry)}
            onRemove={(index) => removeArrayItem("aboutTimelineEntries", index)}
            renderItem={(item, index) => (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field
                  label="Role"
                  value={item.role}
                  onChange={(value) => updateArrayItem("aboutTimelineEntries", index, { ...item, role: value })}
                />
                <Field
                  label="Organization"
                  value={item.organization}
                  onChange={(value) => updateArrayItem("aboutTimelineEntries", index, { ...item, organization: value })}
                />
                <Field
                  label="Duration"
                  value={item.duration}
                  onChange={(value) => updateArrayItem("aboutTimelineEntries", index, { ...item, duration: value })}
                />
                <div className="md:col-span-2">
                  <TextareaField
                    label="Summary"
                    value={item.copy}
                    onChange={(value) => updateArrayItem("aboutTimelineEntries", index, { ...item, copy: value })}
                    rows={3}
                  />
                </div>
              </div>
            )}
          />
        </SectionPanel>

        {/* FAQ & SERVICES */}
        <SectionPanel className="space-y-8">
          <SectionTitle 
            title="Services & Inquiries" 
            copy="Configure FAQ items and comparison feature sets." 
            icon={HelpCircle}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field
              label="FAQ Heading"
              value={siteCopy.servicesFaqHeading}
              onChange={(value) => patch("servicesFaqHeading", value)}
            />
            <TextareaField
              label="FAQ Intro"
              value={siteCopy.servicesFaqIntro}
              onChange={(value) => patch("servicesFaqIntro", value)}
              rows={3}
            />
          </div>

          <ArraySection
            title="Active FAQ Inventory"
            items={siteCopy.servicesFaqItems}
            onAdd={() => addArrayItem("servicesFaqItems", { question: "New Question", answer: "" } as SiteCopyFaqItem)}
            onRemove={(index) => removeArrayItem("servicesFaqItems", index)}
            renderItem={(item, index) => (
              <div className="grid grid-cols-1 gap-6">
                <Field
                  label="Question"
                  value={item.question}
                  onChange={(value) => updateArrayItem("servicesFaqItems", index, { ...item, question: value })}
                />
                <TextareaField
                  label="Answer"
                  value={item.answer}
                  onChange={(value) => updateArrayItem("servicesFaqItems", index, { ...item, answer: value })}
                  rows={3}
                />
              </div>
            )}
          />
        </SectionPanel>

        {/* NAVIGATION */}
        <SectionPanel className="space-y-8">
          <SectionTitle 
            title="Navigation" 
            copy="Configure menu links across Navbar, Footer, and MobileDock." 
            icon={Navigation}
          />
          <ArraySection
            title="Menu Links"
            items={siteCopy.navLinks}
            onAdd={() => addArrayItem("navLinks", { name: "New Page", path: "/" } as { name: string; path: string })}
            onRemove={(index) => removeArrayItem("navLinks", index)}
            renderItem={(item, index) => (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field
                  label="Label"
                  value={item.name}
                  onChange={(value) => updateArrayItem("navLinks", index, { ...item, name: value })}
                />
                <Field
                  label="Path"
                  value={item.path}
                  onChange={(value) => updateArrayItem("navLinks", index, { ...item, path: value })}
                />
              </div>
            )}
          />
        </SectionPanel>

        {/* SEO & METADATA */}
        <SectionPanel className="space-y-8">
          <SectionTitle 
            title="SEO & Metadata" 
            copy="Control search engine titles, descriptions, keywords, and social sharing." 
            icon={Search}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field
              label="Site Name"
              value={siteCopy.seoSiteName}
              onChange={(value) => patch("seoSiteName", value)}
              icon={Globe}
            />
            <Field
              label="Default Page Title"
              value={siteCopy.seoDefaultTitle}
              onChange={(value) => patch("seoDefaultTitle", value)}
              icon={Search}
            />
            <div className="md:col-span-2">
              <TextareaField
                label="Site Description"
                value={siteCopy.seoDescription}
                onChange={(value) => patch("seoDescription", value)}
                rows={3}
              />
            </div>
            <Field
              label="Twitter Handle"
              value={siteCopy.seoTwitterHandle}
              onChange={(value) => patch("seoTwitterHandle", value)}
            />
            <Field
              label="OG Image Alt Text"
              value={siteCopy.seoOgImageAlt}
              onChange={(value) => patch("seoOgImageAlt", value)}
            />
            <Field
              label="Job Title (JSON-LD)"
              value={siteCopy.seoJobTitle}
              onChange={(value) => patch("seoJobTitle", value)}
            />
            <Field
              label="Employer (JSON-LD)"
              value={siteCopy.seoEmployer}
              onChange={(value) => patch("seoEmployer", value)}
            />
            <Field
              label="Education (JSON-LD)"
              value={siteCopy.seoEducation}
              onChange={(value) => patch("seoEducation", value)}
            />
            <Field
              label="Phone (JSON-LD)"
              value={siteCopy.seoPhone}
              onChange={(value) => patch("seoPhone", value)}
              icon={Phone}
            />
            <Field
              label="Profile Image URL"
              value={siteCopy.seoProfileImage}
              onChange={(value) => patch("seoProfileImage", value)}
              icon={ImageIcon}
            />
            <div className="md:col-span-2">
              <TextareaField
                label="SEO Keywords (one per line)"
                value={siteCopy.seoKeywords.join("\n")}
                onChange={(value) => patch("seoKeywords", value.split("\n").filter(Boolean))}
                rows={6}
              />
            </div>
            <div className="md:col-span-2">
              <TextareaField
                label="Knows About (JSON-LD, one per line)"
                value={siteCopy.seoKnowsAbout.join("\n")}
                onChange={(value) => patch("seoKnowsAbout", value.split("\n").filter(Boolean))}
                rows={4}
              />
            </div>
            <div className="md:col-span-2">
              <TextareaField
                label="Knows Language (JSON-LD, one per line)"
                value={siteCopy.seoKnowsLanguage.join("\n")}
                onChange={(value) => patch("seoKnowsLanguage", value.split("\n").filter(Boolean))}
                rows={2}
              />
            </div>
          </div>
        </SectionPanel>

        {/* RESUME & DOWNLOAD */}
        <SectionPanel className="space-y-8">
          <SectionTitle 
            title="Resume & Download" 
            copy="Configure resume labels, download button text, and dropdown options." 
            icon={Download}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field
              label="Resume Button Label"
              value={siteCopy.resumeButtonLabel}
              onChange={(value) => patch("resumeButtonLabel", value)}
            />
            <Field
              label="Resume Dropdown Title"
              value={siteCopy.resumeDropdownTitle}
              onChange={(value) => patch("resumeDropdownTitle", value)}
            />
            <Field
              label="Designer Resume Label"
              value={siteCopy.designerResumeLabel}
              onChange={(value) => patch("designerResumeLabel", value)}
            />
            <Field
              label="Designer Resume Description"
              value={siteCopy.designerResumeDesc}
              onChange={(value) => patch("designerResumeDesc", value)}
            />
            <Field
              label="Developer Resume Label"
              value={siteCopy.developerResumeLabel}
              onChange={(value) => patch("developerResumeLabel", value)}
            />
            <Field
              label="Developer Resume Description"
              value={siteCopy.developerResumeDesc}
              onChange={(value) => patch("developerResumeDesc", value)}
            />
            <Field
              label="Hero Mobile CTA Label"
              value={siteCopy.heroMobileCtaLabel}
              onChange={(value) => patch("heroMobileCtaLabel", value)}
            />
            <Field
              label="Hero Mobile Resume Label"
              value={siteCopy.heroMobileResumeLabel}
              onChange={(value) => patch("heroMobileResumeLabel", value)}
            />
          </div>
        </SectionPanel>

        {/* UI / UX */}
        <SectionPanel className="space-y-8">
          <SectionTitle 
            title="UI & Visual" 
            copy="Configure background images, preloader text, and contact page visuals." 
            icon={Settings}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field
              label="Preloader Text"
              value={siteCopy.preloaderText}
              onChange={(value) => patch("preloaderText", value)}
            />
            <Field
              label="Footer Large Text"
              value={siteCopy.footerLargeText}
              onChange={(value) => patch("footerLargeText", value)}
            />
            <Field
              label="Footer Location"
              value={siteCopy.footerLocation}
              onChange={(value) => patch("footerLocation", value)}
            />
            <Field
              label="Home Background Image URL"
              value={siteCopy.homeBackgroundImage}
              onChange={(value) => patch("homeBackgroundImage", value)}
              icon={ImageIcon}
            />
            <Field
              label="Contact Background Image URL"
              value={siteCopy.contactBackgroundImage}
              onChange={(value) => patch("contactBackgroundImage", value)}
              icon={ImageIcon}
            />
            <Field
              label="Contact Instagram Label"
              value={siteCopy.contactInstagramLabel}
              onChange={(value) => patch("contactInstagramLabel", value)}
            />
            <Field
              label="Contact LinkedIn Label"
              value={siteCopy.contactLinkedinLabel}
              onChange={(value) => patch("contactLinkedinLabel", value)}
            />
            <Field
              label="Contact Email Label"
              value={siteCopy.contactEmailLabel}
              onChange={(value) => patch("contactEmailLabel", value)}
            />
          </div>
        </SectionPanel>
      </div>
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-white/80 backdrop-blur-xl px-6 py-4 rounded-full border border-black/5 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-3 pr-6 border-r border-black/5">
          <div className={`h-2 w-2 rounded-full ${status ? 'bg-[#007aff] animate-pulse' : 'bg-[#34c759]'}`} />
          <span className="text-[13px] font-bold text-[#1d1d1f]">
            {status || "Sync Engine Optimal"}
          </span>
        </div>
        <ActionButton onClick={saveSiteCopy} disabled={saving} variant="primary">
          {saving ? "Synchronizing..." : "Push Changes"}
        </ActionButton>
      </div>
    </AdminSectionWorkspace>
  );
}
