import Link from "next/link";

const recruitmentSteps = [
  {
    number: "01",
    title: "Discover",
    description:
      "Explore opportunities, roles, and programs available through AWS LPU.",
  },
  {
    number: "02",
    title: "Apply",
    description:
      "Submit your application using your AWS LPU identity and keep everything in one place.",
  },
  {
    number: "03",
    title: "Assess",
    description:
      "Complete the assessments and technical evaluations relevant to your opportunity.",
  },
  {
    number: "04",
    title: "Interview",
    description:
      "Move through the interview process with clear stages and timely updates.",
  },
  {
    number: "05",
    title: "Offer",
    description:
      "Receive your offer, review the details, and respond directly through the portal.",
  },
  {
    number: "06",
    title: "Begin",
    description:
      "Take the next step and start building with the AWS LPU community.",
  },
];

const benefits = [
  {
    title: "Build with AWS",
    description:
      "Work with cloud technologies and modern infrastructure while turning ideas into real products.",
  },
  {
    title: "Learn by doing",
    description:
      "Go beyond theory through workshops, technical sessions, projects, and hands-on experiences.",
  },
  {
    title: "Find your people",
    description:
      "Connect with students, builders, community leaders, and people who are equally curious about technology.",
  },
  {
    title: "Create opportunities",
    description:
      "Build projects, participate in challenges, showcase your work, and open doors to what comes next.",
  },
];

const builderTracks = [
  "Cloud & Infrastructure",
  "Artificial Intelligence",
  "Serverless",
  "DevOps",
  "Data & Analytics",
  "Application Development",
];

