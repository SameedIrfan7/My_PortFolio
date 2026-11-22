export default function CinematicTransition({
  sectionNum = "02",
  title = "Experience & Architecture",
  tickerText = "Application Ops // Claude Certified Architect // PySpark // 95% Automation // Distributed Systems",
}) {
  return (
    <section className="relative isolate overflow-hidden border-y border-white/[0.08] bg-[#141414] py-12 sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-[#E10600]/[0.06] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        <div className="flex items-end justify-between gap-6">
          <div className="w-full min-w-0 max-w-4xl">
            <p className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.22em] text-[#E10600]">
              <span className="h-px w-8 bg-[#E10600]" />
              Chapter {sectionNum}
            </p>
            <h2 className="mt-4 break-words font-space text-2xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              {title}
            </h2>
          </div>
          <span className="hidden shrink-0 items-center gap-2 pb-1 text-[11px] font-mono uppercase tracking-[0.18em] text-zinc-500 sm:flex">
            Keep scrolling
            <span aria-hidden="true" className="text-[#E10600]">↓</span>
          </span>
        </div>

        <div className="mt-8 overflow-hidden border-y border-white/[0.08] py-3">
          <div className="animate-marquee flex w-max items-center">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                aria-hidden={copy === 1}
                className="flex shrink-0 items-center gap-8 pr-8 text-[11px] font-mono uppercase tracking-[0.16em] text-zinc-400 sm:text-xs"
              >
                {tickerText.split("//").map((item, index) => (
                  <span key={`${copy}-${index}`} className="flex items-center gap-8">
                    {item.trim()}
                    <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#E10600]" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
