"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
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
  linkedin: string;
  github: string;
  portfolio: string;
  preferredRole: string;
  resumeUrl: string;
  communities: string;
  achievement: string;
  whyJoin: string;
  roleAnswers: Record<string, string>;
};

type Props = {
  application: Application;
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

export function MyApplicationView({
  application,
}: Props) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-350 px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <header className="border-b border-border pb-7">
          <Link
            href="/dashboard"
            className="mb-6 inline-flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.12em] text-text-muted transition hover:text-foreground"
          >
            <ArrowLeft size={13} />
            Back to dashboard
          </Link>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-accent" />

                <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-text-faint">
                  My application
                </p>
              </div>

              <h1 className="mt-3 text-[28px] font-semibold tracking-[-0.045em] sm:text-[32px]">
                {application.preferredRole ||
                  "Recruitment Application"}
              </h1>

              <p className="mt-1.5 font-mono text-[9px] text-text-muted">
                {application.applicationId}
              </p>
            </div>

            <StatusBadge status={application.status} />
          </div>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <Section
              title="Personal information"
              description="Information submitted with your application."
            >
              <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <Field
                  label="Full name"
                  value={application.fullName}
                />

                <Field
                  label="Registration number"
                  value={application.registrationNumber}
                />

                <Field
                  label="University email"
                  value={application.universityEmail}
                />

                <Field
                  label="Personal email"
                  value={application.personalEmail}
                />

                <Field
                  label="Phone"
                  value={application.phone}
                />
              </div>
            </Section>

            <Section
              title="Academic information"
              description="Your academic details at the time of application."
            >
              <div className="grid gap-x-8 gap-y-6 sm:grid-cols-3">
                <Field
                  label="Program"
                  value={application.program}
                />

                <Field
                  label="Branch"
                  value={application.branch}
                />

                <Field
                  label="Semester"
                  value={application.semester}
                />

                <Field
                  label="CGPA"
                  value={application.cgpa}
                />
              </div>
            </Section>

            <Section
              title="Role preference"
              description="The role you selected during recruitment."
            >
              <Field
                label="Preferred role"
                value={application.preferredRole}
              />
            </Section>

            <Section
              title="Links & resume"
              description="Professional profiles and submitted resume."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <ExternalLinkField
                    icon={
                        <span className="text-[10px] font-semibold">
                        GH
                        </span>
                    }
                    label="GitHub"
                    value={application.github}
                />

                <ExternalLinkField
                    icon={
                        <span className="text-[10px] font-semibold">
                        in
                        </span>
                    }
                    label="LinkedIn"
                    value={application.linkedin}
                />

                <ExternalLinkField
                  icon={<ExternalLink size={13} />}
                  label="Portfolio"
                  value={application.portfolio}
                />

                <ExternalLinkField
                  icon={<FileText size={13} />}
                  label="Resume"
                  value={application.resumeUrl}
                />
              </div>
            </Section>

            <Section
              title="Community & experience"
              description="Additional information provided in your application."
            >
              <div className="space-y-7">
                <LongField
                  label="Communities"
                  value={application.communities}
                />

                <LongField
                  label="Achievements"
                  value={application.achievement}
                />

                <LongField
                  label="Why do you want to join?"
                  value={application.whyJoin}
                />
              </div>
            </Section>

            {Object.keys(application.roleAnswers || {})
              .length > 0 && (
              <Section
                title="Role-specific responses"
                description="Your responses to the role-specific questions."
              >
                <div className="space-y-7">
                  {Object.entries(
                    application.roleAnswers
                  ).map(([question, answer]) => (
                    <LongField
                      key={question}
                      label={question}
                      value={answer}
                    />
                  ))}
                </div>
              </Section>
            )}
          </div>

          <aside className="h-fit border border-border bg-surface">
            <div className="border-b border-border px-5 py-4">
              <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-text-faint">
                Application status
              </p>

              <div className="mt-3">
                <StatusBadge status={application.status} />
              </div>
            </div>

            <div className="space-y-5 p-5">
              <InfoRow
                label="Application ID"
                value={application.applicationId}
              />

              <InfoRow
                label="Submitted"
                value={formatDate(application.timestamp)}
              />

              <InfoRow
                label="Preferred role"
                value={application.preferredRole || "—"}
              />

              <InfoRow
                label="Status"
                value={application.status}
              />
            </div>

            <div className="border-t border-border bg-surface-muted px-5 py-4">
              <p className="text-[9px] leading-5 text-text-muted">
                Your application is currently being processed
                by the AWS LPU recruitment team.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-border bg-surface">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-[13px] font-semibold">
          {title}
        </h2>

        <p className="mt-1 text-[10px] leading-5 text-text-muted">
          {description}
        </p>
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div>
      <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-text-faint">
        {label}
      </p>

      <p className="mt-2 wrap-break-word text-[11px] leading-5 text-text-secondary">
        {value || "—"}
      </p>
    </div>
  );
}

function LongField({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div>
      <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-text-faint">
        {label}
      </p>

      <p className="mt-2 whitespace-pre-wrap text-[11px] leading-6 text-text-secondary">
        {value || "—"}
      </p>
    </div>
  );
}

function ExternalLinkField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  if (!value) {
    return (
      <div className="border border-border px-4 py-3">
        <div className="flex items-center gap-2 text-text-faint">
          {icon}
          <span className="text-[9px] font-medium uppercase tracking-widest">
            {label}
          </span>
        </div>

        <p className="mt-2 text-[10px] text-text-faint">
          Not provided
        </p>
      </div>
    );
  }

  return (
    <a
      href={value}
      target="_blank"
      rel="noopener noreferrer"
      className="group border border-border px-4 py-3 transition hover:bg-surface-muted"
    >
      <div className="flex items-center gap-2 text-text-muted">
        {icon}

        <span className="text-[9px] font-medium uppercase tracking-widest">
          {label}
        </span>

        <ExternalLink
          size={10}
          className="ml-auto opacity-0 transition group-hover:opacity-100"
        />
      </div>

      <p className="mt-2 truncate text-[10px] text-text-secondary group-hover:text-foreground">
        {value}
      </p>
    </a>
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
    <div className="border-b border-border pb-3 last:border-b-0 last:pb-0">
      <p className="text-[8px] font-medium uppercase tracking-[0.12em] text-text-faint">
        {label}
      </p>

      <p className="mt-1.5 wrap-break-word text-[10px] text-text-secondary">
        {value || "—"}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const style =
    statusStyles[status] ||
    "border-border bg-surface-muted text-text-secondary";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.06em] ${style}`}
    >
      {status}
    </span>
  );
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