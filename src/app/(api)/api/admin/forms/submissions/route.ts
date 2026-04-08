import { NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const { response } = await requireAdminSession();
  if (response) {
    return response;
  }

  const submissions = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ submissions });
}
