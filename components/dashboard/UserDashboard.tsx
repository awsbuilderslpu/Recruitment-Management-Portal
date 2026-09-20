"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Clock3,
  FileText,
  LogOut,
  UserRound,
} from "lucide-react";

type Application = {
  applicationId: string;
  timestamp: string;
  status: string;
  fullName: string;
  registrationNumber: string;
  universityEmail: string;
  personalEmail: string;
  phone: string;
  program: string;
  branch: string;
  semester: string;
  cgpa: string;
  preferredRole: string;
  resumeUrl: string;
};

type User = {
  name?: string;
  email?: string;
  picture?: string;
  role?: string;
};

type Props = {
  user: User;
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

export default function UserDashboard({ user }: Props) {
  const router = useRouter();

  const [application, setApplication] =
    useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function loadApplication() {
      try {
        const response = await fetch(
          "/api/applications/v1/public",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (response.status === 401) {
          router.replace("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load application"
          );
        }

        setApplication(data.applied ? data.data : null);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load application"
        );
      } finally {
        setLoading(false);
      }
    }

    loadApplication();
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      router.replace("/login");
    }
  }

  const firstName =
    user.name?.trim().split(/\s+/)[0] || "there";

  const hasApplication = Boolean(application);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-350 px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <header className="border-b border-border pb-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-accent" />

                <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-text-faint">
                  AWS LPU Recruitment
                </p>
              </div>

              <h1 className="mt-3 text-[30px] font-semibold tracking-[-0.045em] sm:text-[34px]">
                Welcome back, {firstName}.
              </h1>

              <p className="mt-1.5 text-[11px] leading-5 text-text-muted">
                Your recruitment workspace and application
                progress.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt=""
                  className="h-9 w-9 rounded-full border border-border object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-muted text-[10px] font-semibold">
                  {getInitials(user.name || "")}
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-[11px] font-medium">
                  {user.name || "AWS LPU Member"}
                </p>

                <p className="truncate text-[9px] text-text-muted">
                  {user.email || "Authenticated member"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="mt-7 border border-red-200 bg-red-50 px-4 py-3 text-[10px] text-red-600">
            {error}
          </div>
        )}

        <section className="mt-7 grid gap-px border border-border bg-border md:grid-cols-[1.4fr_0.8fr]">
          <div className="bg-surface px-5 py-6 sm:px-7">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-text-faint">
                Application
              </span>

              {application && (
                <StatusBadge status={application.status} />
              )}
            </div>

            {loading ? (
              <ApplicationLoading />
            ) : application ? (
              <>
                <h2 className="mt-3 text-[20px] font-semibold tracking-[-0.035em]">
                  {application.preferredRole ||
                    "Recruitment application"}
                </h2>

                <p className="mt-1.5 text-[10px] leading-5 text-text-muted">
                  Application ID{" "}
                  <span className="font-mono text-text-secondary">
                    {application.applicationId}
                  </span>
                </p>

                <div className="mt-6 grid grid-cols-2 border border-border sm:grid-cols-3">
                  <InfoItem
                    label="Program"
                    value={application.program || "—"}
                  />

                  <InfoItem
                    label="Branch"
                    value={application.branch || "—"}
                  />

                  <InfoItem
                    label="Semester"
                    value={application.semester || "—"}
                  />
                </div>

                <div className="mt-5">
                  <Link
                    href={`/applications/my/${application.applicationId}`}
                    className="inline-flex items-center gap-2 bg-foreground px-4 py-2.5 text-[9px] font-medium uppercase tracking-widest text-background transition hover:opacity-90"
                  >
                    View application
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h2 className="mt-3 text-[20px] font-semibold tracking-[-0.035em]">
                  Start your application
                </h2>

                <p className="mt-2 max-w-lg text-[11px] leading-5 text-text-muted">
                  Your recruitment journey starts here. Complete
                  your application to continue.
                </p>

                <div className="mt-6">
                  <Link
                    href="/applications/new"
                    className="inline-flex items-center gap-2 bg-foreground px-4 py-2.5 text-[9px] font-medium uppercase tracking-widest text-background transition hover:opacity-90"
                  >
                    Apply now
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </>
            )}
          </div>

          <div className="bg-surface px-5 py-6 sm:px-7">
            <div className="flex items-center gap-2">
              <UserRound
                size={14}
                className="text-text-faint"
              />

              <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-text-faint">
                Account
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <InfoRow
                label="Name"
                value={user.name || "—"}
              />

              <InfoRow
                label="Email"
                value={user.email || "—"}
              />

              <InfoRow
                label="Access"
                value={user.role || "Member"}
              />
            </div>
          </div>
        </section>

        <section className="mt-8 border border-border bg-surface">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-[13px] font-semibold">
              Recruitment journey
            </h2>

            <p className="mt-1 text-[10px] leading-5 text-text-muted">
              Track your progress through the recruitment
              process.
            </p>
          </div>

          <div className="grid md:grid-cols-5">
            <JourneyStep
              number="01"
              label="Profile"
              state="complete"
              description="Identity confirmed"
            />

            <JourneyStep
              number="02"
              label="Application"
              state={
                hasApplication ? "complete" : "current"
              }
              description={
                hasApplication
                  ? "Application submitted"
                  : "Application required"
              }
            />

            <JourneyStep
              number="03"
              label="Pending Interview"
              state={
                application?.status === "Shortlisted" ||
                application?.status ===
                  "Interview Scheduled" ||
                application?.status === "Selected"
                  ? "current"
                  : "upcoming"
              }
              description={
                application?.status === "Shortlisted"
                  ? "Next stage"
                  : "Upcoming"
              }
            />

            <JourneyStep
              number="04"
              label="Interview"
              state={
                application?.status ===
                  "Interview Scheduled" ||
                application?.status === "Selected"
                  ? "current"
                  : "upcoming"
              }
              description={
                application?.status ===
                "Interview Scheduled"
                  ? "Interview scheduled"
                  : "Upcoming"
              }
            />

            <JourneyStep
              number="05"
              label="Decision"
              state={
                application?.status === "Selected" ||
                application?.status === "Rejected"
                  ? "current"
                  : "upcoming"
              }
              description={
                application?.status === "Selected"
                  ? "Selected"
                  : application?.status === "Rejected"
                    ? "Application closed"
                    : "Upcoming"
              }
            />
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="border border-border bg-surface">
            <div className="border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <FileText
                  size={14}
                  className="text-text-faint"
                />

                <h2 className="text-[13px] font-semibold">
                  Your application
                </h2>
              </div>
            </div>

            <div className="p-5">
              {loading ? (
                <ApplicationLoading />
              ) : application ? (
                <div className="space-y-4">
                  <InfoRow
                    label="Submitted"
                    value={formatDate(
                      application.timestamp
                    )}
                  />

                  <InfoRow
                    label="Status"
                    value={application.status}
                  />

                  <InfoRow
                    label="Registration"
                    value={
                      application.registrationNumber || "—"
                    }
                  />

                  <Link
                    href={`/applications/my/${application.applicationId}`}
                    className="mt-2 inline-flex items-center gap-2 text-[9px] font-medium uppercase tracking-widest text-text-secondary transition hover:text-foreground"
                  >
                    Open application
                    <ArrowRight size={12} />
                  </Link>
                </div>
              ) : (
                <div className="py-4">
                  <p className="text-[11px] text-text-muted">
                    You haven't submitted an application yet.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="border border-border bg-surface">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-[13px] font-semibold">
                Opportunities
              </h2>

              <p className="mt-1 text-[10px] leading-5 text-text-muted">
                Explore what you can build with AWS LPU.
              </p>
            </div>

            <div className="divide-y divide-border">
              <Opportunity
                number="01"
                title="AWS Student Builder Groups"
                description="Build, learn and collaborate with the AWS community."
              />

              <Opportunity
                number="02"
                title="Builder Programs"
                description="Take part in technical programs and community initiatives."
              />

              <Opportunity
                number="03"
                title="Community Events"
                description="Discover upcoming sessions, workshops and events."
              />
            </div>
          </div>
        </section>

        <div className="mt-8 flex justify-end border-t border-border pt-5">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center gap-2 text-[9px] font-medium uppercase tracking-widest text-text-muted transition hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            <LogOut size={13} />
            {loggingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </div>
    </main>
  );
}

function ApplicationLoading() {
  return (
    <div className="space-y-3 py-2">
      <div className="h-3 w-40 animate-pulse bg-surface-muted" />
      <div className="h-2.5 w-56 animate-pulse bg-surface-muted" />
      <div className="mt-5 h-12 w-full animate-pulse border border-border bg-surface-muted" />
    </div>
  );
}

function JourneyStep({
  number,
  label,
  state,
  description,
}: {
  number: string;
  label: string;
  state: "complete" | "current" | "upcoming";
  description: string;
}) {
  return (
    <div className="border-b border-border px-5 py-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] text-text-faint">
          {number}
        </span>

        {state === "complete" && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background">
            <Check size={11} />
          </span>
        )}

        {state === "current" && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
        )}

        {state === "upcoming" && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border text-text-faint">
            <Clock3 size={10} />
          </span>
        )}
      </div>

      <p
        className={`mt-5 text-[11px] font-medium ${
          state === "upcoming"
            ? "text-text-faint"
            : "text-foreground"
        }`}
      >
        {label}
      </p>

      <p className="mt-1 text-[9px] leading-4 text-text-muted">
        {description}
      </p>
    </div>
  );
}