const reasons = [
  {
    number: "01",
    title: "Industry exposure",
    description:
      "Learn through technical sessions, community events, projects, and experiences connected to real-world technology.",
  },
  {
    number: "02",
    title: "Builder mindset",
    description:
      "Turn ideas into working systems instead of stopping at theory.",
  },
  {
    number: "03",
    title: "Community",
    description:
      "Meet people who are learning, experimenting, leading, and building alongside you.",
  },
  {
    number: "04",
    title: "Opportunities",
    description:
      "Use your skills and experiences to discover what comes next.",
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

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col overflow-x-hidden bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "clamp(42px, 5vw, 64px) clamp(42px, 5vw, 64px)",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 62%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 62%, transparent 100%)",
          }}
        />

        <div className="pointer-events-none absolute left-[58%] top-[15%] h-56 w-56 rounded-full bg-accent/5 blur-3xl sm:h-80 sm:w-80 lg:left-[68%] lg:top-[20%] lg:h-120 lg:w-120" />

        <div className="relative mx-auto flex w-full max-w-375 flex-col px-5 pb-10 pt-12 sm:px-8 sm:pb-14 sm:pt-16 lg:px-16 lg:pb-16 lg:pt-20">
          <div className="max-w-262.5">
            <div className="mb-6 flex items-center gap-3 sm:mb-8">
              <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-muted sm:text-[11px]">
                AWS LPU Recruitment
              </span>
            </div>

            <h1 className="max-w-250 text-[clamp(3.25rem,11vw,6rem)] font-semibold leading-[0.9] tracking-[-0.065em]">
              Build your
              <br />
              <span className="text-text-muted">next chapter.</span>
            </h1>

            <p className="mt-7 max-w-170 text-[15px] leading-7 text-text-secondary sm:mt-8 sm:text-[17px] sm:leading-8">
              Discover opportunities, build real things, connect with
              ambitious people, and take your next step with AWS LPU.
            </p>

            <div className="mt-8 flex flex-col items-start gap-4 sm:mt-10 sm:flex-row sm:items-center">
              <Link
                href="/auth/login"
                className="group inline-flex h-12 w-full items-center justify-center bg-foreground px-6 text-[13px] font-medium text-background transition-opacity duration-200 hover:opacity-80 sm:w-auto sm:px-7"
              >
                Explore opportunities
                <span className="ml-4 transition-transform duration-200 group-hover:translate-x-1">
                  <ArrowIcon />
                </span>
              </Link>

              <span className="text-[11px] text-text-faint">
                Sign in with your AWS LPU account
              </span>
            </div>
          </div>

          <div className="mt-14 grid border-t border-border pt-5 sm:mt-20 sm:grid-cols-3 sm:pt-6 lg:mt-24">
            <div className="border-b border-border pb-5 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-8">
              <div className="text-[10px] uppercase tracking-[0.14em] text-text-faint">
                Opportunities
              </div>
              <div className="mt-2 max-w-70 text-[12px] leading-5 text-text-secondary sm:text-[13px]">
                Discover roles and programs built for ambitious students.
              </div>
            </div>

            <div className="border-b border-border py-5 sm:border-b-0 sm:border-r sm:px-8 sm:py-0">
              <div className="text-[10px] uppercase tracking-[0.14em] text-text-faint">
                Community
              </div>
              <div className="mt-2 max-w-70 text-[12px] leading-5 text-text-secondary sm:text-[13px]">
                Learn and build alongside a growing community of builders.
              </div>
            </div>

            <div className="pt-5 sm:pl-8 sm:pt-0">
              <div className="text-[10px] uppercase tracking-[0.14em] text-text-faint">
                Growth
              </div>
              <div className="mt-2 max-w-70 text-[12px] leading-5 text-text-secondary sm:text-[13px]">
                Turn curiosity into skills, projects, and opportunities.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-375 px-5 py-16 sm:px-8 sm:py-20 lg:px-16 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <div>
              <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-text-faint">
                More than recruitment
              </div>

              <h2 className="mt-4 max-w-125 text-[clamp(2rem,5vw,2.4rem)] font-semibold leading-[1.05] tracking-[-0.045em]">
                A place to start building.
              </h2>
            </div>

            <div className="max-w-180">
              <p className="text-[15px] leading-7 text-text-secondary sm:text-[17px] sm:leading-8">
                Recruitment is only one part of the journey. AWS LPU brings
                together opportunities to learn, build, collaborate, and
                contribute to a community shaped by technology.
              </p>

              <p className="mt-5 text-[15px] leading-7 text-text-secondary sm:mt-6 sm:text-[17px] sm:leading-8">
                Whether you are taking your first steps into cloud computing
                or already building production-grade systems, there is room to
                grow, experiment, and make something meaningful.
              </p>
            </div>
          </div>

          <div className="mt-14 grid border-t border-border sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="border-b border-border py-7 sm:px-6 sm:py-8 lg:border-b-0 lg:border-r lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
              >
                <div className="text-[10px] text-text-faint">
                  0{index + 1}
                </div>

                <h3 className="mt-6 text-[15px] font-medium">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-[12px] leading-5 text-text-subtle">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-375 px-5 py-16 sm:px-8 sm:py-20 lg:px-16 lg:py-24">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end lg:gap-10">
            <div>
              <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-text-faint">
                The recruitment journey
              </div>

              <h2 className="mt-4 max-w-162.5 text-[clamp(2rem,5vw,2.4rem)] font-semibold leading-[1.05] tracking-[-0.045em]">
                Clear steps.
                <br />
                No guessing.
              </h2>
            </div>

            <p className="max-w-105 text-[13px] leading-6 text-text-muted sm:text-[14px]">
              From your first application to the moment you begin, the
              recruitment journey is designed to keep you informed at every
              stage.
            </p>
          </div>

          <div className="mt-12 grid border-l border-t border-border sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
            {recruitmentSteps.map((step) => (
              <div
                key={step.number}
                className="flex min-h-47.5 flex-col border-b border-r border-border bg-surface p-5 sm:min-h-55 sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-text-faint">
                    {step.number}
                  </span>

                  <span className="h-1.5 w-1.5 rounded-full bg-text-faint" />
                </div>

                <div className="mt-auto pt-10 sm:pt-16">
                  <h3 className="text-[16px] font-medium">
                    {step.title}
                  </h3>

                  <p className="mt-3 max-w-75 text-[12px] leading-5 text-text-subtle">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-border bg-[#111] text-white dark:bg-black">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(#555 1px, transparent 1px), linear-gradient(90deg, #555 1px, transparent 1px)",
            backgroundSize: "clamp(42px, 5vw, 64px) clamp(42px, 5vw, 64px)",
          }}
        />

        <div className="relative mx-auto max-w-375 px-5 py-16 sm:px-8 sm:py-20 lg:px-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-accent" />

                <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-gray-400">
                  AWS Student Builder Groups
                </span>
              </div>

              <h2 className="mt-6 max-w-130 text-[clamp(2.1rem,5vw,2.5rem)] font-semibold leading-[1.02] tracking-[-0.045em]">
                Don&apos;t just learn technology.
                <br />
                <span className="text-gray-500">Build with it.</span>
              </h2>

              <p className="mt-6 max-w-130 text-[13px] leading-7 text-gray-400 sm:mt-7 sm:text-[14px]">
                AWS Student Builder Groups bring students and builders
                together to learn, collaborate, experiment, and create.
              </p>

              <Link
                href="/auth/login"
                className="mt-8 inline-flex h-11 items-center border border-gray-600 px-6 text-[12px] font-medium text-white transition-colors duration-200 hover:border-gray-400 hover:bg-white/5"
              >
                Join the journey
              </Link>
            </div>

            <div>
              <div className="grid border-l border-t border-gray-800 sm:grid-cols-2">
                {builderTracks.map((track, index) => (
                  <div
                    key={track}
                    className="flex min-h-26.25 flex-col justify-between border-b border-r border-gray-800 p-5 sm:min-h-31.25 sm:p-6"
                  >
                    <span className="text-[10px] text-gray-600">
                      0{index + 1}
                    </span>

                    <span className="text-[12px] text-gray-300 sm:text-[13px]">
                      {track}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-7 border-t border-gray-800 pt-5 sm:mt-8 sm:pt-6">
                <p className="text-[10px] leading-5 text-gray-600 sm:text-[11px]">
                  AWS announced in 2026 that AWS Cloud Clubs are evolving
                  into AWS Student Builder Groups, with the community
                  spanning 600+ colleges and universities across 63
                  countries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-375 px-5 py-16 sm:px-8 sm:py-20 lg:px-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-text-faint">
                Why AWS LPU
              </div>

              <h2 className="mt-4 max-w-140 text-[clamp(2rem,5vw,2.4rem)] font-semibold leading-[1.05] tracking-[-0.045em]">
                Build skills that move with you.
              </h2>
            </div>

            <div className="grid gap-10 sm:grid-cols-2">
              {reasons.map((reason) => (
                <div key={reason.number}>
                  <div className="text-[22px] font-semibold tracking-[-0.03em]">
                    {reason.number}
                  </div>

                  <h3 className="mt-4 text-[15px] font-medium">
                    {reason.title}
                  </h3>

                  <p className="mt-2 text-[12px] leading-5 text-text-subtle">
                    {reason.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-background">
        <div className="mx-auto max-w-375 px-5 py-20 text-center sm:px-8 sm:py-24 lg:px-16 lg:py-28">
          <div className="mx-auto max-w-212.5">
            <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-faint">
              Your next step
            </div>

            <h2 className="mt-5 text-[clamp(2.75rem,8vw,4rem)] font-semibold leading-[0.95] tracking-[-0.055em]">
              Ready to build
              <br />
              <span className="text-text-muted">what&apos;s next?</span>
            </h2>

            <p className="mx-auto mt-6 max-w-135 text-[13px] leading-6 text-text-muted sm:mt-7 sm:text-[14px]">
              Sign in with your AWS LPU account to explore opportunities,
              manage your applications, and continue your journey.
            </p>

            <Link
              href="/auth/login"
              className="group mt-8 inline-flex h-12 w-full items-center justify-center bg-foreground px-7 text-[13px] font-medium text-background transition-opacity duration-200 hover:opacity-80 sm:mt-9 sm:w-auto sm:px-8"
            >
              Get started

              <span className="ml-4 transition-transform duration-200 group-hover:translate-x-1">
                <ArrowIcon />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}