import { NextResponse } from "next/server";

import { requireAdminAccess } from "@/lib/auth";
import {
  getApplication,
  getNote,
  appendNote,
} from "@/lib/sheet";

type RouteContext = {
  params: Promise<{
    applicationNumber: string;
  }>;
};

/**
 * GET
 *
 * Get all notes for an application.
 */
export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const auth = await requireAdminAccess();

    if (!auth.authorized) {
      return NextResponse.json(
        {
          success: false,
          message:
            auth.status === 401
              ? "Unauthorized"
              : "Forbidden",
        },
        { status: auth.status }
      );
    }

    const { applicationNumber: applicationId } =
      await params;

    if (!applicationId?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Application ID is required",
        },
        { status: 400 }
      );
    }

    const application =
      await getApplication(applicationId);

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          message: "Application not found",
        },
        { status: 404 }
      );
    }

    const notes =
      await getNote(applicationId);

    return NextResponse.json({
      success: true,
      data: notes,
    });
  } catch (error) {
    console.error(
      "Get application notes API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to get notes",
      },
      { status: 500 }
    );
  }
}

/**
 * POST
 *
 * Append a new note for an application.
 */
export async function POST(
  request: Request,
  { params }: RouteContext
) {
  try {
    const auth = await requireAdminAccess();

    if (!auth.authorized) {
      return NextResponse.json(
        {
          success: false,
          message:
            auth.status === 401
              ? "Unauthorized"
              : "Forbidden",
        },
        { status: auth.status }
      );
    }

    const { applicationNumber: applicationId } =
      await params;

    if (!applicationId?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Application ID is required",
        },
        { status: 400 }
      );
    }

    const application =
      await getApplication(applicationId);

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          message: "Application not found",
        },
        { status: 404 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON body",
        },
        { status: 400 }
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      !("note" in body) ||
      typeof body.note !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Note is required",
        },
        { status: 400 }
      );
    }

    const note = body.note.trim();

    if (!note) {
      return NextResponse.json(
        {
          success: false,
          message: "Note cannot be empty",
        },
        { status: 400 }
      );
    }

    const result = await appendNote(
      applicationId,
      note
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(
      "Append application note API error:",
      error
    );

    if (
      error instanceof Error &&
      error.message.includes("does not exist")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to append note",
      },
      { status: 500 }
    );
  }
}