import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { getAdminDashboardData } from "@/lib/sheet";

const ALLOWED_ROLES = new Set([
  "core",
  "admin",
]);

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
     * Only Core and Admin users can access
     * the recruitment admin dashboard.
     */

    if (!ALLOWED_ROLES.has(user.role.toLowerCase())) {
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
     * Dashboard data
     * ----------------------------------------------------------
     */

    const data =
      await getAdminDashboardData();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "Admin dashboard API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load admin dashboard",
      },
      { status: 500 }
    );
  }
}