import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin-auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  const { response: adminResponse } = await requireAdminSession();
  if (adminResponse) return adminResponse;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Gemini API Key is not configured' }, { status: 500 });
  }

  try {
    const { title, rawText, category } = await request.json();
    
    if (!title || !category) {
      return NextResponse.json({ error: 'Title and Category are required for AI generation' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const context = rawText?.trim() || "No specific context provided. Generate based on title and category.";

    const prompt = `
      You are a professional portfolio writer. Write a high-end description and a detailed case study for this project.
      
      PROJECT INFO:
      - Title: ${title}
      - Category: ${category}
      - Context: ${context}

      OUTPUT JSON STRUCTURE:
      {
        "description": "2-3 sentence impactful overview.",
        "content": "Detailed case study in Markdown (## The Challenge, ## Our Approach, ## The Impact).",
        "tags": ["relevant", "design", "keywords"]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // With responseMimeType: "application/json", text should be clean JSON
      // but we wrap in a fallback just in case
      const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text;
      const data = JSON.parse(jsonStr);
      return NextResponse.json(data);
    } catch (parseError) {
      console.error('JSON Parse Error:', text);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('AI generation error:', error);
    const message = error.message || 'AI generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
