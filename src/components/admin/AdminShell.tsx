"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  ChevronLeft,
  ChevronRight,
  Database,
  FileCode2,
  FolderKanban,
  Home,
  Layers3,
  LogOut,
  Mail,
  LayoutDashboard,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/home", label: "Home", icon: Home },
  { href: "/admin/about", label: "About", icon: User },
  { href: "/admin/projects", label: "Project Section", icon: FolderKanban },
  { href: "/admin/services", label: "Service Section", icon: Layers3 },
  { href: "/admin/contact", label: "Contact", icon: Mail },
  { href: "/admin/import", label: "Import Section", icon: Database },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const activeHref = useMemo(() => {
    if (pathname === "/admin") {
      return "/admin";
    }

    const found = navItems.find((item) => pathname.startsWith(item.href) && item.href !== "/admin");
    return found?.href ?? "/admin";
  }, [pathname]);

  if (pathname.startsWith("/admin/login")) {
    return <>{children}</>;
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#f7f4ef] flex items-center justify-center text-[#0020d7] font-mono">
        Initializing Admin Console...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[linear-gradient(180deg,#f7f4ef_0%,#f0eee9_60%,#ece7df_100%)] text-[#0b0b0c] font-sans overflow-hidden">
      <aside
        className={`${isSidebarExpanded ? "w-72" : "w-[88px]"} h-screen bg-white/85 border-r border-[var(--color-border-light)] flex flex-col relative z-20 transition-all duration-300 ease-in-out shrink-0 backdrop-blur`}
      >
        <div
          className={`p-6 border-b border-[var(--color-border-light)] flex items-center ${
            isSidebarExpanded ? "justify-between" : "justify-center"
          }`}
        >
          {isSidebarExpanded ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#dbe7ff] border border-[var(--color-border-dark)] rounded-xl flex items-center justify-center shadow-[0_8px_18px_rgba(0,32,215,0.16)] shrink-0">
                <FileCode2 className="w-5 h-5 text-[#0020d7]" />
              </div>
              <div className="overflow-hidden">
                <h1 className="text-[#0b0b0c] font-semibold tracking-wide truncate">ADMIN STUDIO</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-[#0020d7] animate-pulse" />
                  <span className="text-[10px] text-[#0020d7] font-mono tracking-widest uppercase truncate">
                    Live Editing
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-[#dbe7ff] border border-[var(--color-border-dark)] rounded-xl flex items-center justify-center shadow-[0_8px_18px_rgba(0,32,215,0.16)] shrink-0">
              <FileCode2 className="w-5 h-5 text-[#0020d7]" />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 no-scrollbar">
          {navItems.map((item) => {
            const active = activeHref === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={!isSidebarExpanded ? item.label : undefined}
                className={`w-full flex items-center ${isSidebarExpanded ? "gap-3 px-4" : "justify-center px-0"} py-3 rounded-xl transition-all duration-200 ${
                  active
                    ? "bg-[#dbe7ff] border border-[var(--color-border-dark)] text-[#0020d7] shadow-[0_8px_18px_rgba(0,32,215,0.14)] relative"
                    : "hover:bg-[#f3f4f6] text-[var(--color-text-body)] hover:text-[#0b0b0c]"
                }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${active ? "text-[#0020d7]" : ""}`} />
                {isSidebarExpanded ? (
                  <span className="font-medium text-sm whitespace-nowrap truncate">{item.label}</span>
                ) : null}
                {!isSidebarExpanded && active ? (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#0020d7] rounded-r-md" />
                ) : null}
              </Link>
            );
          })}
        </div>

        <div className="px-4 py-2">
          <button
            type="button"
            onClick={() => setIsSidebarExpanded((current) => !current)}
            className={`w-full flex items-center ${isSidebarExpanded ? "justify-start px-4 gap-3" : "justify-center px-0"} py-3 rounded-xl hover:bg-[#f3f4f6] text-[var(--color-text-body)] hover:text-[#0b0b0c] transition-colors border border-transparent hover:border-[var(--color-border-light)]`}
            title={isSidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isSidebarExpanded ? (
              <ChevronLeft className="w-4 h-4 shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 shrink-0" />
            )}
            {isSidebarExpanded ? <span className="text-sm font-medium">Collapse</span> : null}
          </button>
        </div>

        <div
          className={`p-4 border-t border-[var(--color-border-light)] flex items-center ${
            isSidebarExpanded ? "justify-between" : "flex-col gap-4 justify-center"
          }`}
        >
          <div className={`flex items-center gap-3 overflow-hidden ${!isSidebarExpanded ? "justify-center" : ""}`}>
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt="User"
                className="w-9 h-9 shrink-0 rounded-full border border-[var(--color-border-medium)]"
              />
            ) : (
              <div className="w-9 h-9 shrink-0 bg-[#f1f2f6] rounded-full flex items-center justify-center">
                <FileCode2 className="w-4 h-4 text-[#0b0b0c]" />
              </div>
            )}

            {isSidebarExpanded ? (
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium text-[#0b0b0c] truncate">
                  {session?.user?.name || "Admin"}
                </span>
                <span className="text-[10px] text-[var(--color-text-body)] truncate">
                  {session?.user?.email || "Unknown user"}
                </span>
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="p-2 hover:bg-[#f3f4f6] rounded-lg transition-colors text-[var(--color-text-body)] hover:text-[#0b0b0c] shrink-0"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      <main className="relative min-w-0 flex-1 h-screen overflow-y-auto overflow-x-hidden">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-[#7da3f6]/30 blur-[110px]" />
        <div className="pointer-events-none absolute bottom-[-12rem] right-[-9rem] h-80 w-80 rounded-full bg-[#dcd6ff]/35 blur-[100px]" />
        <div className="relative p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
