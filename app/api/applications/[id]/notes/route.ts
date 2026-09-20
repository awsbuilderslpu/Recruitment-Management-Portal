import { NextResponse } from 'next/server';
import {
  getApplicationById,
  getNotesForApplication,
  addNote,
} from '@/lib/google-sheets';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const application = await getApplicationById(id);
    if (!application) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    const notes = await getNotesForApplication(id);

    return NextResponse.json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    console.error('[GET /api/applications/[id]/notes] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch notes',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { author, note } = body;

    if (!note || typeof note !== 'string' || note.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Note text is required' },
        { status: 400 }
      );
    }
    if (!author || typeof author !== 'string' || author.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Author is required' },
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

    const created = await addNote(id, author.trim(), note.trim());

    return NextResponse.json(
      { success: true, message: 'Note added', data: created },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/applications/[id]/notes] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add note',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}