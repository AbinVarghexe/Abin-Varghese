import { NextResponse } from "next/server";
import { ingestGitHub, ingestText, getKnowledgeStats } from "@/lib/jarvis-knowledge";
import type { KnowledgeSource } from "@/lib/jarvis-knowledge";
import { requireAdminSession } from "@/lib/admin-auth";

/**
 * Jarvis Knowledge Sync API
 * GET  /api/jarvis/sync?source=github  → Sync GitHub data
 * GET  /api/jarvis/sync?source=stats   → Get knowledge stats
 * POST /api/jarvis/sync                → Ingest manual text / PDF text
 */

export async function GET(req: Request) {
  try {
    const { response: authError } = await requireAdminSession();
    if (authError) return authError;

    const { searchParams } = new URL(req.url);
    const source = searchParams.get("source");

    if (source === "stats") {
      const stats = await getKnowledgeStats();
      return NextResponse.json(stats);
    }

    if (source === "github") {
      const result = await ingestGitHub();
      return NextResponse.json({
        success: true,
        message: `Synced GitHub: ${result.inserted} chunks ingested`,
        ...result,
      });
    }

    return NextResponse.json(
      { error: "Unknown source. Use ?source=github or ?source=stats" },
      { status: 400 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Sync failed";
    console.error("Jarvis Sync Error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { response: authError } = await requireAdminSession();
    if (authError) return authError;

    const body = await req.json() as { text: string; source: KnowledgeSource };
    const { text, source } = body;

    if (!text || text.trim().length < 10) {
      return NextResponse.json(
        { error: "Text too short. Minimum 10 characters." },
        { status: 400 }
      );
    }

    const validSources: KnowledgeSource[] = [
      "linkedin_pdf",
      "resume",
      "manual",
    ];
    if (!validSources.includes(source)) {
      return NextResponse.json(
        { error: `Invalid source. Use: ${validSources.join(", ")}` },
        { status: 400 }
      );
    }

    const result = await ingestText(text, source);

    return NextResponse.json({
      success: true,
      message: `Ingested ${result.inserted} knowledge chunks from ${source}`,
      ...result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Ingest failed";
    console.error("Jarvis Ingest Error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
