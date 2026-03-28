function Sidebar({ sections, socials, activeSection, onSectionChange }) {
  return (
    <aside className="relative z-20 flex h-full flex-col justify-between overflow-hidden border-r border-white/8 bg-[#131821] px-8 pt-8 pb-12 shadow-[inset_-1px_0_0_rgba(255,255,255,0.04)]">
      <div className="relative space-y-8">
        <div className="-mx-8 flex items-center gap-4 bg-white/[0.04] px-8 py-4">
          <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-white/[0.04] text-slate-300">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-9 w-9 fill-current">
              <path d="M12 12a4.25 4.25 0 1 0 0-8.5A4.25 4.25 0 0 0 12 12Zm0 2.25c-4.15 0-7.5 2.35-7.5 5.25 0 .55.45 1 1 1h13c.55 0 1-.45 1-1 0-2.9-3.35-5.25-7.5-5.25Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-[-0.04em] text-white">Mark Macaraig</h1>
            <p className="mt-2 text-[0.65rem] uppercase tracking-[0.35em] text-slate-400">
              Frontend Developer
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="max-w-[42ch] pr-2 text-sm leading-6 text-slate-300">
            Frontend-focused creator crafting simple, refined, and modern digital experiences.
          </p>
          <div className="inline-flex rounded-full border border-sky-300/20 bg-white/[0.04] px-3 py-1 text-[0.68rem] uppercase tracking-[0.3em] text-slate-300">
            Available for updates
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[0.62rem] uppercase tracking-[0.3em] text-slate-500">Social Links</p>
          <div className="flex items-center gap-3">
            {socials.map((social) => (
              <a
                key={social.id}
                href={social.href}
                aria-label={social.label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.04] text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <nav className="space-y-2">
          {sections.map((section, index) => {
            const isActive = section.id === activeSection

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onSectionChange(section.id)}
                className={`-mx-8 flex w-[calc(100%+4rem)] items-center justify-between px-8 py-3 text-left transition ${
                  isActive
                    ? 'bg-white/[0.06] text-white'
                    : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-200'
                }`}
              >
                <span>
                  <span className="block text-[0.62rem] uppercase tracking-[0.3em] text-slate-500">
                    0{index + 1}
                  </span>
                  <span className="mt-1 block text-sm font-medium tracking-[0.01em]">
                    {section.label}
                  </span>
                </span>
                <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-cyan-200' : 'bg-slate-600'}`} />
              </button>
            )
          })}
        </nav>
      </div>

      <footer className="relative space-y-3 pb-1 text-sm text-slate-400">
        <p className="leading-6 text-slate-400">2026 Mark Macaraig</p>
        <p className="max-w-[26ch] leading-6 text-slate-500">Frontend Developer based in the Philippines</p>
      </footer>
    </aside>
  )
}

export default Sidebar
