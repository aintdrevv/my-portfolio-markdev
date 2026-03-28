import { useEffect, useState } from 'react'

function SectionHeader({ eyebrow, title, ghostWord, accentText, theme }) {
  const [currentTime, setCurrentTime] = useState(() =>
    new Intl.DateTimeFormat('en-PH', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Manila',
    }).format(new Date()),
  )
  const accentIndex = accentText ? title.toLowerCase().indexOf(accentText.toLowerCase()) : -1
  const beforeAccent = accentIndex >= 0 ? title.slice(0, accentIndex) : title
  const highlightedAccent =
    accentIndex >= 0 ? title.slice(accentIndex, accentIndex + accentText.length) : ''
  const afterAccent = accentIndex >= 0 ? title.slice(accentIndex + accentText.length) : ''
  const isLightTheme = theme === 'light'

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-PH', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Manila',
    })

    const updateTime = () => {
      setCurrentTime(formatter.format(new Date()))
    }

    const intervalId = window.setInterval(updateTime, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <div className="relative px-1 py-2 pb-8">
      <div className="flex items-start justify-between gap-6">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3">
            <p className={`font-dm-mono text-[10px] uppercase tracking-[0.28em] ${
              isLightTheme ? 'text-[#5f6850]' : 'text-white/30'
            }`}>
              {eyebrow}
            </p>
            <span className={`h-px w-10 ${isLightTheme ? 'bg-[#7f886f]' : 'bg-white/30'}`} />
          </div>

          <div className="relative mt-5">
            <p
              aria-hidden="true"
              className={`font-bebas pointer-events-none select-none text-[72px] leading-none uppercase tracking-[0.08em] sm:text-[80px] md:text-[88px] ${
                isLightTheme ? 'text-[#93a66b]/10' : 'text-white/[0.055]'
              }`}
            >
              {ghostWord}
            </p>
            <h2 className={`font-space-grotesk relative z-10 -mt-4 max-w-[18ch] text-[26px] leading-[1.05] font-medium tracking-[-0.04em] sm:text-[28px] md:text-[30px] ${
              isLightTheme ? 'text-[#24281f]' : 'text-white/88'
            }`}>
              {accentIndex >= 0 ? (
                <>
                  {beforeAccent}
                  <span className="text-[#93a66b]">
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

        <div className="flex shrink-0 items-center gap-3">
          <div className={`font-dm-mono text-[10px] uppercase tracking-[0.24em] ${
            isLightTheme ? 'text-[#5f6850]' : 'text-white/34'
          }`}>
            {currentTime} GMT+8
          </div>
          <div className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.26em] ${
            isLightTheme ? 'bg-[rgba(93,111,63,0.08)] text-[#93a66b]' : 'bg-white/[0.05] text-[#93a66b]'
          }`}>
            Portfolio
          </div>
        </div>
      </div>
    </div>
  )
}

export default SectionHeader
