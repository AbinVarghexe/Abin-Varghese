import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const { response } = await requireAdminSession();
  if (response) {
    return response;
  }

  const supabase = await createClient();
  const { data: submissions, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch submissions error:", error);
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }

  return NextResponse.json({ submissions });
}
