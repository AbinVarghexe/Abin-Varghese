"use client";

import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CalendarDays,
  Database,
  FileText,
  FolderKanban,
  Home,
  Layers3,
  Mail,
  Sparkles,
  Zap,
  Globe,
  Clock,
  LayoutDashboard,
} from "lucide-react";
import AdminSectionWorkspace, { SectionPanel, SectionTitle } from "@/components/admin/AdminSectionWorkspace";

const sections = [
  {
    title: "Intelligence & Memory",
    label: "Jarvis AI",
    description: "Sync your digital clone's knowledge base via GitHub, LinkedIn, and manual uploads.",
    href: "/admin/jarvis",
    icon: BrainCircuit,
    color: "#007aff",
    bg: "bg-[#007aff]/10",
    border: "border-[#007aff]/20",
  },
  {
    title: "Global Presence",
    label: "Home Section",
    description: "Manage hero copy, social handles, and high-frequency content updates.",
    href: "/admin/home",
    icon: Home,
    color: "#ff9500",
    bg: "bg-[#ff9500]/10",
    border: "border-[#ff9500]/20",
  },
  {
    title: "Schedule & Events",
    label: "Bookings",
    description: "Real-time appointment synchronization with your external calendar systems.",
    href: "/admin/bookings",
    icon: CalendarDays,
    color: "#af52de",
    bg: "bg-[#af52de]/10",
    border: "border-[#af52de]/20",
  },
  {
    title: "Visual Narrative",
    label: "About Section",
    description: "Curate the scrapbook, Instagram highlights, and personal brand storytelling.",
    href: "/admin/about",
    icon: Sparkles,
    color: "#ff3b30",
    bg: "bg-[#ff3b30]/10",
    border: "border-[#ff3b30]/20",
  },
  {
    title: "Portfolio Assets",
    label: "Projects",
    description: "Full-scale management of case studies, design drafts, and technical builds.",
    href: "/admin/projects",
    icon: FolderKanban,
    color: "#34c759",
    bg: "bg-[#34c759]/10",
    border: "border-[#34c759]/20",
  },
  {
    title: "Core Offerings",
    label: "Services",
    description: "Define service categories and showcase specialized project demonstrations.",
    href: "/admin/services",
    icon: Layers3,
    color: "#5856d6",
    bg: "bg-[#5856d6]/10",
    border: "border-[#5856d6]/20",
  },
  {
    title: "Communication",
    label: "Contact",
    description: "Inbox management, form configuration, and global contact accessibility.",
    href: "/admin/contact",
    icon: Mail,
    color: "#ff2d55",
    bg: "bg-[#ff2d55]/10",
    border: "border-[#ff2d55]/20",
  },
  {
    title: "Atomic Content",
    label: "Site Copy",
    description: "Unified editor for global strings, FAQ items, and micro-copy refinements.",
    href: "/admin/content",
    icon: FileText,
    color: "#00c7be",
    bg: "bg-[#00c7be]/10",
    border: "border-[#00c7be]/20",
  },
  {
    title: "System Utilities",
    label: "Import/Export",
    description: "Safely migrate site data, backups, and structural configuration updates.",
    href: "/admin/import",
    icon: Database,
    color: "#8e8e93",
    bg: "bg-[#8e8e93]/10",
    border: "border-[#8e8e93]/20",
  },
];

const metrics = [
  { label: "Live Nodes", value: "Active", icon: Globe, color: "text-[#34c759]" },
  { label: "Last Sync", value: "2m ago", icon: Clock, color: "text-[#007aff]" },
  { label: "AI Pulse", value: "Optimal", icon: Zap, color: "text-[#ff9500]" },
];

export default function AdminOverviewPage() {
  return (
    <AdminSectionWorkspace
      sectionLabel="Overview"
      sectionTitle="System Hub"
      sectionDescription="Welcome to your digital orchestration station. Manage your personal brand, knowledge base, and global presence with absolute precision."
      icon={LayoutDashboard}
      iconColor="#007aff"
    >
      <div className="space-y-12">
        {/* Intelligence Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {metrics.map((metric) => (
            <SectionPanel key={metric.label} className="!p-6 flex items-center gap-5 hover:-translate-y-1 transition-transform">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white border-2 border-[#e4e4e7] shadow-sm`}>
                <metric.icon className={`h-6 w-6 ${metric.color}`} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[20px] font-bold text-[#0b0b0c] leading-none tracking-tight">{metric.value}</span>
                <span className="text-[12px] text-[#4a4a68] font-bold uppercase tracking-widest mt-1.5">{metric.label}</span>
              </div>
            </SectionPanel>
          ))}
        </div>

        {/* Workspace Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group flex flex-col bg-white rounded-[28px] border-[3px] border-[#e4e4e7] p-8 shadow-sm transition-all hover:shadow-lg hover:border-[#0020d7]/30 hover:-translate-y-1 relative overflow-hidden"
            >
              <div 
                className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[60px] opacity-0 group-hover:opacity-[0.06] transition-opacity duration-700 pointer-events-none" 
                style={{ backgroundColor: section.color }}
              />
              <div className="flex items-start justify-between mb-8">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-[#f7f4ef] border-2 border-[#e4e4e7] group-hover:bg-white group-hover:border-current group-hover:shadow-md transition-all duration-300 relative z-10"
                  style={{ color: section.color }}
                >
                  <section.icon className="h-6 w-6" strokeWidth={2} />
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f7f4ef] border-2 border-[#e4e4e7] text-[#4a4a68] transition-all duration-300 group-hover:bg-[#0b0b0c] group-hover:text-white group-hover:border-[#0b0b0c] relative z-10">
                  <ArrowRight size={16} strokeWidth={2.5} />
                </div>
              </div>

              <div className="relative z-10 flex-1">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] opacity-80 transition-opacity" style={{ color: section.color }}>
                  {section.label}
                </span>
                <h3 className="text-[18px] font-bold text-[#0b0b0c] mt-2 tracking-tight">
                  {section.title}
                </h3>
                <p className="mt-3 text-[14px] text-[#4a4a68] leading-relaxed font-medium">
                  {section.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Terminal Pulse */}
        <div className="flex items-center justify-center pt-8">
          <div className="flex items-center gap-4 px-6 py-2.5 rounded-full bg-white border-2 border-[#e4e4e7] shadow-sm">
            <div className="w-2 h-2 rounded-full bg-[#34c759] animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#4a4a68]">System Online & Ready</span>
            <div className="w-2 h-2 rounded-full bg-[#34c759] animate-pulse" />
          </div>
        </div>
      </div>
    </AdminSectionWorkspace>
  );
}
