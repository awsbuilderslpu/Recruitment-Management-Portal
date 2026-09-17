// app/api/applications/[id]/route.ts

import { NextResponse } from 'next/server';
import { getAllApplications } from '@/lib/google-sheets';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const applications = await getAllApplications();
    const application = applications.find(
      (app) => app.applicationId === id
    );

    if (!application) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: application });
  } catch (error) {
    console.error(`[GET /api/applications/${(await params).id}] Error:`, error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch application',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}