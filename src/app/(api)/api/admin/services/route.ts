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
  linkedProjectId: z.string().optional(),
  url: z.string().optional(),
  title: z.string(),
  description: z.string(),
  date: z.string().optional(),
  duration: z.string().optional(),
  role: z.string().optional(),
  projectIcon: z.string().optional(),
  mockupImage: z.string().optional(),
  embedIframeSrc: z.string().optional(),
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
  iconUrl: z.string().optional(),
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

import { LRUCache } from "lru-cache";

// LRU cache-based rate limiting to prevent spam and accidental infinite loops
const RATE_LIMIT_WINDOW_MS = 1000 * 60; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // Max 30 updates per minute

const ipRequestCache = new LRUCache<string, { count: number; timestamp: number }>({
  max: 1000,
  ttl: RATE_LIMIT_WINDOW_MS,
});

export async function PUT(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();
  const record = ipRequestCache.get(ip);

  if (record) {
    if (now - record.timestamp < RATE_LIMIT_WINDOW_MS) {
      record.count += 1;
      if (record.count > MAX_REQUESTS_PER_WINDOW) {
        return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
      }
    } else {
      ipRequestCache.set(ip, { count: 1, timestamp: now });
    }
  } else {
    ipRequestCache.set(ip, { count: 1, timestamp: now });
  }

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
