import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, FileText } from "lucide-react";

import { getCurrentUser } from "@/lib/auth";
import {
  getApplication,
  getOfferByApplicationId,
} from "@/lib/sheet";

import AcceptOfferButton from "./AcceptOfferButton";

interface OfferPageProps {
  params: Promise<{
    applicationId: string;
  }>;
}

export default async function OfferPage({
  params,
}: OfferPageProps) {
  const { applicationId } = await params;

  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (user.role.toLowerCase() !== "member") {
    notFound();
  }

  const application = await getApplication(applicationId);

  if (!application) {
    notFound();
  }

  /*
   * An offer is available only for applicants who have
   * been selected or have already accepted the offer.
   */
  if (
    application.status !== "Selected" &&
    application.status !== "Accepted Offer"
  ) {
    redirect("/dashboard");
  }

  const offer = await getOfferByApplicationId(
    application.applicationId
  );

  if (!offer) {
    notFound();
  }

  /*
   * Verify that the authenticated SSO user owns
   * this offer.
   *
   * The offer stores the candidate email at the time
   * it is created, so this is the identity we verify.
   */
  if (
    offer.candidateEmail.trim().toLowerCase() !==
    user.email.trim().toLowerCase()
  ) {
    notFound();
  }

  const accepted = offer.status === "Accepted";

  const whatsappInviteUrl =
    process.env.AWS_LPU_WHATSAPP_GROUP_INVITE_URL;

  return (
    <section className="min-h-[70vh] bg-background px-6 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            AWS Student Builder Group · LPU
          </p>

          <h1 className="text-3xl font-semibold tracking-tight">
            {accepted ? "Offer Letter" : "Your Offer"}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Application {application.applicationId}
          </p>
        </div>

        {/* Offer Letter */}
        <div className="border border-border bg-background">
          {/* Letter Header */}
          <div className="border-b border-border px-6 py-8 sm:px-10">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Offer Letter
                </p>

                <h2 className="mt-3 text-2xl font-semibold">
                  Congratulations, {offer.candidateName}!
                </h2>
              </div>

              <div
                className={[
                  "shrink-0 border px-3 py-1.5 text-xs font-medium",
                  accepted
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-orange-200 bg-orange-50 text-orange-700",
                ].join(" ")}
              >
                {accepted ? "Accepted" : "Offer Pending"}
              </div>
            </div>
          </div>

          {/* Letter Body */}
          <div className="space-y-8 px-6 py-8 sm:px-10">
            <div className="flex gap-4">
              <div className="mt-0.5 shrink-0">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="space-y-4 text-sm leading-7 text-muted-foreground">
                <p>
                  We are pleased to offer you a position with the
                  AWS Student Builder Group at Lovely Professional
                  University.
                </p>

                <p>
                  Based on your application and the recruitment
                  process, we are offering you the role of{" "}
                  <strong className="font-semibold text-foreground">
                    {offer.role}
                  </strong>
                  .
                </p>

                <p>
                  We look forward to having you contribute to the
                  community, collaborate with fellow builders, and
                  take part in the initiatives of the AWS Student
                  Builder Group at LPU.
                </p>
              </div>
            </div>

            {/* Offer Details */}
            <div className="grid gap-px border border-border bg-border sm:grid-cols-2">
              <div className="bg-background p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Candidate
                </p>

                <p className="mt-2 text-sm font-medium">
                  {offer.candidateName}
                </p>
              </div>

              <div className="bg-background p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Role
                </p>

                <p className="mt-2 text-sm font-medium">
                  {offer.role}
                </p>
              </div>

              <div className="bg-background p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Offer ID
                </p>

                <p className="mt-2 font-mono text-sm">
                  {offer.offerId}
                </p>
              </div>

              <div className="bg-background p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Issued
                </p>

                <p className="mt-2 text-sm font-medium">
                  {new Date(
                    offer.createdAt
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Pending Offer */}
            {!accepted ? (
              <div className="border-t border-border pt-8">
                <p className="text-sm leading-6 text-muted-foreground">
                  Please review the offer details above. By
                  accepting this offer, you confirm your
                  acceptance of the role with the AWS Student
                  Builder Group at LPU and agree to the associated
                  Non-Disclosure Agreement.
                </p>

                <div className="mt-6">
                  <AcceptOfferButton
                    offerId={offer.offerId}
                  />
                </div>
              </div>
            ) : (
              /* Accepted Offer */
              <div className="border-t border-border pt-8">
                <div className="flex gap-4">
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-green-600" />

                  <div>
                    <h3 className="font-semibold">
                      Offer accepted
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Your acceptance has been recorded. Welcome
                      to the AWS Student Builder Group at LPU.
                    </p>

                    {offer.acceptedAt && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        Accepted on{" "}
                        {new Date(
                          offer.acceptedAt
                        ).toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>
                </div>

                {/* WhatsApp */}
                {whatsappInviteUrl && (
                  <div className="mt-8 border border-border p-5">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      Next Step
                    </p>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Join the official AWS Student Builder Group
                      WhatsApp community using the invite below.
                    </p>

                    <a
                      href={whatsappInviteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex border border-foreground px-5 py-3 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
                    >
                      Join WhatsApp Group
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Back */}
        <div className="mt-6">
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
