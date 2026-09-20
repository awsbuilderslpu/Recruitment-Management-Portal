"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

type Props = {
  applicationId: string;
  noteIndex: number;
  note: string;
  open: boolean;
  onClose: () => void;
};

export function DeleteApplicationNoteModal({
  applicationId,
  noteIndex,
  note,
  open,
  onClose,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleDelete() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/applications/v1/admin/${applicationId}/notes/${noteIndex}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete note"
        );
      }

      onClose();
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete note"
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
        aria-labelledby="delete-note-title"
      >
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-text-faint">
                Internal note
              </span>
            </div>

            <h2
              id="delete-note-title"
              className="mt-2 text-[17px] font-semibold tracking-[-0.035em]"
            >
              Delete note?
            </h2>

            <p className="mt-1 text-[10px] leading-5 text-text-muted">
              This action cannot be undone.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
            className="p-1.5 text-text-faint transition hover:bg-surface-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5">
          <div className="border border-border bg-surface-muted px-4 py-3.5">
            <div className="mb-2 text-[9px] font-medium uppercase tracking-[0.12em] text-text-faint">
              Note
            </div>

            <p className="whitespace-pre-wrap text-[11px] leading-5 text-text-secondary">
              {note}
            </p>
          </div>

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
            onClick={handleDelete}
            disabled={loading}
            className="border border-red-500/30 bg-red-500/5 px-4 py-2 text-[9px] font-medium uppercase tracking-widest text-red-600 transition hover:bg-red-500/10 disabled:pointer-events-none disabled:opacity-40 dark:text-red-400"
          >
            {loading ? "Deleting..." : "Delete note"}
          </button>
        </div>
      </div>
    </div>
  );
}