import { NextResponse } from "next/server";

import { requireAdminAccess } from "@/lib/auth";
import {
  getApplication,
  updateApplicationStatus,
  logApplicationStatusUpdate,
  createOffer,
} from "@/lib/sheet";
import { sendApplicationStatusMail } from "@/lib/mail";
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

    const applicationStatus =
      status as ApplicationStatus;

    const previousStatus = application.status;

    if (previousStatus === applicationStatus) {
      return NextResponse.json(
        {
          success: false,
          message: "Application is already in this status",
        },
        { status: 400 }
      );
    }

    await updateApplicationStatus(
      applicationId,
      applicationStatus
    );

    let logCreated = false;
    let logError: string | null = null;

    try {
    if (!auth.user) {
        throw new Error("Authenticated user data is unavailable");
    }

    await logApplicationStatusUpdate({
        applicationId,
        previousStatus,
        newStatus: applicationStatus,
        changedBy: {
        name: auth.user.name,
        email: auth.user.email,
        role: auth.user.role,
        },
    });

    logCreated = true;
    } catch (error) {
    logError =
        error instanceof Error
        ? error.message
        : "Failed to create status update log";

    console.error(
        "Application status log error:",
        error
    );
    }

    let offerCreated = false;
    let offerError = "";

    if (applicationStatus === "Selected") {
    try {
        await createOffer({
        applicationId,
        createdBy: {
            name: auth.user.name,
            email: auth.user.email,
            role: auth.user.role,
        },
        });

        offerCreated = true;
    } catch (error) {
        offerError =
        error instanceof Error
            ? error.message
            : "Failed to create offer";

        console.error(
        "Create offer error:",
        error
        );
    }
    }

    
    let mailSent = false;
    let mailError: string | null = null;

    try {
      await sendApplicationStatusMail({
        to: application.personalEmail,
        name: application.fullName,
        status: applicationStatus,
      });

      mailSent = true;
    } catch (error) {
      mailError =
        error instanceof Error
          ? error.message
          : "Failed to send application status email";

      console.error(
        "Application status email error:",
        error
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        applicationId,
        previousStatus,
        status: applicationStatus,
        logCreated,
        mailSent,
        ...(logError && {
          logError,
        }),
        ...(mailError && {
          mailError,
        }),
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
