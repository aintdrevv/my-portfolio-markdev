function ThemeToggle({ theme, onToggle }) {
  const isLightTheme = theme === 'light'

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isLightTheme ? 'Switch to dark mode' : 'Switch to light mode'}
      className={`inline-flex h-8 w-8 items-center justify-center transition ${
        isLightTheme
          ? 'text-[#93a66b] hover:text-[#7f8f5c]'
          : 'text-[#93a66b] hover:text-[#c8d5a8]'
      }`}
    >
      {isLightTheme ? (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[0.95rem] w-[0.95rem] fill-[#93a66b]">
          <path d="m12 1.75 1.1 2.9h-2.2L12 1.75Zm0 17.6 1.1 2.9h-2.2l1.1-2.9Zm10.25-7.35-2.9 1.1v-2.2l2.9 1.1Zm-17.6 0 2.9-1.1v2.2l-2.9-1.1Zm13.44-6.1 2.54-.79-.8 2.53-2.05.3.31-2.04Zm-12.18 0 .31 2.04-2.05-.3-.8-2.53 2.54.79Zm12.18 12.2-.31-2.04 2.05.3.8 2.53-2.54-.79Zm-12.18 0 2.54.79-2.54.79-.8-2.53 2.05-.3.31 2.04ZM12 7.15A4.85 4.85 0 1 1 7.15 12 4.86 4.86 0 0 1 12 7.15Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[0.9rem] w-[0.9rem] fill-[#93a66b]">
          <path d="M4.2 12.4a8.9 8.9 0 0 0 16.78 3.82 7.5 7.5 0 0 1-7.1-4.92 7.5 7.5 0 0 1 1.3-8.54A9 9 0 0 0 4.2 12.4Z" />
        </svg>
      )}
    </button>
  )
}

export default ThemeToggle
