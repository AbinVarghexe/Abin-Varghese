import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";

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

    const submission = await prisma.contactSubmission.update({
      where: { id },
      data: { status: data.status },
    });

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
    await prisma.contactSubmission.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete submission" }, { status: 500 });
  }
}
