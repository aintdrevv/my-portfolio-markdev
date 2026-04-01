import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import ThemeToggle from './ThemeToggle'

const sectionIcons = {
  overview: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.05rem] w-[1.05rem] fill-current">
      <path d="M4 5.75A1.75 1.75 0 0 1 5.75 4h12.5A1.75 1.75 0 0 1 20 5.75v12.5A1.75 1.75 0 0 1 18.25 20H5.75A1.75 1.75 0 0 1 4 18.25V5.75Zm3.25 1.5a.75.75 0 0 0-.75.75v1.5c0 .41.34.75.75.75h9.5a.75.75 0 0 0 .75-.75V8a.75.75 0 0 0-.75-.75h-9.5Zm0 5a.75.75 0 0 0-.75.75v3c0 .41.34.75.75.75h3a.75.75 0 0 0 .75-.75v-3a.75.75 0 0 0-.75-.75h-3Zm6 0a.75.75 0 0 0-.75.75v.5c0 .41.34.75.75.75h3.5a.75.75 0 0 0 .75-.75V13a.75.75 0 0 0-.75-.75h-3.5Zm0 2.5a.75.75 0 0 0-.75.75v.5c0 .41.34.75.75.75h2.5a.75.75 0 0 0 .75-.75v-.5a.75.75 0 0 0-.75-.75h-2.5Z" />
    </svg>
  ),
  skills: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.05rem] w-[1.05rem] fill-current">
      <path d="M10.1 3.38a2.25 2.25 0 0 1 3.8 0l.72 1.22a2.25 2.25 0 0 0 1.37 1.01l1.4.36a2.25 2.25 0 0 1 1.9 2.93l-.45 1.37a2.25 2.25 0 0 0 .2 1.68l.73 1.22a2.25 2.25 0 0 1-.84 3.08l-1.22.72a2.25 2.25 0 0 0-1.01 1.37l-.36 1.4a2.25 2.25 0 0 1-2.93 1.9l-1.37-.45a2.25 2.25 0 0 0-1.68.2l-1.22.73a2.25 2.25 0 0 1-3.08-.84l-.72-1.22a2.25 2.25 0 0 0-1.37-1.01l-1.4-.36a2.25 2.25 0 0 1-1.9-2.93l.45-1.37a2.25 2.25 0 0 0-.2-1.68l-.73-1.22a2.25 2.25 0 0 1 .84-3.08l1.22-.72a2.25 2.25 0 0 0 1.01-1.37l.36-1.4a2.25 2.25 0 0 1 2.93-1.9l1.37.45a2.25 2.25 0 0 0 1.68-.2l1.22-.73ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
    </svg>
  ),
  projects: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.05rem] w-[1.05rem] fill-current">
      <path d="M4 6.25A2.25 2.25 0 0 1 6.25 4h4.19c.6 0 1.17.24 1.6.66l.9.9c.14.14.33.22.53.22h4.28A2.25 2.25 0 0 1 20 8.03v9.72A2.25 2.25 0 0 1 17.75 20H6.25A2.25 2.25 0 0 1 4 17.75V6.25Zm3 4a.75.75 0 0 0 0 1.5h10a.75.75 0 0 0 0-1.5H7Zm0 3.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5H7Z" />
    </svg>
  ),
  contact: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.05rem] w-[1.05rem] fill-current">
      <path d="M3 6.75A2.75 2.75 0 0 1 5.75 4h12.5A2.75 2.75 0 0 1 21 6.75v10.5A2.75 2.75 0 0 1 18.25 20H5.75A2.75 2.75 0 0 1 3 17.25V6.75Zm2.37-.33 5.97 4.63a1.1 1.1 0 0 0 1.32 0l5.97-4.63a1.25 1.25 0 0 0-.38-.05H5.75c-.13 0-.26.02-.38.05Zm14.13 1.89-5.6 4.34a2.6 2.6 0 0 1-3.18 0L5.12 8.3a.75.75 0 0 0-.12.42v8.53c0 .69.56 1.25 1.25 1.25h11.5c.69 0 1.25-.56 1.25-1.25V8.72a.75.75 0 0 0-.12-.41Z" />
    </svg>
  ),
}

