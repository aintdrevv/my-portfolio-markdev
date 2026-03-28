import ThemeToggle from './ThemeToggle'

function RightRail({ theme, onToggleTheme }) {
  const isLightTheme = theme === 'light'

  return (
    <aside className={`relative z-20 hidden h-full flex-col items-center pt-12 pb-8 lg:flex ${
      isLightTheme
        ? 'border-l border-[rgba(36,40,31,0.08)] bg-[rgba(255,255,255,0.72)] shadow-[0_0_0_1px_rgba(255,255,255,0.18)] backdrop-blur-xl'
        : 'bg-[#0d0f11]'
    }`}>
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </aside>
  )
}

export default RightRail
