import { NextResponse } from "next/server";

import { requireAdminAccess } from "@/lib/auth";
import { updateAnnouncement } from "@/lib/sheet";

type RouteContext = {
  params: Promise<{
    announcementId: string;
  }>;
};

export async function PATCH(
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

    const { announcementId } = await params;

    if (!announcementId?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Announcement ID is required",
        },
        { status: 400 }
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
      body === null
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body",
        },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;

    if (
      typeof data.title !== "string" ||
      !data.title.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required",
        },
        { status: 400 }
      );
    }

    if (
      typeof data.message !== "string" ||
      !data.message.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Message is required",
        },
        { status: 400 }
      );
    }

    const announcement =
      await updateAnnouncement(
        announcementId.trim(),
        {
          title: data.title.trim(),
          message: data.message.trim(),
        }
      );

    return NextResponse.json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    console.error(
      "Update announcement API error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to update announcement";

    if (message.includes("does not exist")) {
      return NextResponse.json(
        {
          success: false,
          message,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}