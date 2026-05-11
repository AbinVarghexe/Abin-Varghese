"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import "@/styles/admin.css"; // Import isolated admin styles
import {
  ChevronLeft,
  ChevronRight,
  Database,
  FileCode2,
  FolderKanban,
  Home,
  Layers3,
  LayoutDashboard,
  LogOut,
  Mail,
  User,
  Settings,
  Bell,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, color: "text-[#007aff]", bg: "bg-[#007aff]/5" },
  { href: "/admin/home", label: "Home", icon: Home, color: "text-[#ff9500]", bg: "bg-[#ff9500]/5" },
  { href: "/admin/about", label: "About", icon: User, color: "text-[#ff3b30]", bg: "bg-[#ff3b30]/5" },
  { href: "/admin/projects", label: "Project Section", icon: FolderKanban, color: "text-[#af52de]", bg: "bg-[#af52de]/5" },
  { href: "/admin/services", label: "Service Section", icon: Layers3, color: "text-[#34c759]", bg: "bg-[#34c759]/5" },
  { href: "/admin/contact", label: "Contact", icon: Mail, color: "text-[#ff2d55]", bg: "bg-[#ff2d55]/5" },
  { href: "/admin/import", label: "Import Section", icon: Database, color: "text-[#5856d6]", bg: "bg-[#5856d6]/5" },
];

export default function AdminShell({ 
  children,
  user
}: { 
  children: React.ReactNode;
  user?: SupabaseUser;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); // Default expanded for better productivity
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const activeHref = useMemo(() => {
    if (pathname === "/admin") {
      return "/admin";
    }

    const found = navItems.find((item) => pathname.startsWith(item.href) && item.href !== "/admin");
    return found?.href ?? "/admin";
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Sign out error:", error);
      window.location.href = "/admin/login";
    }
  };

  if (pathname.startsWith("/admin/login")) {
    return <div className="admin-theme">{children}</div>;
  }

  return (
    <div className="admin-theme flex h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${isSidebarExpanded ? "w-64" : "w-[80px]"} h-screen bg-white/80 border-r border-black/5 flex flex-col relative z-20 transition-all duration-300 ease-in-out shrink-0 backdrop-blur-xl`}
      >
        {/* Header/Logo */}
        <div
          className={`p-6 flex items-center ${
            isSidebarExpanded ? "justify-between" : "justify-center"
          }`}
        >
          {isSidebarExpanded ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-black rounded-[10px] flex items-center justify-center shadow-sm shrink-0">
                <FileCode2 className="w-5 h-5 text-white" />
              </div>
              <div className="overflow-hidden">
                <h1 className="text-[#1d1d1f] font-bold tracking-tight truncate text-[13px] uppercase">Studio</h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-[#34c759] shadow-[0_0_8px_rgba(52,199,89,0.5)]" />
                  <span className="text-[10px] text-[#86868b] font-medium tracking-wide uppercase truncate">
                    Editing
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-9 h-9 bg-black rounded-[10px] flex items-center justify-center shadow-sm shrink-0">
              <FileCode2 className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 no-scrollbar">
          {navItems.map((item) => {
            const active = activeHref === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={!isSidebarExpanded ? item.label : undefined}
                className={`w-full flex items-center ${isSidebarExpanded ? "gap-3 px-3" : "justify-center px-0"} py-2 rounded-lg transition-all duration-200 group ${
                  active
                    ? `bg-white border border-black/[0.03] shadow-sm relative text-[#1d1d1f]`
                    : "hover:bg-black/[0.03] text-[#86868b] hover:text-[#1d1d1f]"
                }`}
              >
                <div className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors ${active ? item.bg : "bg-transparent"}`}>
                  <item.icon className={`w-[18px] h-[18px] shrink-0 ${active ? item.color : "text-[#86868b] group-hover:text-[#1d1d1f]"}`} strokeWidth={active ? 2 : 1.5} />
                </div>
                {isSidebarExpanded ? (
                  <span className={`text-[13px] font-medium whitespace-nowrap truncate`}>{item.label}</span>
                ) : null}
              </Link>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="px-4 py-4 border-t border-black/[0.05] space-y-1">
          <button
            type="button"
            onClick={() => setIsSidebarExpanded((current) => !current)}
            className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3 gap-3" : "justify-center px-0"} py-2 rounded-lg text-[#86868b] hover:bg-black/[0.03] hover:text-[#1d1d1f] transition-all`}
            title={isSidebarExpanded ? "Collapse" : "Expand"}
          >
            {isSidebarExpanded ? <ChevronLeft className="w-[18px] h-[18px]" /> : <ChevronRight className="w-[18px] h-[18px]" />}
            {isSidebarExpanded && <span className="text-[13px] font-medium">Collapse</span>}
          </button>
          
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-3 gap-3" : "justify-center px-0"} py-2 rounded-lg text-[#86868b] hover:bg-[#ff3b30]/5 hover:text-[#ff3b30] transition-all disabled:opacity-50`}
            title="Log Out"
          >
            <LogOut className={`w-[18px] h-[18px] ${isLoggingOut ? "animate-pulse" : ""}`} />
            {isSidebarExpanded && <span className="text-[13px] font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative min-w-0 flex-1 h-screen overflow-y-auto overflow-x-hidden flex flex-col">
        {/* Top Header */}
        <header className="h-16 shrink-0 border-b border-black/[0.05] bg-white/60 backdrop-blur-xl flex items-center justify-between px-8 z-10 sticky top-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="w-full bg-black/[0.03] border-none rounded-full py-1.5 pl-10 pr-4 text-[13px] outline-none focus:ring-1 focus:ring-[#007aff]/30 transition-all placeholder:text-[#86868b]"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-[#86868b] hover:text-[#1d1d1f] transition-colors relative">
              <Bell className="w-5 h-5" strokeWidth={1.5} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#ff3b30] rounded-full border-2 border-white" />
            </button>
            <button className="p-2 text-[#86868b] hover:text-[#1d1d1f] transition-colors">
              <Settings className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <div className="h-6 w-[1px] bg-black/[0.05] mx-1" />
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-[12px] font-semibold text-[#1d1d1f]">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Admin"}
                </span>
                <span className="text-[10px] text-[#86868b]">System Admin</span>
              </div>
              {user?.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="User"
                  className="w-8 h-8 rounded-full border border-black/5"
                />
              ) : (
                <div className="w-8 h-8 bg-[#f5f5f7] rounded-full flex items-center justify-center border border-black/5 shadow-inner">
                  <User className="w-4 h-4 text-[#86868b]" />
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="relative flex-1 flex flex-col p-8 lg:p-10">
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[30rem] w-[50rem] -translate-x-1/2 rounded-full bg-[#007aff]/5 blur-[120px]" />
          <div className="relative flex-1 flex flex-col">{children}</div>
        </div>
      </main>
    </div>
  );
}

