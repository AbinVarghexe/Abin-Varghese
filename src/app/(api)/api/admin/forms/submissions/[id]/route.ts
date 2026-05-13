import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-auth";
import { createClient } from "@/utils/supabase/server";

const patchSchema = z.object({
  status: z.enum(["unread", "read", "replied"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireAdminSession();
  if (response) {
    return response;
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const data = patchSchema.parse(body);

    const supabase = await createClient();
    const { data: submission, error } = await supabase
      .from("contact_submissions")
      .update({ status: data.status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ submission });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid submission update payload", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Failed to update submission" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireAdminSession();
  if (response) {
    return response;
  }

  try {
    const { id } = await params;
    const supabase = await createClient();
    const { error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete submission" }, { status: 500 });
  }
}
