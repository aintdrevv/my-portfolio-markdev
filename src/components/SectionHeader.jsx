function SectionHeader({ eyebrow, title, ghostWord, accentText }) {
  const accentIndex = accentText ? title.toLowerCase().indexOf(accentText.toLowerCase()) : -1
  const beforeAccent = accentIndex >= 0 ? title.slice(0, accentIndex) : title
  const highlightedAccent =
    accentIndex >= 0 ? title.slice(accentIndex, accentIndex + accentText.length) : ''
  const afterAccent = accentIndex >= 0 ? title.slice(accentIndex + accentText.length) : ''

  return (
    <div className="px-1 py-2 pb-8">
      <div className="flex items-start justify-between gap-6">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3">
            <p className="font-dm-mono text-[10px] uppercase tracking-[0.28em] text-white/30">
              {eyebrow}
            </p>
            <span className="h-px w-10 bg-white/30" />
          </div>

          <div className="relative mt-5">
            <p
              aria-hidden="true"
              className="font-bebas pointer-events-none select-none text-[72px] leading-none uppercase tracking-[0.08em] text-white/[0.055] sm:text-[80px] md:text-[88px]"
            >
              {ghostWord}
            </p>
            <h2 className="font-space-grotesk relative z-10 -mt-4 max-w-[18ch] text-[26px] leading-[1.05] font-medium tracking-[-0.04em] text-white/88 sm:text-[28px] md:text-[30px]">
              {accentIndex >= 0 ? (
                <>
                  {beforeAccent}
                  <span
                    className="bg-[linear-gradient(135deg,#10B981_0%,#3B82F6_55%,#8B5CF6_100%)] bg-clip-text text-transparent"
                    style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                  >
                    {highlightedAccent}
                  </span>
                  {afterAccent}
                </>
              ) : (
                title
              )}
            </h2>
          </div>
        </div>

        <div className="shrink-0 rounded-full bg-white/[0.05] px-4 py-2 text-xs uppercase tracking-[0.26em] text-slate-300">
          Portfolio
        </div>
      </div>
    </div>
  )
}

export default SectionHeader