function Opportunity({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 px-5 py-5 transition-colors hover:bg-surface-muted">
      <span className="font-mono text-[9px] text-text-faint">
        {number}
      </span>

      <div>
        <h3 className="text-[11px] font-medium">
          {title}
        </h3>

        <p className="mt-1 text-[10px] leading-5 text-text-muted">
          {description}
        </p>
      </div>

      <ArrowRight
        size={13}
        className="ml-auto mt-0.5 shrink-0 text-text-faint"
      />
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-r border-border px-3 py-3 last:border-r-0">
      <p className="text-[8px] font-medium uppercase tracking-[0.12em] text-text-faint">
        {label}
      </p>

      <p className="mt-1.5 truncate text-[10px] text-text-secondary">
        {value}
      </p>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-5 border-b border-border pb-3 last:border-b-0 last:pb-0">
      <span className="text-[9px] font-medium uppercase tracking-widest text-text-faint">
        {label}
      </span>

      <span className="max-w-[65%] text-right text-[10px] text-text-secondary">
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const style =
    statusStyles[status] ||
    "border-border bg-surface-muted text-text-secondary";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[8px] font-medium uppercase tracking-[0.06em] ${style}`}
    >
      {status}
    </span>
  );
}

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "?";

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (
    parts[0].charAt(0) +
    parts[parts.length - 1].charAt(0)
  ).toUpperCase();
}

function formatDate(value: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}