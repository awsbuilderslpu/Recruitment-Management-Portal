import { NextResponse } from "next/server";

import { requireAdminAccess } from "@/lib/auth";
import {
  createAnnouncement,
  getAllAnnouncements,
} from "@/lib/sheet";
import type { ApplicationStatus } from "@/lib/types";

const ALLOWED_ANNOUNCEMENT_STATUSES: ApplicationStatus[] = [
  "Shortlisted",
  "Interview Scheduled",
  "Selected",
  "Accepted Offer",
];

export async function GET() {
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

    const announcements =
      await getAllAnnouncements();

    return NextResponse.json({
      success: true,
      count: announcements.length,
      data: announcements,
    });
  } catch (error) {
    console.error(
      "Get announcements API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to get announcements",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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
      typeof data.status !== "string" ||
      !data.status.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Status is required",
        },
        { status: 400 }
      );
    }

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

    const status =
      data.status.trim() as ApplicationStatus;

    if (
      !ALLOWED_ANNOUNCEMENT_STATUSES.includes(status)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Announcements are only allowed for Shortlisted, Interview Scheduled, Selected, or Accepted Offer",
          allowedStatuses:
            ALLOWED_ANNOUNCEMENT_STATUSES,
        },
        { status: 400 }
      );
    }

    const announcement =
      await createAnnouncement({
        status,
        title: data.title.trim(),
        message: data.message.trim(),
      });

    return NextResponse.json(
      {
        success: true,
        data: announcement.announcement,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Create announcement API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create announcement",
      },
      { status: 500 }
    );
  }
}