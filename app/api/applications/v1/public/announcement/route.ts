import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import {
  getApplicationByEmail,
  getApplicationAnnouncement,
} from "@/lib/sheet";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    if (user.role.toLowerCase() !== "member") {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        { status: 403 }
      );
    }

    const application =
      await getApplicationByEmail(user.email);

    if (!application) {
      return NextResponse.json({
        success: true,
        announcement: null,
      });
    }

    const announcement =
      await getApplicationAnnouncement(
        application.applicationId
      );

    return NextResponse.json({
      success: true,
      announcement,
    });
  } catch (error) {
    console.error(
      "Get member announcement API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to get announcement",
      },
      { status: 500 }
    );
  }
}