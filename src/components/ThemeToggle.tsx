function ThemeToggle({ theme, onToggle }) {
  const isLightTheme = theme === 'light'

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isLightTheme ? 'Switch to dark mode' : 'Switch to light mode'}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${
        isLightTheme
          ? 'border-[rgba(36,40,31,0.12)] bg-[rgba(93,111,63,0.08)] text-[#3b4230] hover:border-[rgba(36,40,31,0.18)] hover:bg-[rgba(93,111,63,0.12)] hover:text-[#24281f]'
          : 'border-white/10 bg-white/[0.04] text-[#93a66b] hover:border-white/16 hover:bg-white/[0.07] hover:text-[#93a66b]'
      }`}
    >
      {isLightTheme ? (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.15rem] w-[1.15rem] fill-[#93a66b]">
          <path d="m12 1.75 1.1 2.9h-2.2L12 1.75Zm0 17.6 1.1 2.9h-2.2l1.1-2.9Zm10.25-7.35-2.9 1.1v-2.2l2.9 1.1Zm-17.6 0 2.9-1.1v2.2l-2.9-1.1Zm13.44-6.1 2.54-.79-.8 2.53-2.05.3.31-2.04Zm-12.18 0 .31 2.04-2.05-.3-.8-2.53 2.54.79Zm12.18 12.2-.31-2.04 2.05.3.8 2.53-2.54-.79Zm-12.18 0 2.54.79-2.54.79-.8-2.53 2.05-.3.31 2.04ZM12 7.15A4.85 4.85 0 1 1 7.15 12 4.86 4.86 0 0 1 12 7.15Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1rem] w-[1rem] fill-[#93a66b]">
          <path d="M4.2 12.4a8.9 8.9 0 0 0 16.78 3.82 7.5 7.5 0 0 1-7.1-4.92 7.5 7.5 0 0 1 1.3-8.54A9 9 0 0 0 4.2 12.4Z" />
        </svg>
      )}
    </button>
  )
}

export default ThemeToggle
