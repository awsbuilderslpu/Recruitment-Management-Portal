
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="relative flex flex-1 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "clamp(42px, 5vw, 64px) clamp(42px, 5vw, 64px)",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
        }}
      />

      <div className="pointer-events-none absolute left-[65%] top-[10%] h-56 w-56 rounded-full bg-accent/5 blur-3xl sm:h-80 sm:w-80 lg:left-[70%] lg:top-[15%] lg:h-124 lg:w-124" />

      <div className="relative mx-auto flex w-full max-w-350 flex-1 items-center px-5 py-10 sm:px-8 sm:py-14 lg:grid lg:grid-cols-[1fr_480px] lg:gap-20 lg:px-16 lg:py-20">
        <div className="hidden lg:block">
          <div className="mb-7 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-accent" />

            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-muted">
              AWS LPU Recruitment
            </span>
          </div>

          <h1 className="max-w-180 text-[clamp(3.5rem,5vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
            Welcome back.
            <br />
            <span className="text-text-muted">Let&apos;s build.</span>
          </h1>

          <p className="mt-8 max-w-142.5 text-[16px] leading-7 text-text-secondary">
            Sign in to continue your recruitment journey, manage your
            applications, explore opportunities, and stay connected with
            AWS LPU.
          </p>

          <div className="mt-12 grid max-w-155 grid-cols-3 border-l border-t border-border">
            <div className="min-h-31.25 border-b border-r border-border bg-surface/70 p-5">
              <div className="text-[10px] text-text-faint">01</div>

              <div className="mt-10 text-[13px] font-medium">
                Applications
              </div>
            </div>

            <div className="min-h-31.25 border-b border-r border-border bg-surface/70 p-5">
              <div className="text-[10px] text-text-faint">02</div>

              <div className="mt-10 text-[13px] font-medium">
                Recruitment
              </div>
            </div>

            <div className="min-h-31.25 border-b border-r border-border bg-surface/70 p-5">
              <div className="text-[10px] text-text-faint">03</div>

              <div className="mt-10 text-[13px] font-medium">
                Opportunities
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-6 text-[10px] uppercase tracking-[0.12em] text-text-faint">
            <span>Secure Identity</span>
            <span className="h-1 w-1 rounded-full bg-border-strong" />
            <span>Role Based Access</span>
            <span className="h-1 w-1 rounded-full bg-border-strong" />
            <span>AWS LPU</span>
          </div>
        </div>

        <div className="w-full lg:w-auto">
          <div className="border border-border bg-surface shadow-[0_12px_40px_rgba(0,0,0,0.055)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.2)]">
            <div className="border-b border-border px-5 py-5 sm:px-8 sm:py-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-[9px] font-medium uppercase tracking-[0.14em] text-text-faint sm:text-[10px]">
                    Recruitment Portal
                  </div>

                  <h2 className="mt-2 text-[20px] font-medium tracking-[-0.03em] sm:text-[21px]">
                    Sign in
                  </h2>
                </div>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4 text-background"
                  >
                    <path
                      d="M5 12h12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="m13 6 6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="px-5 py-7 sm:px-8 sm:py-9">
              <p className="text-[13px] leading-6 text-text-muted">
                Continue with your AWS LPU account to access your
                recruitment workspace.
              </p>

              <a
                href="/api/auth/login"
                className="group mt-7 flex min-h-12 w-full items-center justify-center gap-3 border border-border-strong bg-background px-4 text-[12px] font-medium transition hover:border-text-muted hover:bg-surface-muted sm:mt-8 sm:text-[13px]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5 shrink-0"
                >
                  <path
                    d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                  <path
                    d="m8 9.5 4 2.5 4-2.5M12 12v5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span>Continue with AWS LPU</span>

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="ml-1 h-4 w-4 shrink-0 text-text-faint transition-transform group-hover:translate-x-0.5"
                >
                  <path
                    d="M5 12h13"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                  <path
                    d="m13 6 6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              <div className="mt-7 border-t border-border pt-6">
                <div className="flex items-start gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mt-0.5 h-4 w-4 shrink-0 text-text-muted"
                  >
                    <rect
                      x="5"
                      y="10"
                      width="14"
                      height="10"
                      rx="1"
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

                  <p className="text-[11px] leading-5 text-text-muted">
                    Your credentials are handled by AWS LPU Identity
                    Services. This portal never stores your AWS LPU
                    password.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-border bg-surface-muted px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <span className="text-[10px] text-text-faint">
                AWS LPU Identity
              </span>

              <span className="text-[10px] text-text-faint">
                Secure authentication
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 px-1 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <Link
              href="/"
              className="text-[10px] text-text-faint transition hover:text-text-secondary"
            >
              ← Back to recruitment
            </Link>

            <span className="text-[10px] text-text-faint">
              recruitment.awslpu.in
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
