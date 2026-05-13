import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  const { response: adminResponse } = await requireAdminSession();
  if (adminResponse) return adminResponse;

  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch the URL' }, { status: 500 });
    }

    const html = await res.text();

    // Basic metadata extraction using regex to avoid bulky DOM parsers
    const getMeta = (property: string) => {
      const regex = new RegExp(`<meta [^>]*property=["']${property}["'][^>]*content=["']([^"']+)["']`, 'i');
      const nameRegex = new RegExp(`<meta [^>]*name=["']${property}["'][^>]*content=["']([^"']+)["']`, 'i');
      return html.match(regex)?.[1] || html.match(nameRegex)?.[1] || '';
    };

    const title = html.match(/<title>([^<]+)<\/title>/i)?.[1] || getMeta('og:title') || '';
    const description = getMeta('og:description') || getMeta('description') || '';
    const image = getMeta('og:image') || '';

    // Extract visible text for AI processing (first 3000 chars roughly)
    const cleanText = html
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
      .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 3000);

    return NextResponse.json({
      title,
      description,
      image,
      extractedText: cleanText,
    });
  } catch (error) {
    console.error('Metadata fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
