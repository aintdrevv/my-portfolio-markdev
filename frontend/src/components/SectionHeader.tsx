import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'

const manilaTimeFormatter = new Intl.DateTimeFormat('en-PH', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: 'Asia/Manila',
})

const scrambleGlyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

function SectionHeader({ eyebrow, title, ghostWord, accentText, theme }) {
  const [currentTime, setCurrentTime] = useState(() =>
    manilaTimeFormatter.format(new Date()),
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
    const updateTime = () => {
      setCurrentTime(manilaTimeFormatter.format(new Date()))
    }

    const intervalId = window.setInterval(updateTime, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
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

            return scrambleGlyphs[Math.floor(Math.random() * scrambleGlyphs.length)]
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
    <div className="relative px-1 py-1 pb-4 lg:py-2 lg:pb-5">
      <div className="min-h-[3.75rem]">
        <div className="flex min-h-[3.75rem] items-start justify-between gap-6">
          <div className="flex items-center gap-3">
            <p className={`font-dm-mono text-[9px] uppercase tracking-[0.24em] ${
              isLightTheme ? 'text-[#5f6850]' : 'text-white/30'
            }`}>
              {eyebrow}
            </p>
            <span className={`h-px w-10 ${isLightTheme ? 'bg-[#7f886f]' : 'bg-white/30'}`} />
          </div>

          <div className="hidden shrink-0 items-center gap-4 lg:flex">
            <div className={`font-dm-mono text-[9px] uppercase tracking-[0.2em] ${
              isLightTheme ? 'text-[#5f6850]' : 'text-white/34'
            }`}>
              {currentTime} GMT+8
            </div>
            <div className="text-[#93a66b] text-[0.68rem] uppercase tracking-[0.2em]">
              Portfolio
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 min-h-[6.2rem] max-w-4xl lg:mt-4">
        <div className="flex flex-col gap-1">
          <p
            aria-hidden="true"
            className={`font-bebas pointer-events-none select-none text-[28px] leading-[0.9] uppercase tracking-[0.07em] sm:text-[34px] md:text-[42px] lg:text-[50px] ${
              isLightTheme ? 'text-[#93a66b]/16' : 'text-white/[0.08]'
            }`}
          >
            {displayGhostWord}
          </p>
          <h2 className={`font-space-grotesk relative z-10 max-w-[18ch] text-[17px] leading-[1.08] font-medium tracking-[-0.035em] sm:text-[19px] md:text-[22px] lg:text-[24px] ${
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
