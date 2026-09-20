export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex min-h-16 w-full max-w-375 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-0 lg:px-16">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />

          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-text-muted">
            AWS LPU Recruitment
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] text-text-faint">
          <span>Identity Services</span>
          <span className="hidden h-1 w-1 rounded-full bg-border-strong sm:block" />
          <span>Recruitment</span>
          <span className="hidden h-1 w-1 rounded-full bg-border-strong sm:block" />
          <span>© AWS LPU</span>
        </div>
      </div>
    </footer>
  );
}
