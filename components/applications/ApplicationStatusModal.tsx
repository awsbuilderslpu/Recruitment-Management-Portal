"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import type { ApplicationStatus } from "@/lib/types";

const STATUSES: ApplicationStatus[] = [
  "Pending",
  "Shortlisted",
  "Interview Scheduled",
  "Selected",
  "Rejected",
  "Accepted Offer",
];

const statusStyles: Record<ApplicationStatus, string> = {
  Pending:
    "border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400",
  Shortlisted:
    "border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400",
  "Interview Scheduled":
    "border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400",
  Selected:
    "border-violet-500/20 bg-violet-500/5 text-violet-600 dark:text-violet-400",
  Rejected:
    "border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400",
  "Accepted Offer":
    "border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400",
};

type Props = {
  applicationId: string;
  currentStatus: ApplicationStatus;
  open: boolean;
  onClose: () => void;
};

export function ApplicationStatusModal({
  applicationId,
  currentStatus,
  open,
  onClose,
}: Props) {
  const router = useRouter();

  const [status, setStatus] =
    useState<ApplicationStatus>(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setStatus(currentStatus);
      setError("");
    }
  }, [open, currentStatus]);

  if (!open) return null;

  async function handleUpdate() {
    if (status === currentStatus) {
      onClose();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/applications/v1/admin/${applicationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update status"
        );
      }

      onClose();
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update status"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 px-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-lg border border-border bg-surface shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="status-modal-title"
      >
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-text-faint">
                Application status
              </span>
            </div>

            <h2
              id="status-modal-title"
              className="mt-2 text-[17px] font-semibold tracking-[-0.035em]"
            >
              Update status
            </h2>

            <p className="mt-1 text-[10px] leading-5 text-text-muted">
              Change the recruitment status of this application.
            </p>
          </div>
        </div>

        <div className="p-5">
          <label
            htmlFor="application-status"
            className="text-[9px] font-medium uppercase tracking-[0.14em] text-text-faint"
          >
            Status
          </label>

          <div className="mt-2 border border-border bg-background">
            <select
              id="application-status"
              value={status}
              onChange={(event) => {
                setStatus(
                  event.target.value as ApplicationStatus
                );
                if (error) setError("");
              }}
              disabled={loading}
              className="h-11 w-full bg-transparent px-3 text-[11px] text-foreground outline-none disabled:opacity-60"
            >
              {STATUSES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3">
            <span
              className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.08em] ${statusStyles[status]}`}
            >
              {status}
            </span>
          </div>

          {status !== currentStatus && (
            <div className="mt-5 border border-red-500 bg-red-50 px-4 py-3.5 text-red-700 dark:bg-red-950/30 dark:text-red-400">
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className="mt-0.5 h-4 w-4 shrink-0"
                  strokeWidth={2.5}
                />

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest">
                    Important — this action has side effects
                  </p>

                  <p className="mt-1.5 text-[10px] leading-5">
                    Updating this status will automatically send
                    an email notification to the applicant.
                    This change will also be recorded in the
                    recruitment audit log with your name,
                    email, and role.
                  </p>

                  <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.08em]">
                    Make sure the new status is correct before
                    continuing.
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 border border-red-200 bg-red-50 px-3 py-2.5 text-[10px] text-red-600">
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="border border-border px-4 py-2 text-[9px] font-medium uppercase tracking-widest text-text-muted transition hover:border-border-strong hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleUpdate}
            disabled={loading || status === currentStatus}
            className="bg-foreground px-4 py-2 text-[9px] font-medium uppercase tracking-widest text-background transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
          >
            {loading ? "Updating..." : "Update status"}
          </button>
        </div>
      </div>
    </div>
  );
}