function Sidebar({ sections, socials, activeSection, onSectionChange, onToggleTheme, theme }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(() =>
    new Intl.DateTimeFormat('en-PH', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Manila',
    }).format(new Date()),
  )
  const menuRef = useRef(null)
  const avatarWrapRef = useRef(null)
  const avatarRingRef = useRef(null)
  const avatarInnerRef = useRef(null)
  const isLightTheme = theme === 'light'

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)

    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [])

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
    const ring = avatarRingRef.current
    const wrap = avatarWrapRef.current
    const inner = avatarInnerRef.current

    if (!ring || !wrap || !inner) {
      return undefined
    }

    const ringLength = ring.getTotalLength()
    const baseColor = isLightTheme ? '#7f8f5c' : '#93a66b'
    const hoverColor = isLightTheme ? '#5f6850' : '#c7d7a6'

    gsap.set(ring, {
      strokeDasharray: ringLength,
      strokeDashoffset: ringLength,
      stroke: baseColor,
    })

    gsap.set(wrap, {
      rotate: -110,
      scale: 0.92,
      transformOrigin: '50% 50%',
    })

    gsap.set(inner, {
      scale: 0.96,
      transformOrigin: '50% 50%',
    })

    const intro = gsap.timeline()
    intro.to(wrap, {
      rotate: 0,
      scale: 1,
      duration: 0.9,
      ease: 'power3.out',
    }, 0)
    intro.to(ring, {
      strokeDashoffset: 0,
      duration: 1.1,
      ease: 'power2.out',
    }, 0.05)
    intro.to(inner, {
      scale: 1,
      duration: 0.7,
      ease: 'back.out(1.7)',
    }, 0.08)

    const pulse = gsap.to(inner, {
      scale: 1.035,
      duration: 1.8,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: 0.9,
    })

    const handlePointerEnter = () => {
      gsap.to(ring, {
        stroke: hoverColor,
        duration: 0.24,
        ease: 'power2.out',
      })
      gsap.fromTo(wrap, {
        rotate: 0,
      }, {
        rotate: 90,
        duration: 0.65,
        ease: 'power2.out',
      })
    }

    const handlePointerLeave = () => {
      gsap.to(ring, {
        stroke: baseColor,
        duration: 0.28,
        ease: 'power2.out',
      })
      gsap.to(wrap, {
        rotate: 0,
        duration: 0.45,
        ease: 'power2.out',
      })
    }

    wrap.addEventListener('pointerenter', handlePointerEnter)
    wrap.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      wrap.removeEventListener('pointerenter', handlePointerEnter)
      wrap.removeEventListener('pointerleave', handlePointerLeave)
      intro.kill()
      pulse.kill()
      gsap.killTweensOf([ring, wrap, inner])
    }
  }, [isLightTheme])

  return (
    <aside className={`relative z-20 flex flex-col justify-between px-5 pt-5 pb-6 sm:px-6 sm:pt-6 lg:h-full lg:px-8 lg:pt-8 lg:pb-12 ${
      isLightTheme
        ? 'border-b border-[rgba(36,40,31,0.08)] bg-[rgba(255,255,255,0.72)] shadow-[0_0_0_1px_rgba(255,255,255,0.18)] backdrop-blur-xl lg:border-r lg:border-b-0'
        : 'bg-[#0d0f11]'
    }`}>
      <div className="relative space-y-6 lg:space-y-6">
        <div className="w-full">
          <div ref={menuRef} className={`relative -mx-5 flex items-center gap-4 px-5 py-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 ${
            isLightTheme ? 'bg-[rgba(93,111,63,0.08)]' : 'bg-white/[0.04]'
          }`}>
          <div ref={avatarWrapRef} className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center">
            <svg
              viewBox="0 0 84 84"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            >
              <circle
                ref={avatarRingRef}
                cx="42"
                cy="42"
                r="38"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="4 7"
                opacity="0.95"
              />
            </svg>
            <div
              ref={avatarInnerRef}
              className={`relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full ${
                isLightTheme ? 'bg-[rgba(93,111,63,0.08)] text-[#3b4230]' : 'bg-white/[0.04] text-white/72'
              }`}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-9 w-9 fill-current">
                <path d="M12 12a4.25 4.25 0 1 0 0-8.5A4.25 4.25 0 0 0 12 12Zm0 2.25c-4.15 0-7.5 2.35-7.5 5.25 0 .55.45 1 1 1h13c.55 0 1-.45 1-1 0-2.9-3.35-5.25-7.5-5.25Z" />
              </svg>
            </div>
          </div>
            <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
              <div>
                <h1 className={`text-xl font-semibold tracking-[-0.04em] sm:text-2xl ${
                  isLightTheme ? 'text-[#24281f]' : 'text-white'
                }`}>Mark Macaraig</h1>
                <p className="mt-2 text-[0.65rem] uppercase tracking-[0.35em] text-[#93a66b]">
                  Frontend Developer
                </p>
              </div>
              <div className="shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-label="Open quick actions"
                    aria-expanded={menuOpen}
                    className={`inline-flex h-9 w-9 items-center justify-center border text-base transition ${
                      isLightTheme
                        ? 'border-[rgba(36,40,31,0.12)] bg-[rgba(93,111,63,0.08)] text-[#3b4230] hover:border-[rgba(36,40,31,0.18)] hover:bg-[rgba(93,111,63,0.12)] hover:text-[#24281f]'
                        : 'border-white/10 bg-white/[0.04] text-white/80 hover:border-white/16 hover:bg-white/[0.07] hover:text-white'
                    }`}
                  >
                    <span className="leading-none">+</span>
                  </button>
                  <div className="lg:hidden">
                    <ThemeToggle theme={theme} onToggle={onToggleTheme} />
                  </div>
                </div>

                {menuOpen ? (
                  <div className={`dropdown-panel absolute top-full left-0 right-0 z-30 p-1.5 ${
                    isLightTheme ? 'bg-[#edf1e3]' : 'bg-[#171a1d]'
                  }`}>
                    <div className="grid grid-cols-1 gap-1 lg:hidden">
                      {sections.map((section) => {
                        const isActive = section.id === activeSection

                        return (
                          <button
                            key={section.id}
                            type="button"
                            onClick={() => {
                              onSectionChange(section.id)
                              setMenuOpen(false)
                            }}
                            className={`dropdown-item nav-link-hover relative flex min-w-0 items-center justify-between overflow-hidden px-3 py-2 text-left text-sm transition-colors duration-300 ${
                              isLightTheme
                                ? isActive
                                  ? 'bg-[rgba(93,111,63,0.1)] text-[#24281f]'
                                  : 'text-[#4e5641] hover:text-[#24281f]'
                                : isActive
                                  ? 'bg-white/[0.06] text-white'
                                  : 'text-white/65 hover:text-white/90'
                            }`}
                            style={{ animationDelay: `${110 + (sections.findIndex((item) => item.id === section.id) * 40)}ms` }}
                          >
                            {!isActive ? (
                              <span
                                aria-hidden="true"
                                className={`nav-link-hover-fill absolute inset-0 ${
                                  isLightTheme ? 'light-nav-link-hover-fill' : ''
                                }`}
                              />
                            ) : null}
                            <span className="relative z-10 flex items-center gap-3">
                              <span className={`flex h-5 w-5 items-center justify-center ${
                                isActive ? 'text-[#93a66b]' : isLightTheme ? 'text-[#5e6550]' : 'text-white/50'
                              }`}>
                                {sectionIcons[section.id]}
                              </span>
                              <span className="block text-sm font-medium tracking-[0.01em]">
                                {section.label}
                              </span>
                            </span>
                            <span className={`relative z-10 h-2 w-2 rounded-full ${
                              isActive ? 'bg-[#93a66b]' : isLightTheme ? 'bg-[#7f886f]' : 'bg-white/26'
                            }`} />
                          </button>
                        )
                      })}
                      <div className={`my-1 h-px ${isLightTheme ? 'bg-[rgba(36,40,31,0.08)]' : 'bg-white/8'}`} />
                    </div>
                    <a
                      href="/Dev.pdf"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setMenuOpen(false)}
                      className={`dropdown-item flex items-center justify-between px-3 py-2 text-sm transition ${
                        isLightTheme
                          ? 'text-[#3b4230] hover:bg-[rgba(93,111,63,0.08)] hover:text-[#24281f]'
                          : 'text-white/82 hover:bg-white/[0.05] hover:text-white'
                      }`}
                      style={{ animationDelay: '110ms' }}
                    >
                      <span>Resume</span>
                      <span className={`text-xs uppercase tracking-[0.18em] ${
                        isLightTheme ? 'text-[#5e6550]' : 'text-white/34'
                      }`}>View</span>
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 lg:hidden">
          <p className={`max-w-[42ch] text-sm leading-6 ${
            isLightTheme ? 'text-[#3b4230]' : 'text-white/72'
          }`}>
            Frontend-focused creator crafting simple, refined, and modern digital experiences.
          </p>
          <p className={`text-[0.62rem] uppercase tracking-[0.3em] ${
            isLightTheme ? 'text-[#5e6550]' : 'text-white/34'
          }`}>
            Available for updates
          </p>
          <p className={`text-[0.62rem] uppercase tracking-[0.3em] ${
            isLightTheme ? 'text-[#5e6550]' : 'text-white/34'
          }`}>
            Social Links
          </p>
          <div className="w-full">
            <div className="flex w-full items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    aria-label={social.label}
                    onClick={(event) => {
                      if (social.id !== 'gmail') {
                        return
                      }

                      event.preventDefault()
                      onSectionChange('contact')
                    }}
                    className={`transition ${
                      isLightTheme
                        ? 'text-[#4e5641] hover:text-[#24281f]'
                        : 'text-white/72 hover:text-white'
                    }`}
                  >
                    <span className="flex h-5 w-5 items-center justify-center">
                      {social.icon}
                    </span>
                  </a>
                ))}
              </div>
              <span className={`shrink-0 font-dm-mono text-[0.62rem] uppercase tracking-[0.2em] ${
                isLightTheme ? 'text-[#5e6550]' : 'text-white/34'
              }`}>
                {currentTime}
              </span>
            </div>
          </div>
        </div>

        <div className="hidden space-y-4 lg:block">
          <p className={`max-w-[42ch] pr-2 text-sm leading-6 ${
            isLightTheme ? 'text-[#3b4230]' : 'text-white/72'
          }`}>
            Frontend-focused creator crafting simple, refined, and modern digital experiences.
          </p>
          <div className={`inline-flex rounded-full border px-2.5 py-0.5 text-[0.58rem] uppercase tracking-[0.28em] ${
            isLightTheme
              ? 'border-[rgba(36,40,31,0.12)] bg-[rgba(93,111,63,0.08)] text-[#4e5641]'
              : 'border-white/10 bg-white/[0.04] text-white/70'
          }`}>
            Available for updates
          </div>
        </div>

        <div className="hidden space-y-3 lg:block">
          <p className={`text-[0.62rem] uppercase tracking-[0.3em] ${
            isLightTheme ? 'text-[#5e6550]' : 'text-white/34'
          }`}>Social Links</p>
          <div className="flex items-center gap-3">
            {socials.map((social) => (
              <a
                key={social.id}
                href={social.href}
                aria-label={social.label}
                onClick={(event) => {
                  if (social.id !== 'gmail') {
                    return
                  }

                  event.preventDefault()
                  onSectionChange('contact')
                }}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                  isLightTheme
                    ? 'bg-[rgba(93,111,63,0.08)] text-[#4e5641] hover:bg-[rgba(93,111,63,0.12)] hover:text-[#24281f]'
                    : 'bg-white/[0.04] text-white/72 hover:bg-white/[0.07] hover:text-white'
                }`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className={`hidden lg:block -mx-5 h-px w-[calc(100%+2.5rem)] sm:-mx-6 sm:w-[calc(100%+3rem)] lg:-mx-8 lg:w-[calc(100%+4rem)] ${
          isLightTheme ? 'bg-[rgba(36,40,31,0.08)]' : 'bg-white/8'
        }`} />

        <nav className="hidden lg:block lg:space-y-2">
          {sections.map((section) => {
            const isActive = section.id === activeSection

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onSectionChange(section.id)}
                className={`nav-link-hover relative flex min-w-0 items-center justify-between overflow-hidden px-4 py-3 text-left transition-colors duration-300 lg:-mx-8 lg:w-[calc(100%+4rem)] lg:px-8 ${
                  isLightTheme
                    ? isActive
                      ? 'bg-[rgba(93,111,63,0.1)] text-[#24281f]'
                      : 'text-[#4e5641] hover:text-[#24281f]'
                    : isActive
                      ? 'bg-white/[0.06] text-white'
                      : 'text-white/65 hover:text-white/90'
                }`}
              >
                {!isActive ? (
                  <span
                    aria-hidden="true"
                    className={`nav-link-hover-fill absolute inset-0 ${
                      isLightTheme ? 'light-nav-link-hover-fill' : ''
                    }`}
                  />
                ) : null}
                <span className="relative z-10 flex items-center gap-3">
                  <span className={`flex h-5 w-5 items-center justify-center ${
                    isActive ? 'text-[#93a66b]' : isLightTheme ? 'text-[#5e6550]' : 'text-white/50'
                  }`}>
                    {sectionIcons[section.id]}
                  </span>
                  <span className="block text-sm font-medium tracking-[0.01em]">
                    {section.label}
                  </span>
                </span>
                <span className={`relative z-10 h-2 w-2 rounded-full ${
                  isActive ? 'bg-[#93a66b]' : isLightTheme ? 'bg-[#7f886f]' : 'bg-white/26'
                }`} />
              </button>
            )
          })}
        </nav>
      </div>

      <footer className={`relative mt-6 hidden space-y-2 pb-1 text-sm lg:block lg:mt-0 lg:space-y-3 ${
        isLightTheme ? 'text-[#4e5641]' : 'text-white/58'
      }`}>
        <p className={`leading-6 ${isLightTheme ? 'text-[#4e5641]' : 'text-white/58'}`}>2026 Mark Macaraig</p>
        <p className={`max-w-[26ch] leading-6 ${isLightTheme ? 'text-[#6b735d]' : 'text-white/34'}`}>Frontend Developer based in the Philippines</p>
      </footer>
    </aside>
  )
}

export default Sidebar
