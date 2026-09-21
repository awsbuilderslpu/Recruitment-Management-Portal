import Link from "next/link";
import { ArrowLeft, Clock3 } from "lucide-react";

export default function NewApplicationPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-350 flex-1 items-center px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-2xl">
          <Link
            href="/dashboard"
            className="mb-8 inline-flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.12em] text-text-muted transition hover:text-foreground"
          >
            <ArrowLeft size={13} />
            Back to dashboard
          </Link>

          <div className="border border-border bg-surface">
            <div className="border-b border-border px-6 py-7 sm:px-8 sm:py-8">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-accent" />

                <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-text-faint">
                  AWS LPU Recruitment
                </span>
              </div>

              <h1 className="mt-4 text-[28px] font-semibold tracking-[-0.045em] sm:text-[32px]">
                Recruitment is currently closed.
              </h1>

              <p className="mt-3 max-w-xl text-[11px] leading-6 text-text-muted">
                We&apos;re not accepting applications right now.
                Keep an eye on AWS LPU announcements for the next
                recruitment cycle.
              </p>
            </div>

            <div className="px-6 py-7 sm:px-8">
              <div className="border border-border bg-surface-muted px-5 py-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-text-muted">
                    <Clock3 size={15} />
                  </div>

                  <div>
                    <p className="text-[11px] font-medium">
                      No active application window
                    </p>

                    <p className="mt-1.5 text-[10px] leading-5 text-text-muted">
                      Applications will open here when the next
                      recruitment cycle begins.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[9px] text-text-faint">
                  AWS LPU Recruitment
                </p>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 bg-foreground px-4 py-2.5 text-[9px] font-medium uppercase tracking-widest text-background transition hover:opacity-90"
                >
                  Return to dashboard
                  <ArrowLeft
                    size={12}
                    className="rotate-180"
                  />
                </Link>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-[9px] text-text-faint">
            Recruitment opportunities are announced through AWS
            LPU community channels.
          </p>
        </div>
      </div>
    </main>
  );
}