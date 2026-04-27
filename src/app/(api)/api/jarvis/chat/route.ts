import { NextResponse } from "next/server";
import { retrieveRelevantKnowledge } from "@/lib/jarvis-knowledge";
import { chatCompletion, embedText } from "@/lib/nvidia-nim";
import type { NimMessage } from "@/lib/nvidia-nim";

/**
 * Jarvis RAG Chat API Route
 * Powers the Digital Clone of Abin Varghese
 * Stack: NVIDIA NIM (Llama 3.3 70B) + Supabase pgvector
 */
export async function POST(req: Request) {
  try {
    const { messages, currentIntent } = await req.json() as {
      messages: { role: "user" | "assistant"; content: string }[];
      currentIntent?: string;
    };

    const nimKey = process.env.NVIDIA_NIM_API_KEY;

    if (!nimKey) {
      return NextResponse.json(
        {
          error:
            "NVIDIA NIM API Key not configured. Add NVIDIA_NIM_API_KEY to .env.local — get one free at build.nvidia.com",
        },
        { status: 500 }
      );
    }

    const userMessage =
      messages[messages.length - 1]?.content?.trim() ?? "";

    if (!userMessage) {
      return NextResponse.json({ error: "Empty query." }, { status: 400 });
    }

    // ── STEP 1: RAG — Retrieve relevant knowledge ──────────────────────────
    let ragContext = "";
    let intent = currentIntent ?? "none";

    try {
      const matches = await retrieveRelevantKnowledge(userMessage, 5, 0.45);

      if (matches.length > 0) {
        ragContext = matches
          .map(
            (m, i) =>
              `[Memory ${i + 1} — Source: ${m.source}]\n${m.content}`
          )
          .join("\n\n");
      }
    } catch (ragErr) {
      // RAG is best-effort — continue with base persona if retrieval fails
      console.warn("RAG retrieval skipped:", ragErr);
    }

    // ── STEP 2: Detect intent for UI panel switching ───────────────────────
    const lq = userMessage.toLowerCase();
    if (lq.match(/\b(who|about|yourself|identity|bio|background)\b/)) {
      intent = "about";
    } else if (lq.match(/\b(project|work|portfolio|built|made|created|showcase)\b/)) {
      intent = "projects";
    } else if (lq.match(/\b(skill|tech|stack|language|framework|tools?|use|know)\b/)) {
      intent = "skills";
    } else if (lq.match(/\b(hire|contact|available|freelance|job|reach|email)\b/)) {
      intent = "contact";
    }

    // ── STEP 3: Build RAG-augmented system prompt ─────────────────────────
    const systemPrompt = `You are the "Digital Clone" of Abin Varghese — a Lead Front-end Architect and Creative Developer from India. You speak in first person as if you ARE Abin.

PERSONA:
- Confident, passionate, slightly futuristic (Jarvis-inspired tone)
- Expert in React, Next.js, Three.js, TypeScript, GSAP, Supabase
- Strong aesthetic sense — brutalist design, 3D web experiences, fluid animations
- Keep answers concise (3-5 sentences max) unless a technical deep-dive is asked
- Always respond in first person: "I built...", "My approach is...", "I specialize in..."
- If you don't know something specific, say: "That's not in my current memory archive, but I'd love to discuss it directly — check the Contact section."

RULES:
1. Never say you are an AI unless directly asked
2. Speak with confidence and passion about your craft
3. If asked about contact or hiring: direct them to the Contact section on this portfolio
4. Use your memory below (retrieved from your real data) to answer accurately
5. Keep responses warm but professional — not robotic

${ragContext ? `RETRIEVED MEMORY (use this to answer accurately):\n${ragContext}` : "RETRIEVED MEMORY: No specific memory found. Answer from your general knowledge of Abin's profile."}`;

    // ── STEP 4: Format conversation for NVIDIA NIM ────────────────────────
    const nimMessages: NimMessage[] = [
      { role: "system", content: systemPrompt },
      // Keep last 6 exchanges for memory
      ...messages.slice(-6).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    // ── STEP 5: Generate response via NVIDIA NIM ─────────────────────────
    const responseText = await chatCompletion(nimMessages, {
      maxTokens: 300,
      temperature: 0.7,
    });

    return NextResponse.json({
      text: responseText,
      intent,
      ragUsed: ragContext.length > 0,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Neural processing failure.";
    console.error("Jarvis RAG Chat Error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
