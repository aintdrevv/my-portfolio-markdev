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
          className={`inline-flex h-9 w-9 items-center justify-center transition ${
            isLightTheme
              ? 'text-[#5e6550] hover:text-[#24281f]'
              : 'text-white/42 hover:text-white/78'
          }`}
        >
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
