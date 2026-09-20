type UserDashboardProps = {
  user: {
    sub: string;
    name: string;
    email: string;
    picture?: string;
    role: string;
  };
};

const journey = [
  {
    number: "01",
    title: "Profile",
    description: "Your AWS LPU identity is verified.",
    status: "Complete",
  },
  {
    number: "02",
    title: "Application",
    description: "Submit an application when an opportunity opens.",
    status: "Next",
  },
  {
    number: "03",
    title: "Assessment",
    description: "Complete any assessments required for your application.",
    status: "Upcoming",
  },
  {
    number: "04",
    title: "Interview",
    description: "Meet the recruitment team when shortlisted.",
    status: "Upcoming",
  },
  {
    number: "05",
    title: "Decision",
    description: "Track the final outcome of your recruitment journey.",
    status: "Upcoming",
  },
];

const opportunities = [
  {
    number: "01",
    title: "Recruitment opportunities",
    description:
      "Explore open roles and opportunities available through AWS LPU.",
    action: "Explore opportunities",
  },
  {
    number: "02",
    title: "Builder programs",
    description:
      "Discover programs, projects, and experiences for students who want to build.",
    action: "Discover programs",
  },
  {
    number: "03",
    title: "AWS LPU community",
    description:
      "Stay connected with builders, events, workshops, and community activities.",
    action: "Explore community",
  },
];

export default function UserDashboard({
  user,
}: UserDashboardProps) {
  return (
    <main className="relative min-h-full flex-1 overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute inset-0 opacity-50 dark:opacity-20"
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

      <div className="pointer-events-none absolute right-[-10%] top-[8%] h-72 w-72 rounded-full bg-accent/5 blur-3xl sm:h-120 sm:w-120" />

      <div className="relative mx-auto w-full max-w-375 px-5 py-8 sm:px-8 sm:py-12 lg:px-16 lg:py-14">
        <header className="flex flex-col gap-7 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent" />

              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-faint">
                AWS LPU Recruitment
              </span>
            </div>

            <h1 className="text-[clamp(2.75rem,7vw,4.5rem)] font-semibold leading-[0.92] tracking-[-0.06em]">
              Welcome back,
              <br />
              <span className="text-text-muted">
                {user.name}.
              </span>
            </h1>

            <p className="mt-6 max-w-155 text-[13px] leading-6 text-text-secondary sm:text-[14px] sm:leading-7">
              Your recruitment workspace for discovering opportunities,
              tracking your journey, and staying connected with AWS LPU.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="h-11 w-11 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-sm font-medium text-background">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <div className="text-[12px] font-medium">
                {user.name}
              </div>

              <div className="mt-1 text-[10px] text-text-faint">
                {user.email}
              </div>
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="border border-border bg-surface">
            <div className="border-b border-border px-6 py-5 sm:px-7">
              <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-text-faint">
                Your account
              </div>
            </div>

            <div className="px-6 py-7 sm:px-7">
              <div className="flex items-center gap-4">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-lg font-medium text-background">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">
                  <h2 className="truncate text-[16px] font-medium">
                    {user.name}
                  </h2>

                  <p className="mt-1 truncate text-[11px] text-text-muted">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-border pt-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] uppercase tracking-[0.12em] text-text-faint">
                    Account role
                  </span>

                  <span className="text-[11px] font-medium capitalize">
                    {user.role}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <span className="text-[10px] uppercase tracking-[0.12em] text-text-faint">
                    Identity
                  </span>

                  <span className="text-[11px] text-text-muted">
                    AWS LPU SSO
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-border bg-surface-muted px-6 py-4 sm:px-7">
              <a
                href="/api/auth/logout"
                className="text-[10px] text-text-faint transition hover:text-foreground"
              >
                Sign out →
              </a>
            </div>
          </div>

          <div className="border border-border bg-surface">
            <div className="border-b border-border px-6 py-5 sm:px-7">
              <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-text-faint">
                Recruitment journey
              </div>

              <p className="mt-2 text-[11px] leading-5 text-text-muted">
                Your journey from application to opportunity.
              </p>
            </div>

            <div className="grid sm:grid-cols-5">
              {journey.map((step) => (
                <div
                  key={step.number}
                  className="border-b border-border p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 sm:p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-text-faint">
                      {step.number}
                    </span>

                    {step.status === "Complete" && (
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    )}
                  </div>

                  <div className="mt-7 text-[12px] font-medium">
                    {step.title}
                  </div>

                  <p className="mt-2 text-[10px] leading-5 text-text-subtle">
                    {step.description}
                  </p>

                  <div
                    className={`mt-5 text-[9px] uppercase tracking-widest ${
                      step.status === "Complete"
                        ? "text-accent"
                        : step.status === "Next"
                          ? "text-text-muted"
                          : "text-text-faint"
                    }`}
                  >
                    {step.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-text-faint">
              Discover
            </div>

            <div className="mt-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <h2 className="text-[clamp(1.8rem,4vw,2.35rem)] font-semibold leading-none tracking-[-0.045em]">
                Explore what&apos;s next.
              </h2>

              <p className="max-w-95 text-[11px] leading-5 text-text-muted">
                Find opportunities to learn, build, collaborate, and
                contribute with AWS LPU.
              </p>
            </div>
          </div>

          <div className="grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((opportunity) => (
              <div
                key={opportunity.number}
                className="group flex min-h-55 flex-col border-b border-r border-border bg-surface p-6 transition-colors duration-200 hover:bg-surface-muted sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-text-faint">
                    {opportunity.number}
                  </span>

                  <span className="h-1.5 w-1.5 rounded-full bg-text-faint transition-colors duration-200 group-hover:bg-accent" />
                </div>

                <div className="mt-auto">
                  <h3 className="text-[15px] font-medium">
                    {opportunity.title}
                  </h3>

                  <p className="mt-3 max-w-82.5 text-[11px] leading-5 text-text-subtle">
                    {opportunity.description}
                  </p>

                  <button
                    type="button"
                    className="mt-6 text-[10px] font-medium text-text-muted transition-colors hover:text-foreground"
                  >
                    {opportunity.action} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 border border-border bg-foreground text-background">
          <div className="grid gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] opacity-50">
                Keep building
              </div>

              <h2 className="mt-3 max-w-162.5 text-[clamp(1.8rem,4vw,2.5rem)] font-semibold leading-none tracking-[-0.045em]">
                Your next opportunity could start here.
              </h2>

              <p className="mt-4 max-w-150 text-[11px] leading-6 opacity-60 sm:text-[12px]">
                Keep learning, keep building, and stay connected with the
                AWS LPU community.
              </p>
            </div>

            <div className="text-[10px] uppercase tracking-[0.12em] opacity-50">
              AWS LPU
            </div>
          </div>
        </section>

        <footer className="mt-8 flex flex-col gap-2 border-t border-border pt-5 text-[10px] text-text-faint sm:flex-row sm:items-center sm:justify-between">
          <span>AWS LPU Recruitment Management Portal</span>

          <span>
            Signed in through AWS LPU Identity Services
          </span>
        </footer>
      </div>
    </main>
  );
}
