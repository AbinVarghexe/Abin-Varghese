// GET /api/projects - Fetch all projects from database
// Returns list of projects sorted by creation date (newest first)

import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Normalize to camelCase for frontend compatibility
    const normalizedProjects = (projects || []).map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      content: p.content,
      type: p.type,
      mediaType: p.media_type,
      mediaUrl: p.media_url,
      externalUrl: p.external_url,
      iframeUrl: p.iframe_url,
      category: p.category,
      tags: p.tags || [],
      dominantColor: p.dominant_color,
      previewHeight: p.preview_height,
      featured: p.featured,
      workspace: p.workspace,
      slug: p.slug,
      createdAt: p.created_at,
    }));

    return NextResponse.json(normalizedProjects, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
