"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ExternalLink,
  X,
} from "lucide-react";

interface AcceptOfferButtonProps {
  offerId: string;
}

export default function AcceptOfferButton({
  offerId,
}: AcceptOfferButtonProps) {
  const [open, setOpen] = useState(false);
  const [acceptedNda, setAcceptedNda] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleAccept() {
    if (!acceptedNda || submitting) {
      return;
    }

    setSubmitting(true);

    const formData = new FormData();

    formData.append("offerId", offerId);
    formData.append("ndaAccepted", "true");

    try {
      const response = await fetch(
        "/api/applications/v1/public/offer/accept",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.redirected) {
        window.location.href = response.url;
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to accept offer"
        );
      }

      window.location.reload();
    } catch (error) {
      console.error("Accept offer error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to accept offer"
      );

      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 border border-foreground bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        Accept Offer
        <CheckCircle2 className="h-4 w-4" />
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="accept-offer-title"
        >
          <div className="w-full max-w-lg border border-border bg-background shadow-xl">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border px-6 py-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Final Step
                </p>

                <h2
                  id="accept-offer-title"
                  className="mt-2 text-xl font-semibold"
                >
                  Accept Offer
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={submitting}
                className="p-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-6 px-6 py-6">
              <div className="space-y-3 text-sm leading-6 text-muted-foreground">
                <p>
                  By accepting this offer, you are confirming
                  your acceptance of the role with the AWS
                  Student Builder Group at LPU.
                </p>

                <p>
                  Your acceptance also confirms that you have
                  read, understood, and agree to the terms of
                  the associated{" "}
                  <strong className="font-medium text-foreground">
                    Non-Disclosure Agreement (NDA)
                  </strong>
                  .
                </p>
              </div>

              {/* NDA */}
              <div className="border border-border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">
                      Non-Disclosure Agreement
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Review the agreement before accepting
                      your offer.
                    </p>
                  </div>

                  <a
                    href="/nda"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 border border-border px-3 py-2 text-xs font-medium transition-colors hover:bg-muted"
                  >
                    View NDA
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* Agreement */}
              <label className="flex cursor-pointer gap-3 border border-border p-4">
                <input
                  type="checkbox"
                  checked={acceptedNda}
                  onChange={(event) =>
                    setAcceptedNda(event.target.checked)
                  }
                  disabled={submitting}
                  className="mt-1 h-4 w-4 accent-foreground"
                />

                <span className="text-sm leading-6">
                  I have read and agree to the NDA, and I
                  understand that accepting this offer also
                  constitutes my agreement to the NDA.
                </span>
              </label>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-border px-6 py-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={submitting}
                className="border border-border px-5 py-3 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAccept}
                disabled={!acceptedNda || submitting}
                className="inline-flex items-center justify-center gap-2 border border-foreground bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting
                  ? "Accepting..."
                  : "Accept & Agree"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
