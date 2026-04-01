import ThemeToggle from './ThemeToggle'

function RightRail({ theme, onToggleTheme, onExitToWelcome }) {
  const isLightTheme = theme === 'light'

  return (
    <aside className={`relative z-20 hidden h-full flex-col items-center pt-12 pb-8 lg:flex ${
      isLightTheme
        ? 'border-l border-[rgba(36,40,31,0.08)] bg-[rgba(255,255,255,0.72)] shadow-[0_0_0_1px_rgba(255,255,255,0.18)] backdrop-blur-xl'
        : 'bg-[#0d0f11]'
    }`}>
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      <div className="mt-auto flex translate-y-[-1.25rem] flex-col items-center gap-3">
        <button
          type="button"
          onClick={onExitToWelcome}
          aria-label="Back to welcome page"
          className={`group relative inline-flex h-9 w-9 items-center justify-center transition ${
            isLightTheme
              ? 'text-[#5e6550] hover:text-[#24281f]'
              : 'text-white/42 hover:text-white/78'
          }`}
        >
          <span
            className={`pointer-events-none absolute left-1/2 bottom-full mb-3 -translate-x-1/2 whitespace-nowrap rounded-md border px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] opacity-0 transition duration-200 group-hover:opacity-100 ${
              isLightTheme
                ? 'border-[rgba(36,40,31,0.12)] bg-white text-[#5e6550]'
                : 'border-white/10 bg-[#171a1d] text-white/72'
            }`}
          >
            Exit
            <span
              className={`absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-r border-b ${
                isLightTheme
                  ? 'border-[rgba(36,40,31,0.12)] bg-white'
                  : 'border-white/10 bg-[#171a1d]'
              }`}
            />
          </span>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.75rem] w-[1.75rem] stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 4.75h7.25A1.75 1.75 0 0 1 19 6.5v11a1.75 1.75 0 0 1-1.75 1.75H10" />
            <path d="M13 12H5.25" />
            <path d="m8.5 8.75-3.25 3.25 3.25 3.25" />
          </svg>
        </button>
      </div>
    </aside>
  )
}

export default RightRail
