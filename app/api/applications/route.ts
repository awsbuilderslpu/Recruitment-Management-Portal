import { NextResponse } from 'next/server';
import { getAllApplications } from '@/lib/google-sheets';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const status = searchParams.get('status') || '';
    const sort = searchParams.get('sort') || 'timestamp_desc';

    let applications = await getAllApplications();

    // Backend Filtering
    if (search) {
      applications = applications.filter(app => 
        app.fullName.toLowerCase().includes(search) || 
        app.registrationNumber.toLowerCase().includes(search) ||
        app.universityEmail.toLowerCase().includes(search)
      );
    }
    if (status) {
      applications = applications.filter(app => app.status === status);
    }

    // Backend Sorting
    if (sort === 'timestamp_desc') {
      applications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } else if (sort === 'timestamp_asc') {
      applications.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }

    return NextResponse.json({ success: true, data: applications });
  } catch (error) {
    console.error('[GET /api/applications] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch applications',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}