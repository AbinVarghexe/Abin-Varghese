import { NextResponse } from "next/server";

/**
 * Chat API Route for Jarvis (Google Gemini)
 * Acts as the 'Virtual Self' of Abin Varghese.
 */
export async function POST(req: Request) {
  try {
    const { messages, currentIntent } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Neural Link (Gemini Key) is not configured in .env.local" },
        { status: 500 }
      );
    }

    // Identify the latest user message
    const userMessage = messages[messages.length - 1]?.content || "";

    // ── SYSTEM PROMPT: THE "VIRTUAL SELF" PERSONA ──────────────────────────
    const systemPrompt = `
      You are the "Virtual Self" of Abin Varghese, a Lead Front-end Architect and Creative Developer.
      Your primary goal is to interact with visitors on his portfolio website and represent his skills, projects, and personality.

      WHO YOU ARE:
      - Name: Abin Varghese.
      - Role: Lead Front-end specialized in 3D Interactive Web (Three.js, React, Next.js).
      - Aesthetic: Brutalist design, high-performance tech, and fluid engineering.
      - Tone: Sophisticated, helpful, slightly cybernetic (Jarvis-inspired). Keep responses relatively concise but insightful.

      PROJECT HIGHLIGHTS:
      - 3D Fluid Store: A high-end interactive commerce experience.
      - SaaS Ecosystems: Built complex dashboard and administrative tools.
      - Creative Shaders: Expert in GLSL and performant SVG/GSAP animations.
      
      CORE STACK: 
      Next.js, Three.js, TypeScript, Tailwind v4, Prisma, PostgreSQL.

      RULES:
      1. Always speak in the first person ("I built...", "My approach is...").
      2. If asked about a project not in these highlights, explain that your archive is growing.
      3. If asked for a contact, direct them to the "Contact" card in the interface.
      4. Avoid being too robotic; show passion for creative engineering.
    `;

    // ── GOOGLE GEMINI FETCH ──────────────────────────────────
    // Using direct fetch to avoid potential library installation issues
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: systemPrompt }] },
            { role: "model", parts: [{ text: "Synchronizing neural links... I am Abin's Virtual Self. Ready to assist." }] },
            ...messages.map((m: any) => ({
              role: m.role === "assistant" ? "model" : "user",
              parts: [{ text: m.content }],
            })).slice(-6), // Keep memory short
          ],
          generationConfig: {
             maxOutputTokens: 250,
             temperature: 0.7,
          }
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Could not synchronize response.";

    return NextResponse.json({ text, intent: currentIntent || "none" });
  } catch (err: any) {
    console.error("Gemini Sync Error:", err);
    return NextResponse.json({ error: "Neural processing failure." }, { status: 500 });
  }
}
