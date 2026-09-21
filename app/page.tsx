import Link from "next/link";

const opportunities = [
  {
    type: "RECRUITMENT",
    title: "Join AWS LPU",
    description:
      "Apply to become part of the student community building, learning, and shipping with AWS.",
    meta: "Applications open",
    accent: "bg-orange-500",
  },
  {
    type: "COMMUNITY",
    title: "Builder Groups",
    description:
      "Learn cloud, AI, DevOps, serverless, and modern application development with fellow builders.",
    meta: "Explore community",
    accent: "bg-violet-500",
  },
  {
    type: "EVENTS",
    title: "Upcoming events",
    description:
      "Workshops, technical sessions, hackathons, and community experiences throughout the year.",
    meta: "View events",
    accent: "bg-blue-500",
  },
];

const tracks = [
  "Cloud & Infrastructure",
  "Artificial Intelligence",
  "Serverless",
  "DevOps",
  "Data & Analytics",
  "Application Development",
];

const journey = [
  {
    number: "01",
    title: "Apply",
    description:
      "Tell us about yourself, your skills, and what you want to build.",
  },
  {
    number: "02",
    title: "Build",
    description:
      "Take part in technical discussions, assessments, and community activities.",
  },
  {
    number: "03",
    title: "Contribute",
    description:
      "Join the people building the next generation of AWS LPU experiences.",
  },
];

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

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="relative overflow-hidden border-b border-border">
        {/* Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-50 dark:opacity-20"
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

        {/* Decorative shapes */}
        <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-orange-500/[0.07] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:px-12 lg:pb-24 lg:pt-20">
          {/* Eyebrow */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                AWS LPU · Recruitment
              </span>
            </div>

            <span className="hidden text-[10px] uppercase tracking-[0.16em] text-text-faint sm:block">
              2026 — 2027
            </span>
          </div>

          {/* Hero copy */}
          <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
            <div>
              <h1 className="max-w-4xl text-[clamp(3.5rem,9vw,7.5rem)] font-semibold leading-[0.84] tracking-[-0.075em]">
                Build
                <br />
                <span className="text-text-muted">
                  what&apos;s next.
                </span>
              </h1>
            </div>

            <div className="flex flex-col justify-end lg:pb-2">
              <p className="max-w-md text-[15px] leading-7 text-text-secondary sm:text-[17px] sm:leading-8">
                AWS LPU is a community of students who learn, build,
                experiment, and create together.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/auth/login"
                  className="group inline-flex h-12 items-center justify-center bg-foreground px-6 text-[13px] font-medium text-background transition-opacity hover:opacity-80"
                >
                  Explore opportunities

                  <span className="ml-5 transition-transform group-hover:translate-x-1">
                    <ArrowIcon />
                  </span>
                </Link>

                <span className="text-[11px] text-text-faint">
                  AWS LPU account required
                </span>
              </div>
            </div>
          </div>

          {/* Bottom stats */}
          <div className="mt-16 grid border-y border-border sm:mt-24 sm:grid-cols-3">
            <div className="border-b border-border py-5 sm:border-b-0 sm:border-r sm:pr-8">
              <p className="text-[10px] uppercase tracking-[0.16em] text-text-faint">
                Focus
              </p>

              <p className="mt-2 text-sm font-medium">
                Build · Learn · Contribute
              </p>
            </div>

            <div className="border-b border-border py-5 sm:border-b-0 sm:border-r sm:px-8">
              <p className="text-[10px] uppercase tracking-[0.16em] text-text-faint">
                Community
              </p>

              <p className="mt-2 text-sm font-medium">
                Students · Builders · Leaders
              </p>
            </div>

            <div className="py-5 sm:pl-8">
              <p className="text-[10px] uppercase tracking-[0.16em] text-text-faint">
                Ecosystem
              </p>

              <p className="mt-2 text-sm font-medium">
                AWS · LPU · Technology
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          OPPORTUNITIES
          ===================================================== */}

      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-faint">
                Start here
              </p>

              <h2 className="mt-4 text-[clamp(2.2rem,5vw,3.5rem)] font-semibold leading-[0.95] tracking-[-0.055em]">
                Find your place.
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-6 text-text-secondary">
              Recruitment is only one doorway into AWS LPU. Explore
              opportunities, community, and the things happening around you.
            </p>
          </div>

          <div className="mt-12 grid gap-3 lg:grid-cols-3">
            {opportunities.map((opportunity) => (
              <Link
                key={opportunity.title}
                href="/auth/login"
                className="group relative flex min-h-80 flex-col overflow-hidden border border-border p-6 transition-colors hover:bg-surface-muted sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-text-faint">
                    <span
                      className={`h-2 w-2 rounded-full ${opportunity.accent}`}
                    />
                    {opportunity.type}
                  </span>

                  <span className="transition-transform group-hover:translate-x-1">
                    <ArrowIcon />
                  </span>
                </div>

                <div className="mt-auto">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-text-faint">
                    {opportunity.meta}
                  </p>

                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                    {opportunity.title}
                  </h3>

                  <p className="mt-3 max-w-sm text-[13px] leading-6 text-text-secondary">
                    {opportunity.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          BUILDER SECTION
          ===================================================== */}

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-faint">
                What we build with
              </p>

              <h2 className="mt-4 max-w-lg text-[clamp(2.3rem,5vw,4rem)] font-semibold leading-[0.95] tracking-[-0.06em]">
                Curiosity
                <br />
                becomes
                <br />
                <span className="text-text-muted">
                  something real.
                </span>
              </h2>

              <p className="mt-7 max-w-md text-sm leading-7 text-text-secondary">
                Pick a technology, find people who are interested in the
                same problems, and start building.
              </p>
            </div>

            <div className="grid border-l border-t border-border sm:grid-cols-2">
              {tracks.map((track, index) => (
                <div
                  key={track}
                  className="group flex min-h-40 flex-col justify-between border-b border-r border-border p-5 transition-colors hover:bg-surface-muted sm:p-7"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-text-faint">
                      0{index + 1}
                    </span>

                    <span className="opacity-0 transition-opacity group-hover:opacity-100">
                      <PlusIcon />
                    </span>
                  </div>

                  <p className="text-sm font-medium">
                    {track}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          JOURNEY
          ===================================================== */}

      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-faint">
                Your journey
              </p>

              <h2 className="mt-4 max-w-md text-[clamp(2.3rem,5vw,3.75rem)] font-semibold leading-[0.95] tracking-[-0.055em]">
                Three steps.
                <br />
                <span className="text-text-muted">
                  Then you&apos;re in.
                </span>
              </h2>
            </div>

            <div className="divide-y border-y border-border">
              {journey.map((item) => (
                <div
                  key={item.number}
                  className="grid gap-5 py-7 sm:grid-cols-[80px_180px_1fr] sm:items-start sm:gap-8"
                >
                  <span className="text-[11px] font-medium text-text-faint">
                    {item.number}
                  </span>

                  <h3 className="text-lg font-medium tracking-[-0.02em]">
                    {item.title}
                  </h3>

                  <p className="max-w-md text-[13px] leading-6 text-text-secondary">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          DARK COMMUNITY STATEMENT
          ===================================================== */}

      <section className="relative overflow-hidden bg-[#111] text-white dark:bg-black">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(#555 1px, transparent 1px), linear-gradient(90deg, #555 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                AWS Student Builder Groups
              </span>
            </div>

            <h2 className="mt-8 text-[clamp(2.8rem,7vw,6rem)] font-semibold leading-[0.88] tracking-[-0.07em]">
              Don&apos;t just
              <br />
              <span className="text-gray-500">
                learn technology.
              </span>
              <br />
              Build with it.
            </h2>

            <div className="mt-10 flex flex-col justify-between gap-8 border-t border-gray-800 pt-7 sm:flex-row sm:items-end">
              <p className="max-w-xl text-sm leading-7 text-gray-400">
                A student-led environment for people who want to experiment,
                collaborate, ship projects, and grow together.
              </p>

              <Link
                href="/auth/login"
                className="group inline-flex shrink-0 items-center gap-4 text-[12px] font-medium text-white"
              >
                Enter AWS LPU

                <span className="transition-transform group-hover:translate-x-1">
                  <ArrowIcon />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
          ===================================================== */}

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-faint">
                Ready?
              </p>

              <h2 className="mt-4 max-w-3xl text-[clamp(3rem,7vw,6rem)] font-semibold leading-[0.86] tracking-[-0.07em]">
                Your next
                <br />
                <span className="text-text-muted">
                  chapter starts here.
                </span>
              </h2>
            </div>

            <Link
              href="/auth/login"
              className="group inline-flex h-12 items-center justify-center bg-foreground px-7 text-[13px] font-medium text-background transition-opacity hover:opacity-80"
            >
              Get started

              <span className="ml-5 transition-transform group-hover:translate-x-1">
                <ArrowIcon />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
