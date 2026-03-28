function SectionFooterCards() {
  return (
    <div className="grid grid-cols-[1.25fr_0.75fr] gap-8 pt-8">
      <div className="rounded-[1.5rem] bg-white/[0.03] px-6 py-5">
        <p className="text-[0.68rem] uppercase tracking-[0.3em] text-slate-500">Layout Note</p>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          The page is intentionally fixed and non-scrolling, with clear divider lines and simple
          panel backgrounds so the structure is easy to review before we add more content.
        </p>
      </div>

      <div className="rounded-[1.5rem] bg-cyan-300/10 px-6 py-5">
        <p className="text-[0.68rem] uppercase tracking-[0.3em] text-cyan-100/70">Next</p>
        <p className="mt-3 text-sm leading-7 text-cyan-50">
          We can swap in your real name, image, skills, and project entries next without changing
          the overall design.
        </p>
      </div>
    </div>
  )
}

export default SectionFooterCards
