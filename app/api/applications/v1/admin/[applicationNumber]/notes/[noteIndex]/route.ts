import { NextResponse } from "next/server";

import { requireAdminAccess } from "@/lib/auth";
import {
  getApplication,
  deleteNote,
} from "@/lib/sheet";

type RouteContext = {
  params: Promise<{
    applicationNumber: string;
    noteIndex: string;
  }>;
};

export async function DELETE(
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

    const {
      applicationNumber: applicationId,
      noteIndex: noteIndexParam,
    } = await params;

    const noteIndex = Number(noteIndexParam);

    if (!applicationId?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Application ID is required",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(noteIndex) ||
      noteIndex < 1
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Note index must be a positive integer",
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

    const result = await deleteNote(
      applicationId,
      noteIndex
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(
      "Delete application note API error:",
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
        message: "Failed to delete note",
      },
      { status: 500 }
    );
  }
}