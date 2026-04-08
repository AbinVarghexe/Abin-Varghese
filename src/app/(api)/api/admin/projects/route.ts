import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminSession } from '@/lib/admin-auth';
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  content: z.string().min(1),
  imageUrl: z.string().url(),
  demoUrl: z.string().url().optional().nullable(),
  githubUrl: z.string().url().optional().nullable(),
  tags: z.array(z.string()),
  featured: z.boolean().optional(),
});

// Get all projects (admin view)
export async function GET() {
  const { response } = await requireAdminSession();
  if (response) {
    return response;
  }

  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new project
export async function POST(request: NextRequest) {
  const { response } = await requireAdminSession();
  if (response) {
    return response;
  }

  try {
    const body = await request.json();
    const data = projectSchema.parse(body);

    const project = await prisma.project.create({
      data: {
        ...data,
        demoUrl: data.demoUrl || null,
        githubUrl: data.githubUrl || null,
        featured: data.featured || false,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
