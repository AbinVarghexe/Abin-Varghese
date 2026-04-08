import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/admin-auth";
import { getServicesContent, upsertServicesContent } from "@/lib/services-content";
import type { Service } from "@/constants/services";

const projectLinkSchema = z.object({
  label: z.string(),
  url: z.string(),
  icon: z
    .enum([
      "Figma",
      "Github",
      "Globe",
      "ExternalLink",
      "Code2",
      "Zap",
      "Instagram",
      "Youtube",
      "Dribbble",
      "Box",
    ])
    .optional(),
});

const serviceContentSchema = z.object({
  type: z.enum(["image", "video", "text", "project"]),
  url: z.string().optional(),
  title: z.string(),
  description: z.string(),
  date: z.string().optional(),
  duration: z.string().optional(),
  role: z.string().optional(),
  projectIcon: z.string().optional(),
  mockupImage: z.string().optional(),
  threeDModel: z.string().optional(),
  videoUrl: z.string().optional(),
  projectLinks: z.array(projectLinkSchema).optional(),
  techStack: z.array(z.string()).optional(),
  bgColor: z.string().optional(),
});

const serviceSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  detailedDescription: z.string(),
  accentColor: z.string(),
  providedServices: z.array(z.string()),
  contents: z.array(serviceContentSchema).optional(),
  projectsUrl: z.string().optional(),
  projectsLabel: z.string().optional(),
});

const payloadSchema = z.object({
  services: z.array(serviceSchema),
});

export async function GET() {
  const { response } = await requireAdminSession();
  if (response) {
    return response;
  }

  const services = await getServicesContent();
  return NextResponse.json({ services });
}

export async function PUT(request: NextRequest) {
  const { response } = await requireAdminSession();
  if (response) {
    return response;
  }

  try {
    const body = await request.json();
    const data = payloadSchema.parse(body);

    await upsertServicesContent(data.services as Service[]);
    return NextResponse.json({ services: data.services });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid services payload", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Failed to save services" }, { status: 500 });
  }
}
