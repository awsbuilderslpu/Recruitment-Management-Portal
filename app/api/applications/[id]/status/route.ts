import { NextResponse } from 'next/server';
import { getApplicationById, updateApplicationStatus } from '@/lib/google-sheets';

const VALID_STATUSES = [
  'Pending',
  'Shortlisted',
  'Interview Scheduled',
  'Selected',
  'Rejected',
];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const application = await getApplicationById(id);
    if (!application) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    await updateApplicationStatus(application.rowIndex, status);

    return NextResponse.json({
      success: true,
      message: `Status updated to "${status}"`,
      applicationId: id,
      newStatus: status,
    });
  } catch (error) {
    console.error('[PATCH /api/applications/[id]/status] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}