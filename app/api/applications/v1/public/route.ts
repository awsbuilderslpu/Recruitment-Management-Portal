import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { getApplicationByEmail } from "@/lib/sheet";

export async function GET() {
  try {
    /**
     * ----------------------------------------------------------
     * Authentication
     * ----------------------------------------------------------
     */

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

    /**
     * ----------------------------------------------------------
     * Authorization
     * ----------------------------------------------------------
     *
     * This endpoint is specifically for members.
     */

    if (user.role.toLowerCase() !== "member") {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        { status: 403 }
      );
    }

    /**
     * ----------------------------------------------------------
     * Find user's application
     * ----------------------------------------------------------
     *
     * The email comes directly from the authenticated
     * SSO user. The client cannot provide another email.
     *
     * getApplicationByEmail() checks:
     *
     * F = University Email
     * G = Personal Email
     */

    const application =
      await getApplicationByEmail(user.email);

    /**
     * ----------------------------------------------------------
     * No application
     * ----------------------------------------------------------
     */

    if (!application) {
      return NextResponse.json({
        success: true,
        applied: false,
        data: null,
      });
    }

    /**
     * ----------------------------------------------------------
     * Application found
     * ----------------------------------------------------------
     */

    return NextResponse.json({
      success: true,
      applied: true,
      data: application,
    });
  } catch (error) {
    console.error(
      "Get member application API error:",
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