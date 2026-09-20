import { NextResponse } from "next/server";

import { requireAdminAccess } from "@/lib/auth";
import { getApplication } from "@/lib/sheet";

type RouteContext = {
  params: Promise<{
    applicationNumber: string;
  }>;
};

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

    return NextResponse.json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error(
      "Get application API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to get application",
      },
      { status: 500 }
    );
  }
}