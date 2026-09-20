"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  applicationId: string;
  open: boolean;
  onClose: () => void;
};

export function ApplicationNoteModal({
  applicationId,
  open,
  onClose,
}: Props) {
  const router = useRouter();

  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setNote("");
      setError("");
    }
  }, [open]);

  if (!open) return null;

  async function handleAdd() {
    const value = note.trim();

    if (!value) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/applications/v1/admin/${applicationId}/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            note: value,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add note"
        );
      }

      setNote("");
      onClose();
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to add note"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();

      if (!loading && note.trim()) {
        handleAdd();
      }
    }

    if (event.key === "Escape" && !loading) {
      onClose();
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
        aria-labelledby="add-note-title"
      >
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />

              <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-text-faint">
                Internal note
              </span>
            </div>

            <h2
              id="add-note-title"
              className="mt-2 text-[17px] font-semibold tracking-[-0.035em]"
            >
              Add a note
            </h2>

            <p className="mt-1 text-[10px] leading-5 text-text-muted">
              This note is only visible to the recruitment
              team.
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
          <textarea
            value={note}
            onChange={(event) => {
              setNote(event.target.value);
              if (error) setError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder="Write an internal note..."
            rows={6}
            disabled={loading}
            autoFocus
            className="w-full resize-none border border-border bg-background p-3.5 text-[11px] leading-5 text-foreground outline-none transition placeholder:text-text-faint focus:border-border-strong disabled:opacity-60"
          />

          <div className="mt-2 flex items-center justify-between">
            <span className="text-[9px] text-text-faint">
              {note.length} characters
            </span>

            <span className="text-[9px] text-text-faint">
              Ctrl + Enter to add
            </span>
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
            onClick={handleAdd}
            disabled={loading || !note.trim()}
            className="bg-foreground px-4 py-2 text-[9px] font-medium uppercase tracking-widest text-background transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
          >
            {loading ? "Adding..." : "Add note"}
          </button>
        </div>
      </div>
    </div>
  );
}