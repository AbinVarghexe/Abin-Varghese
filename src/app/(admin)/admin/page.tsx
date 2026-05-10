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
    <div className="space-y-12 pb-20">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0020d7]/10 text-[#0020d7] shadow-sm">
              <LayoutDashboard size={16} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#4a4a68]">Command Deck Architecture</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tighter text-[#0b0b0c] sm:text-6xl">System Hub.</h1>
          <p className="mt-4 text-[16px] text-[#4a4a68] max-w-xl font-medium leading-relaxed opacity-80">
            Welcome to your digital orchestration station. Manage your personal brand, 
            knowledge base, and global presence with absolute precision.
          </p>
        </div>

        {/* Intelligence Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/40 backdrop-blur-2xl p-2 rounded-[32px] border-2 border-[#e4e4e7] shadow-xl">
          {metrics.map((metric) => (
            <div key={metric.label} className="flex items-center gap-4 px-6 py-3 bg-white rounded-[24px] border-2 border-transparent hover:border-[#0020d7]/10 transition-all shadow-sm">
              <metric.icon className={`h-5 w-5 ${metric.color} drop-shadow-sm`} strokeWidth={2.5} />
              <div className="flex flex-col">
                <span className="text-[14px] font-extrabold text-[#0b0b0c] leading-none tracking-tight">{metric.value}</span>
                <span className="text-[10px] text-[#4a4a68] font-extrabold uppercase tracking-widest mt-1 opacity-60">{metric.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workspace Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group relative flex flex-col p-10 rounded-[40px] bg-white border-2 border-[#e4e4e7] shadow-sm hover:shadow-2xl hover:border-[#0020d7]/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
          >
            {/* Dynamic Brand Glow */}
            <div 
              className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[80px] opacity-0 group-hover:opacity-[0.08] transition-opacity duration-700" 
              style={{ backgroundColor: "#0020d7" }}
            />
            
            <div className="relative flex-1">
              <div className="flex items-start justify-between mb-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-[#f7f4ef] border-2 border-[#e4e4e7] group-hover:bg-[#0020d7] group-hover:border-[#0020d7] transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:shadow-[#0020d7]/30">
                  <section.icon className="h-8 w-8 text-[#0b0b0c] group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7f4ef] border-2 border-[#e4e4e7] text-[#4a4a68] transition-all duration-500 group-hover:bg-[#0b0b0c] group-hover:text-white group-hover:border-[#0b0b0c]">
                  <ArrowRight size={18} strokeWidth={3} />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#0020d7] opacity-60 group-hover:opacity-100 transition-opacity">
                  {section.label}
                </span>
                <h3 className="text-2xl font-extrabold text-[#0b0b0c] mt-2 tracking-tight">
                  {section.title}
                </h3>
                <p className="mt-4 text-[15px] text-[#4a4a68] leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                  {section.description}
                </p>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t-2 border-[#f7f4ef] flex items-center justify-between">
              <span className="text-[12px] font-extrabold text-[#4a4a68] uppercase tracking-widest opacity-40 group-hover:opacity-100 group-hover:text-[#0b0b0c] transition-all">Enter Workspace</span>
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full border-4 border-white bg-[#f7f4ef] shadow-sm" />
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Terminal Pulse */}
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-4 px-8 py-3 rounded-full bg-[#f7f4ef] border-2 border-[#e4e4e7] opacity-40">
          <div className="w-2 h-2 rounded-full bg-[#0020d7] animate-pulse" />
          <span className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-[#0b0b0c]">End of Intelligence Layer</span>
          <div className="w-2 h-2 rounded-full bg-[#0020d7] animate-pulse" />
        </div>
      </div>
    </div>
  );
}
