import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'

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
  const [displayGhostWord, setDisplayGhostWord] = useState(ghostWord)
  const scrambleFrameRef = useRef(null)
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

  useEffect(() => {
    const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const state = { progress: 0 }

    if (scrambleFrameRef.current) {
      scrambleFrameRef.current.kill()
    }

    scrambleFrameRef.current = gsap.to(state, {
      progress: ghostWord.length,
      duration: 1.18,
      ease: 'power2.out',
      onUpdate: () => {
        const revealCount = Math.floor(state.progress)
        const nextWord = ghostWord
          .split('')
          .map((char, index) => {
            if (char === ' ') {
              return ' '
            }

            if (index < revealCount) {
              return ghostWord[index]
            }

            return glyphs[Math.floor(Math.random() * glyphs.length)]
          })
          .join('')

        setDisplayGhostWord(nextWord)
      },
      onComplete: () => {
        setDisplayGhostWord(ghostWord)
      },
    })

    return () => {
      if (scrambleFrameRef.current) {
        scrambleFrameRef.current.kill()
      }
    }
  }, [ghostWord])

  return (
    <div className="relative px-1 py-1 pb-6 lg:py-2 lg:pb-8">
      <div className="flex min-h-[4.5rem] items-start justify-between gap-6">
        <div className="flex items-center gap-3">
          <p className={`font-dm-mono text-[10px] uppercase tracking-[0.28em] ${
            isLightTheme ? 'text-[#5f6850]' : 'text-white/30'
          }`}>
            {eyebrow}
          </p>
          <span className={`h-px w-10 ${isLightTheme ? 'bg-[#7f886f]' : 'bg-white/30'}`} />
        </div>

        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          <div className={`font-dm-mono text-[10px] uppercase tracking-[0.24em] ${
            isLightTheme ? 'text-[#5f6850]' : 'text-white/34'
          }`}>
            {currentTime} GMT+8
          </div>
          <div className="text-[#93a66b] text-xs uppercase tracking-[0.26em]">
            Portfolio
          </div>
        </div>
      </div>

      <div className="mt-6 max-w-4xl lg:mt-6">
        <div className="flex flex-col gap-2">
          <p
            aria-hidden="true"
            className={`font-bebas pointer-events-none select-none text-[38px] leading-[0.9] uppercase tracking-[0.08em] sm:text-[46px] md:text-[56px] lg:text-[68px] ${
              isLightTheme ? 'text-[#93a66b]/16' : 'text-white/[0.08]'
            }`}
          >
            {displayGhostWord}
          </p>
          <h2 className={`font-space-grotesk relative z-10 max-w-[18ch] text-[22px] leading-[1.05] font-medium tracking-[-0.04em] sm:text-[24px] md:text-[28px] lg:text-[30px] ${
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
    </div>
  )
}

export default SectionHeader
