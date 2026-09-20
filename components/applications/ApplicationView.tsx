"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";

import type { Application } from "@/lib/types";

import { ApplicationStatusModal } from "./ApplicationStatusModal";
import { ApplicationNoteModal } from "./ApplicationNoteModal";
import { DeleteApplicationNoteModal } from "./DeleteApplicationNoteModal";

type Props = {
  application: Application;
  notes: string[];
};

const statusStyles: Record<string, string> = {
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
};

function StatusBadge({
  status,
}: {
  status: Application["status"];
}) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.08em] ${
        statusStyles[status] ??
        "border-border bg-surface-muted text-text-muted"
      }`}
    >
      {status}
    </span>
  );
}

export function ApplicationView({
  application,
  notes,
}: Props) {
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [deleteNoteIndex, setDeleteNoteIndex] = useState<
    number | null
  >(null);

  const deleteNote =
    deleteNoteIndex !== null
      ? notes[deleteNoteIndex - 1]
      : null;

  return (
    <>
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto w-full max-w-350 px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <header className="border-b border-border pb-8">
            <Link
              href="/applications"
              className="mb-7 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.12em] text-text-muted transition hover:text-foreground"
            >
              <ArrowLeft size={13} />
              Applications
            </Link>

            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div className="min-w-0">
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />

                  <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-text-faint">
                    Application {application.applicationId}
                  </span>
                </div>

                <h1 className="truncate text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-none tracking-[-0.06em]">
                  {application.fullName}
                </h1>

                <p className="mt-3 truncate text-[11px] text-text-muted">
                  {application.universityEmail ||
                    application.personalEmail}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStatusModalOpen(true)}
                className="self-start transition hover:opacity-80 sm:self-auto"
              >
                <StatusBadge status={application.status} />
              </button>
            </div>
          </header>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0 space-y-6">
              <section className="border border-border bg-surface">
                <SectionHeader title="Personal information" />

                <div className="grid gap-x-8 gap-y-6 p-5 sm:grid-cols-2">
                  <Info
                    label="Full name"
                    value={application.fullName}
                  />

                  <Info
                    label="Registration number"
                    value={application.registrationNumber}
                  />

                  <Info
                    label="University email"
                    value={application.universityEmail}
                  />

                  <Info
                    label="Personal email"
                    value={application.personalEmail}
                  />

                  <Info
                    label="Phone"
                    value={application.phone}
                  />
                </div>
              </section>

              <section className="border border-border bg-surface">
                <SectionHeader title="Academic information" />

                <div className="grid gap-x-8 gap-y-6 p-5 sm:grid-cols-2 lg:grid-cols-4">
                  <Info
                    label="Program"
                    value={application.program}
                  />

                  <Info
                    label="Branch"
                    value={application.branch}
                  />

                  <Info
                    label="Semester"
                    value={application.semester}
                  />

                  <Info
                    label="CGPA"
                    value={application.cgpa}
                  />
                </div>
              </section>

              <section className="border border-border bg-surface">
                <SectionHeader title="Profiles & resume" />

                <div className="grid gap-6 p-5 sm:grid-cols-2">
                  <LinkField
                    label="LinkedIn"
                    value={application.linkedin}
                  />

                  <LinkField
                    label="GitHub"
                    value={application.github}
                  />

                  <LinkField
                    label="Portfolio"
                    value={application.portfolio}
                  />

                  <LinkField
                    label="Resume"
                    value={application.resumeUrl}
                  />
                </div>
              </section>

              <section className="border border-border bg-surface">
                <SectionHeader title="Application" />

                <div className="space-y-7 p-5">
                  <Info
                    label="Preferred role"
                    value={application.preferredRole}
                  />

                  <Info
                    label="Communities"
                    value={application.communities}
                    multiline
                  />

                  <Info
                    label="Achievement"
                    value={application.achievement}
                    multiline
                  />

                  <Info
                    label="Why join?"
                    value={application.whyJoin}
                    multiline
                  />
                </div>
              </section>

              {Object.keys(application.roleAnswers).length >
                0 && (
                <section className="border border-border bg-surface">
                  <SectionHeader title="Role-specific answers" />

                  <div className="divide-y divide-border">
                    {Object.entries(
                      application.roleAnswers
                    ).map(([key, value]) => (
                      <div key={key} className="p-5">
                        <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-text-faint">
                          {key}
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-[12px] leading-6 text-text-muted">
                          {value || "—"}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="space-y-6">
              <section className="border border-border bg-surface p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-text-faint">
                      Current status
                    </p>

                    <div className="mt-3">
                      <StatusBadge
                        status={application.status}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStatusModalOpen(true)}
                  className="mt-5 w-full border border-border px-4 py-2.5 text-[10px] font-medium uppercase tracking-widest text-text-muted transition hover:border-border-strong hover:bg-surface-muted hover:text-foreground"
                >
                  Change status
                </button>
              </section>

              <section className="border border-border bg-surface">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <div>
                    <h2 className="text-[11px] font-semibold">
                      Internal notes
                    </h2>

                    <p className="mt-1 text-[9px] text-text-faint">
                      {notes.length}{" "}
                      {notes.length === 1 ? "note" : "notes"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setNoteModalOpen(true)}
                    className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.08em] text-text-muted transition hover:border-border-strong hover:text-foreground"
                  >
                    <Plus size={13} />
                    Add
                  </button>
                </div>

                {notes.length === 0 ? (
                  <div className="px-5 py-9 text-center">
                    <p className="text-[10px] text-text-faint">
                      No notes yet.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {notes.map((note, index) => (
                      <div
                        key={`${index}-${note}`}
                        className="group p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="whitespace-pre-wrap text-[11px] leading-5 text-text-muted">
                            {note}
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteNoteIndex(index + 1)
                            }
                            className="shrink-0 p-1.5 text-text-faint opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                            aria-label="Delete note"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="border border-border bg-surface p-5">
                <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-text-faint">
                  Application details
                </p>

                <div className="mt-5 space-y-5">
                  <Info
                    label="Application ID"
                    value={application.applicationId}
                  />

                  <Info
                    label="Submitted"
                    value={formatDate(application.timestamp)}
                  />

                  <Info
                    label="IP address"
                    value={application.ipAddress}
                  />
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>

      <ApplicationStatusModal
        applicationId={application.applicationId}
        currentStatus={application.status}
        open={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
      />

      <ApplicationNoteModal
        applicationId={application.applicationId}
        open={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
      />

      {deleteNote !== null && deleteNoteIndex !== null && (
        <DeleteApplicationNoteModal
          applicationId={application.applicationId}
          noteIndex={deleteNoteIndex}
          note={deleteNote}
          open
          onClose={() => setDeleteNoteIndex(null)}
        />
      )}
    </>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="border-b border-border px-5 py-4">
      <h2 className="text-[11px] font-semibold uppercase tracking-widest">
        {title}
      </h2>
    </div>
  );
}

function Info({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-text-faint">
        {label}
      </p>

      <p
        className={[
          "mt-1.5 text-[11px] text-foreground",
          multiline ? "whitespace-pre-wrap leading-5 text-text-muted" : "",
        ].join(" ")}
      >
        {value || "—"}
      </p>
    </div>
  );
}

function LinkField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-text-faint">
        {label}
      </p>

      {value ? (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="mt-1.5 inline-flex max-w-full items-center gap-1.5 text-[11px] text-foreground underline decoration-border-strong underline-offset-4 transition hover:text-text-muted"
        >
          <span className="truncate">{value}</span>
          <ExternalLink
            size={12}
            className="shrink-0"
          />
        </a>
      ) : (
        <p className="mt-1.5 text-[11px] text-text-muted">
          —
        </p>
      )}
    </div>
  );
}

function formatDate(value: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}