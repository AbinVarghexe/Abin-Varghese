import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function requireAdminSession() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      session: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  // Admin Check: Priority to Environment Variables for rapid development/fail-safe
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
    
  const isAdminByEmail = adminEmails.includes(user.email?.toLowerCase() || "");

  if (isAdminByEmail) {
    return { session: { user }, response: null };
  }

  // Fallback: Check Profiles table in Supabase
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "ADMIN") {
    return { session: { user }, response: null };
  }

  return {
    session: null,
    response: NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 }),
  };
}
