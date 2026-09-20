import Link from "next/link";
import { redirect } from "next/navigation";

import { requireAdminAccess } from "@/lib/auth";
import { getAdminDashboardData } from "@/lib/sheet";
import type { ApplicationStatus } from "@/lib/types";

const STATUS_STYLES: Record<ApplicationStatus, string> = {
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

export default async function ApplicationsPage() {
  const auth = await requireAdminAccess();

  if (!auth.authorized) {
    redirect("/login");
  }

  const { applications, stats } =
    await getAdminDashboardData();

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
                Applications
              </h1>

              <p className="mt-1.5 text-[11px] leading-5 text-text-muted">
                Review and manage recruitment applications.
              </p>
            </div>

            <div className="text-[10px] uppercase tracking-[0.12em] text-text-faint">
              {stats.total}{" "}
              {stats.total === 1
                ? "application"
                : "applications"}
            </div>
          </div>
        </header>

        <section className="mt-7 grid grid-cols-2 border border-border sm:grid-cols-4">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Pending" value={stats.pending} />
          <StatCard
            label="Shortlisted"
            value={stats.shortlisted}
          />
          <StatCard
            label="Selected"
            value={stats.selected}
          />
        </section>

        <section className="mt-8 border border-border bg-surface">
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-[13px] font-semibold">
                  All applications
                </h2>

                <p className="mt-1 text-[10px] leading-5 text-text-muted">
                  Click an application to view the complete
                  submission.
                </p>
              </div>

              <span className="hidden text-[9px] uppercase tracking-[0.14em] text-text-faint sm:block">
                Directory
              </span>
            </div>
          </div>

          {applications.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-225 text-[11px]">
                <thead>
                  <tr className="border-b border-border bg-surface-muted">
                    <th className="px-5 py-3 text-left text-[9px] font-medium uppercase tracking-[0.16em] text-text-faint">
                      Applicant
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] font-medium uppercase tracking-[0.16em] text-text-faint">
                      Application
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] font-medium uppercase tracking-[0.16em] text-text-faint">
                      Role
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] font-medium uppercase tracking-[0.16em] text-text-faint">
                      Academic
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] font-medium uppercase tracking-[0.16em] text-text-faint">
                      Status
                    </th>

                    <th className="px-5 py-3 text-right text-[9px] font-medium uppercase tracking-[0.16em] text-text-faint">
                      Submitted
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map((application) => (
                    <tr
                      key={application.applicationId}
                      className="border-b border-border last:border-b-0 transition-colors hover:bg-surface-muted"
                    >
                      <td className="px-5 py-4">
                        <Link
                          href={`/applications/${application.applicationId}`}
                          className="group flex items-center gap-3"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface-muted text-[10px] font-semibold">
                            {getInitials(
                              application.fullName
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-[11px] font-medium group-hover:underline group-hover:underline-offset-4">
                              {application.fullName}
                            </p>

                            <p className="mt-0.5 truncate text-[9px] text-text-muted">
                              {application.universityEmail}
                            </p>
                          </div>
                        </Link>
                      </td>

                      <td className="px-5 py-4">
                        <Link
                          href={`/applications/${application.applicationId}`}
                          className="font-mono text-[9px] text-text-muted transition hover:text-foreground"
                        >
                          {application.applicationId}
                        </Link>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-[11px]">
                          {application.preferredRole || "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div>
                          <p className="text-[11px]">
                            {application.branch || "—"}
                          </p>

                          <p className="mt-0.5 text-[9px] text-text-muted">
                            {application.program
                              ? `${application.program} · Sem ${application.semester}`
                              : `Sem ${application.semester}`}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge
                          status={application.status}
                        />
                      </td>

                      <td className="px-5 py-4 text-right">
                        <span className="text-[9px] text-text-muted">
                          {formatDate(
                            application.timestamp
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="border-r border-border px-5 py-5 last:border-r-0">
      <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-text-faint">
        {label}
      </p>

      <p className="mt-2 text-[23px] font-semibold tracking-[-0.04em]">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: ApplicationStatus;
}) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.06em] ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-muted text-[11px] text-text-faint">
        —
      </div>

      <h3 className="mt-4 text-[12px] font-semibold">
        No applications yet
      </h3>

      <p className="mt-1 text-[10px] leading-5 text-text-muted">
        Applications will appear here once candidates
        submit them.
      </p>
    </div>
  );
}

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (
    parts[0].charAt(0) +
    parts[parts.length - 1].charAt(0)
  ).toUpperCase();
}

function formatDate(value: string) {
  if (!value) {
    return "—";
  }

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