// GET /api/projects - Fetch all projects from database
// Returns list of projects sorted by creation date (newest first)

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [
        { featured: 'desc' }, // Featured projects first
        { createdAt: 'desc' }, // Then by newest
      ],
    });

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
