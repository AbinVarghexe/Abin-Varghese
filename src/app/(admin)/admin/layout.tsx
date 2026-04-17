import React from "react";
import AdminShell from "@/components/admin/AdminShell";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || "";
  
  // Skip auth check for login page to avoid infinite redirect loop
  if (pathname.startsWith('/admin/login')) {
    return <>{children}</>;
  }

  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/admin/login");
  }

  // 1. Check if user is in ADMIN_EMAILS environment variable
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
    
  const isAdminByEmail = adminEmails.includes(user.email?.toLowerCase() || "");

  if (isAdminByEmail) {
    return (
      <AdminShell user={user}>{children}</AdminShell>
    );
  }

  // 2. Fallback: Check if user is marked as ADMIN in the profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "ADMIN") {
    // If user is neither in environment list nor database admin list
    redirect("/admin/login?error=AccessDenied");
  }

  return (
    <AdminShell user={user}>{children}</AdminShell>
  );
}
