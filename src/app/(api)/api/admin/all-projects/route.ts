import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { getAllProjects } from "@/lib/github-projects";

export async function GET() {
  const { response } = await requireAdminSession();
  if (response) return response;

  try {
    const projects = await getAllProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Failed to fetch all projects:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
