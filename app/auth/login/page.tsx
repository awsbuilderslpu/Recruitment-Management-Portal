import Link from "next/link";

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M5 12h13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="m13 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <path
        d="M8 10V7a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <main className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
        }}
      />
      <div className="pointer-events-none absolute -right-40 top-1/4 h-96 w-96 rounded-full bg-accent/6 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-7xl items-center px-5 py-12 sm:px-8 lg:px-12">
        <div className="grid w-full gap-14 lg:grid-cols-[1fr_440px] lg:items-center lg:gap-24">

          <div className="hidden lg:block">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                AWS LPU
              </span>
            </div>

            <h1 className="mt-8 max-w-3xl text-[clamp(4rem,6vw,6rem)] font-semibold leading-[0.86] tracking-[-0.075em]">
              Welcome
              <br />
              <span className="text-text-muted">
                back.
              </span>
            </h1>

            <p className="mt-8 max-w-lg text-[15px] leading-7 text-text-secondary">
              Your place to discover opportunities, manage applications,
              and stay connected with the AWS LPU community.
            </p>

            <div className="mt-12 flex items-center gap-6 text-[10px] uppercase tracking-[0.14em] text-text-faint">
              <span>Recruitment</span>

              <span className="h-1 w-1 rounded-full bg-border-strong" />

              <span>Community</span>

              <span className="h-1 w-1 rounded-full bg-border-strong" />
              
              <span>Opportunities</span>
            </div>
          </div>

          <div className="w-full">
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-accent" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                  AWS LPU
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-semibold leading-none tracking-[-0.055em]">
                Welcome
                <br />
                <span className="text-text-muted">
                  back.
                </span>
              </h1>
            </div>

            <div className="border border-border bg-surface">
              <div className="border-b border-border px-6 py-6 sm:px-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-faint">
                  Recruitment
                </p>

                <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em]">
                  Sign in to continue
                </h2>

                <p className="mt-2 max-w-sm text-[13px] leading-6 text-text-secondary">
                  Use your AWS LPU account to access the recruitment
                  platform.
                </p>
              </div>

              <div className="px-6 py-7 sm:px-8 sm:py-8">
                <a
                  href="/api/auth/login"
                  className="group flex min-h-12 w-full items-center justify-between border border-foreground bg-foreground px-4 text-[12px] font-medium text-background transition-opacity hover:opacity-85 sm:px-5 sm:text-[13px]"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-background/10">
                      <LockIcon />
                    </span>

                    Continue with AWS LPU
                  </span>

                  <span className="transition-transform group-hover:translate-x-1">
                    <ArrowIcon />
                  </span>
                </a>

                <div className="mt-7 flex gap-3 border-t border-border pt-6">
                  <div className="mt-0.5 shrink-0 text-text-muted">
                    <LockIcon />
                  </div>

                  <p className="text-[11px] leading-5 text-text-muted">
                    Authentication is handled by AWS LPU Identity
                    Services. Your password is never stored by this
                    portal.
                  </p>
                </div>
              </div>
              <div className="border-t border-border bg-surface-muted px-6 py-4 sm:px-8">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] uppercase tracking-[0.12em] text-text-faint">
                    AWS LPU Identity
                  </span>

                  <span className="text-[10px] text-text-faint">
                    Secure authentication
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between px-1">
              <Link
                href="/"
                className="text-[10px] text-text-faint transition-colors hover:text-text-secondary"
              >
                ← Back to AWS LPU
              </Link>

              <span className="text-[10px] text-text-faint">
                recruitment.awslpu.in
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
