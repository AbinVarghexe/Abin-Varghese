import { NextResponse } from "next/server";

/**
 * Legacy Chat Route — now redirects internally to NVIDIA NIM RAG endpoint
 * This preserves backward compatibility with any existing references.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/jarvis/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Proxy error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
