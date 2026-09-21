"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Clock3,
  FileText,
  Megaphone,
  Save,
  Send,
} from "lucide-react";
import type { ApplicationStatus } from "@/lib/types";
import type { Announcement } from "@/lib/sheet";

const ANNOUNCEMENT_STATUSES: ApplicationStatus[] = [
  "Shortlisted",
  "Interview Scheduled",
  "Selected",
  "Accepted Offer",
];

const statusMeta: Record<
  ApplicationStatus,
  {
    label: string;
    description: string;
  }
> = {
  Pending: {
    label: "Pending",
    description: "No announcement",
  },
  Shortlisted: {
    label: "Shortlisted",
    description: "Shown to shortlisted applicants",
  },
  "Interview Scheduled": {
    label: "Interview Scheduled",
    description: "Shown to interview candidates",
  },
  Selected: {
    label: "Selected",
    description: "Shown to selected applicants",
  },
  Rejected: {
    label: "Rejected",
    description: "No announcement",
  },
  "Accepted Offer": {
    label: "Accepted Offer",
    description: "Shown to accepted-offer applicants",
  },
};

type Props = {
  initialAnnouncements: Announcement[];
};

export function AnnouncementManager({
  initialAnnouncements,
}: Props) {
  const [announcements, setAnnouncements] =
    useState(initialAnnouncements);

  const [selectedStatus, setSelectedStatus] =
    useState<ApplicationStatus>(
      ANNOUNCEMENT_STATUSES[0]
    );

  const selectedAnnouncement = useMemo(
    () =>
      announcements.find(
        (announcement) =>
          announcement.status === selectedStatus
      ),
    [announcements, selectedStatus]
  );

  const [title, setTitle] = useState(
    selectedAnnouncement?.title ?? ""
  );

  const [message, setMessage] = useState(
    selectedAnnouncement?.message ?? ""
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function selectStatus(
    status: ApplicationStatus
  ) {
    const announcement = announcements.find(
      (item) => item.status === status
    );

    setSelectedStatus(status);
    setTitle(announcement?.title ?? "");
    setMessage(announcement?.message ?? "");
    setError("");
    setSuccess("");
  }

  async function handleSave() {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!message.trim()) {
      setError("Message is required.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        selectedAnnouncement
          ? `/api/applications/v1/admin/announcements/${selectedAnnouncement.id}`
          : "/api/applications/v1/admin/announcements",
        {
          method: selectedAnnouncement
            ? "PATCH"
            : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...(selectedAnnouncement
              ? {}
              : {
                  status: selectedStatus,
                }),
            title: title.trim(),
            message: message.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save announcement"
        );
      }

      const savedAnnouncement =
        data.data as Announcement;

      setAnnouncements((current) => {
        const exists = current.some(
          (item) => item.id === savedAnnouncement.id
        );

        if (exists) {
          return current.map((item) =>
            item.id === savedAnnouncement.id
              ? savedAnnouncement
              : item
          );
        }

        return [...current, savedAnnouncement];
      });

      setSuccess(
        selectedAnnouncement
          ? "Announcement updated successfully."
          : "Announcement created successfully."
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save announcement"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-350 px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <div className="border-b border-border pb-7">
          <div className="flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-accent" />

            <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-text-faint">
              Recruitment communication
            </span>
          </div>

          <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
            Announcements
          </h1>

          <p className="mt-2 max-w-2xl text-xs leading-6 text-text-muted">
            Manage messages shown to applicants based on
            their current recruitment status.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <section className="border border-border bg-surface">
            <div className="border-b border-border px-4 py-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-text-faint">
                Categories
              </p>
            </div>

            <div className="divide-y divide-border">
              {ANNOUNCEMENT_STATUSES.map((status) => {
                const announcement =
                  announcements.find(
                    (item) =>
                      item.status === status
                  );

                const active =
                  selectedStatus === status;

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() =>
                      selectStatus(status)
                    }
                    className={`w-full px-4 py-4 text-left transition ${
                      active
                        ? "bg-surface-muted"
                        : "hover:bg-surface-muted/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-semibold">
                          {statusMeta[status].label}
                        </p>

                        <p className="mt-1 text-[9px] leading-4 text-text-muted">
                          {
                            statusMeta[status]
                              .description
                          }
                        </p>
                      </div>

                      <span
                        className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                          announcement
                            ? "bg-emerald-500"
                            : "bg-border-strong"
                        }`}
                      />
                    </div>

                    {announcement && (
                      <p className="mt-2 truncate text-[9px] text-text-subtle">
                        {announcement.title}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="border border-border bg-surface">
            <div className="border-b border-border px-5 py-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />

                    <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-text-faint">
                      Announcement
                    </span>
                  </div>

                  <h2 className="mt-2 text-lg font-semibold tracking-[-0.03em]">
                    {selectedStatus}
                  </h2>
                </div>

                {selectedAnnouncement ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.08em] text-emerald-600 dark:text-emerald-400">
                    <Check className="h-3 w-3" />
                    Published
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-muted px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.08em] text-text-muted">
                    <Clock3 className="h-3 w-3" />
                    Not configured
                  </span>
                )}
              </div>
            </div>

            <div className="p-5">
              <div>
                <label
                  htmlFor="announcement-title"
                  className="text-[9px] font-medium uppercase tracking-[0.14em] text-text-faint"
                >
                  Title
                </label>

                <input
                  id="announcement-title"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  placeholder="e.g. Congratulations on being shortlisted"
                  disabled={saving}
                  className="mt-2 h-11 w-full border border-border bg-background px-3 text-[11px] text-foreground outline-none transition placeholder:text-text-faint focus:border-border-strong disabled:opacity-60"
                />
              </div>

              <div className="mt-5">
                <label
                  htmlFor="announcement-message"
                  className="text-[9px] font-medium uppercase tracking-[0.14em] text-text-faint"
                >
                  Message
                </label>

                <textarea
                  id="announcement-message"
                  value={message}
                  onChange={(event) => {
                    setMessage(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  placeholder="Write the message applicants should see..."
                  disabled={saving}
                  rows={10}
                  className="mt-2 w-full resize-y border border-border bg-background px-3 py-3 text-[11px] leading-6 text-foreground outline-none transition placeholder:text-text-faint focus:border-border-strong disabled:opacity-60"
                />
              </div>

              <div className="mt-5 border border-amber-500/30 bg-amber-500/5 px-4 py-3">
                <div className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />

                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                      Visibility
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-text-muted">
                      This announcement will only be visible
                      to applicants whose current status is{" "}
                      <span className="font-semibold text-foreground">
                        {selectedStatus}
                      </span>
                      .
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 border border-red-500 bg-red-50 px-3 py-2.5 text-[10px] text-red-600 dark:bg-red-950/30 dark:text-red-400">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-4 border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5 text-[10px] text-emerald-600 dark:text-emerald-400">
                  {success}
                </div>
              )}

              <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                <div className="text-[9px] text-text-faint">
                  {selectedAnnouncement?.updatedAt
                    ? `Last updated ${new Date(
                        selectedAnnouncement.updatedAt
                      ).toLocaleString()}`
                    : "No announcement created yet"}
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={
                    saving ||
                    !title.trim() ||
                    !message.trim()
                  }
                  className="inline-flex items-center gap-2 bg-foreground px-4 py-2.5 text-[9px] font-medium uppercase tracking-widest text-background transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
                >
                  {selectedAnnouncement ? (
                    <Save className="h-3.5 w-3.5" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}

                  {saving
                    ? "Saving..."
                    : selectedAnnouncement
                      ? "Save changes"
                      : "Publish announcement"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}