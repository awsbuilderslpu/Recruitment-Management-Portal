"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Application } from "@/lib/types";

type AdminDashboardProps = {
  user: {
    sub: string;
    name: string;
    email: string;
    picture?: string;
    role: string;
  };
};

const PAGE_SIZE = 8;

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

export default function AdminDashboard({
  user: _user,
}: AdminDashboardProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [needsAttention, setNeedsAttention] = useState<Application[]>(
    []
  );

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    shortlisted: 0,
    selected: 0,
  });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<
    "All" | Application["status"]
  >("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch(
          "/api/applications/v1/admin/dashboard",
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("Failed to load dashboard");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            result.message || "Failed to load dashboard"
          );
        }

        setApplications(result.data.applications ?? []);
        setNeedsAttention(result.data.needsAttention ?? []);
        setStats(result.data.stats);
      } catch (error) {
        console.error(error);
        setApplications([]);
        setNeedsAttention([]);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applications.filter((application) => {
      if (
        status !== "All" &&
        application.status !== status
      ) {
        return false;
      }

      if (!query) return true;

      return [
        application.applicationId,
        application.fullName,
        application.universityEmail,
        application.personalEmail,
        application.registrationNumber,
        application.program,
        application.branch,
        application.preferredRole,
      ].some((value) =>
        value?.toLowerCase().includes(query)
      );
    });
  }, [applications, search, status]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredApplications.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const visibleApplications =
    filteredApplications.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE
    );

  useEffect(() => {
    setPage(1);
  }, [search, status]);

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-350 px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <header className="border-b border-border pb-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-text-faint">
                  AWS LPU Recruitment
                </span>
              </div>

              <h1 className="text-[clamp(2rem,5vw,3.2rem)] font-semibold leading-none tracking-[-0.055em]">
                Applications
              </h1>

              <p className="mt-3 max-w-130 text-[12px] leading-5 text-text-muted">
                Review recruitment activity and handle
                applications that need your attention.
              </p>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-[9px] uppercase tracking-[0.14em] text-text-faint">
                Signed in as
              </div>
              <div className="mt-1 text-[11px] font-medium">
                {_user.name}
              </div>
              <div className="mt-0.5 text-[9px] text-text-faint">
                {_user.role}
              </div>
            </div>
          </div>
        </header>

        <section className="mt-7 grid grid-cols-2 border border-border bg-surface sm:grid-cols-4">
          {[
            ["Total", stats.total],
            ["Pending", stats.pending],
            ["Shortlisted", stats.shortlisted],
            ["Selected", stats.selected],
          ].map(([label, value], index) => (
            <div
              key={label}
              className={`px-5 py-6 sm:px-6 ${
                index > 0 ? "border-l border-border" : ""
              }`}
            >
              <div className="text-[9px] font-medium uppercase tracking-[0.14em] text-text-faint">
                {label}
              </div>

              <div className="mt-3 text-3xl font-semibold tracking-tighter">
                {value}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <div className="text-[9px] font-medium uppercase tracking-[0.14em] text-text-faint">
                  Needs attention
                </div>

                <h2 className="mt-2 text-xl font-semibold tracking-[-0.035em]">
                  Pending applications
                </h2>
              </div>

              <Link
                href="/applications"
                className="text-[9px] font-medium uppercase tracking-widest text-text-muted transition hover:text-foreground"
              >
                View all →
              </Link>
            </div>

            <div className="border border-border bg-surface">
              {loading ? (
                <div className="px-5 py-12 text-center text-[11px] text-text-faint">
                  Loading applications...
                </div>
              ) : needsAttention.length === 0 ? (
                <div className="px-5 py-12 text-center text-[11px] text-text-faint">
                  No pending applications.
                </div>
              ) : (
                needsAttention.map((application) => (
                  <Link
                    key={application.applicationId}
                    href={`/applications/${application.applicationId}`}
                    className="flex items-center gap-4 border-b border-border px-5 py-4 last:border-b-0 transition-colors hover:bg-surface-muted sm:px-6"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-muted text-[10px] font-medium">
                      {application.fullName
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12px] font-medium">
                        {application.fullName}
                      </div>

                      <div className="mt-1 truncate text-[9px] text-text-faint">
                        {application.universityEmail ||
                          application.personalEmail}
                      </div>
                    </div>

                    <div className="hidden min-w-35 text-[10px] text-text-muted sm:block">
                      {application.preferredRole}
                    </div>

                    <StatusBadge
                      status={application.status}
                    />

                    <span className="text-text-faint">
                      →
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>

          <aside className="border border-border bg-surface p-6">
            <div className="text-[9px] font-medium uppercase tracking-[0.14em] text-text-faint">
              Recruitment overview
            </div>

            <div className="mt-7">
              <div className="flex items-end justify-between">
                <span className="text-[10px] text-text-muted">
                  Reviewed
                </span>

                <span className="text-xl font-semibold tracking-[-0.04em]">
                  {stats.total
                    ? Math.round(
                        ((stats.total - stats.pending) /
                          stats.total) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>

              <div className="mt-3 h-1 bg-surface-muted">
                <div
                  className="h-full bg-foreground"
                  style={{
                    width: `${
                      stats.total
                        ? Math.min(
                            100,
                            ((stats.total - stats.pending) /
                              stats.total) *
                              100
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-8 border-t border-border pt-5">
              <div className="text-[9px] font-medium uppercase tracking-[0.14em] text-text-faint">
                Pipeline
              </div>

              <div className="mt-5 space-y-4">
                {[
                  ["Pending", stats.pending],
                  ["Shortlisted", stats.shortlisted],
                  ["Selected", stats.selected],
                ].map(([label, value]) => (
                  <div
                    key={String(label)}
                    className="flex items-center justify-between"
                  >
                    <span className="text-[10px] text-text-muted">
                      {label}
                    </span>

                    <span className="text-[11px] font-semibold">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-12">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="text-[9px] font-medium uppercase tracking-[0.14em] text-text-faint">
                Application directory
              </div>

              <h2 className="mt-2 text-xl font-semibold tracking-[-0.035em]">
                Find an applicant
              </h2>
            </div>

            <span className="text-[9px] text-text-faint">
              {filteredApplications.length} results
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search name, email, registration number..."
              className="h-10 flex-1 border border-border bg-surface px-4 text-[11px] outline-none transition placeholder:text-text-faint focus:border-border-strong"
            />

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value as
                    | "All"
                    | Application["status"]
                )
              }
              className="h-10 border border-border bg-surface px-4 text-[11px] text-foreground outline-none focus:border-border-strong"
            >
              <option value="All">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="Shortlisted">
                Shortlisted
              </option>
              <option value="Interview Scheduled">
                Interview Scheduled
              </option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="mt-4 overflow-hidden border border-border bg-surface">
            {loading ? (
              <div className="px-5 py-12 text-center text-[11px] text-text-faint">
                Loading...
              </div>
            ) : visibleApplications.length === 0 ? (
              <div className="px-5 py-12 text-center text-[11px] text-text-faint">
                No applications found.
              </div>
            ) : (
              <>
                <div className="hidden grid-cols-[1fr_220px_150px_24px] gap-5 border-b border-border bg-surface-muted px-5 py-3 sm:grid">
                  <span className="text-[8px] font-medium uppercase tracking-[0.14em] text-text-faint">
                    Applicant
                  </span>

                  <span className="text-[8px] font-medium uppercase tracking-[0.14em] text-text-faint">
                    Role / Academic
                  </span>

                  <span className="text-[8px] font-medium uppercase tracking-[0.14em] text-text-faint">
                    Status
                  </span>
                </div>

                <div className="divide-y divide-border">
                  {visibleApplications.map(
                    (application) => (
                      <Link
                        key={application.applicationId}
                        href={`/applications/${application.applicationId}`}
                        className="grid gap-3 px-5 py-4 transition-colors hover:bg-surface-muted sm:grid-cols-[1fr_220px_150px_24px] sm:items-center sm:gap-5"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-muted text-[9px] font-medium">
                            {application.fullName
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <div className="truncate text-[11px] font-medium">
                              {application.fullName}
                            </div>

                            <div className="mt-0.5 truncate text-[9px] text-text-faint">
                              {application.universityEmail ||
                                application.personalEmail}
                            </div>

                            <div className="mt-0.5 truncate text-[8px] uppercase tracking-[0.06em] text-text-faint">
                              {application.applicationId}
                            </div>
                          </div>
                        </div>

                        <div className="pl-11 sm:pl-0">
                          <div className="truncate text-[10px] text-text-muted">
                            {application.preferredRole}
                          </div>

                          <div className="mt-0.5 truncate text-[9px] text-text-faint">
                            {application.program} ·{" "}
                            {application.branch}
                          </div>
                        </div>

                        <div className="pl-11 sm:pl-0">
                          <StatusBadge
                            status={application.status}
                          />
                        </div>

                        <span className="hidden text-right text-text-faint sm:block">
                          →
                        </span>
                      </Link>
                    )
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-border px-5 py-4">
                  <span className="text-[9px] text-text-faint">
                    {filteredApplications.length === 0
                      ? 0
                      : (currentPage - 1) *
                          PAGE_SIZE +
                        1}
                    –
                    {Math.min(
                      currentPage * PAGE_SIZE,
                      filteredApplications.length
                    )}{" "}
                    of {filteredApplications.length}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() =>
                        setPage((value) =>
                          Math.max(1, value - 1)
                        )
                      }
                      className="border border-border px-3 py-1.5 text-[9px] text-text-muted transition hover:border-border-strong hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                    >
                      Previous
                    </button>

                    <span className="px-2 text-[9px] text-text-faint">
                      {currentPage} / {totalPages}
                    </span>

                    <button
                      type="button"
                      disabled={
                        currentPage === totalPages
                      }
                      onClick={() =>
                        setPage((value) =>
                          Math.min(
                            totalPages,
                            value + 1
                          )
                        )
                      }
                      className="border border-border px-3 py-1.5 text-[9px] text-text-muted transition hover:border-border-strong hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}