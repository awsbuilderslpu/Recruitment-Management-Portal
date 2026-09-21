import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import {
  getApplicationByEmail,
  getOfferByApplicationId,
  acceptOffer,
} from "@/lib/sheet";

export async function POST(request: Request) {
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

    const formData = await request.formData();

    const offerId = formData
      .get("offerId")
      ?.toString()
      .trim();

    if (!offerId) {
      return NextResponse.json(
        {
          success: false,
          message: "Offer ID is required",
        },
        { status: 400 }
      );
    }

    /*
     * Find the application using the authenticated
     * user's email — never from the request body.
     */
    const application =
      await getApplicationByEmail(user.email);

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          message: "Application not found",
        },
        { status: 404 }
      );
    }

    const offer =
      await getOfferByApplicationId(
        application.applicationId
      );

    if (!offer) {
      return NextResponse.json(
        {
          success: false,
          message: "Offer not found",
        },
        { status: 404 }
      );
    }

    /*
     * Make sure the submitted offer belongs to
     * the authenticated user's application.
     */
    if (
      offer.offerId.toLowerCase() !==
      offerId.toLowerCase()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid offer",
        },
        { status: 403 }
      );
    }

    if (offer.status === "Accepted") {
      return NextResponse.redirect(
        new URL(
          `/applications/my/${application.applicationId}/offer`,
          request.url
        )
      );
    }

    if (offer.status !== "Pending") {
      return NextResponse.json(
        {
          success: false,
          message: "This offer cannot be accepted",
        },
        { status: 400 }
      );
    }

    await acceptOffer({
      offerId: offer.offerId,
      candidateEmail: user.email,
    });

    return NextResponse.redirect(
      new URL(
        `/applications/my/${application.applicationId}/offer`,
        request.url
      )
    );
  } catch (error) {
    console.error("Accept offer error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to accept offer",
      },
      { status: 500 }
    );
  }
}
