import { NextResponse } from "next/server";

import { requireAdminAccess } from "@/lib/auth";
import {
  getApplication,
  updateApplicationStatus,
} from "@/lib/sheet";
import type { ApplicationStatus } from "@/lib/types";

const ALLOWED_STATUSES: ApplicationStatus[] = [
  "Pending",
  "Shortlisted",
  "Interview Scheduled",
  "Selected",
  "Rejected",
];

type RouteContext = {
  params: Promise<{
    applicationNumber: string;
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
      !("status" in body) ||
      typeof body.status !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Status is required",
        },
        { status: 400 }
      );
    }

    const status = body.status.trim();

    if (
      !ALLOWED_STATUSES.includes(
        status as ApplicationStatus
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid application status",
          allowedStatuses: ALLOWED_STATUSES,
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

    await updateApplicationStatus(
      applicationId,
      status as ApplicationStatus
    );

    return NextResponse.json({
      success: true,
      data: {
        applicationId,
        status,
      },
    });
  } catch (error) {
    console.error(
      "Update application status API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update application status",
      },
      { status: 500 }
    );
  }
}