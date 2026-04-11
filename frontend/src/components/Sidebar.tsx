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

const manilaTimeFormatter = new Intl.DateTimeFormat('en-PH', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: 'Asia/Manila',
})

const sidebarIntroCopy = 'Frontend-focused creator crafting simple, refined, and modern digital experiences.'

function Sidebar({ sections, socials, activeSection, onSectionChange, onToggleTheme, theme }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuVisible, setMenuVisible] = useState(false)
  const [currentTime, setCurrentTime] = useState(() =>
    manilaTimeFormatter.format(new Date()),
  )
  const menuRef = useRef(null)
  const sidebarShellRef = useRef(null)
  const menuPanelRef = useRef(null)
  const menuItemRefs = useRef([])
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
    const updateTime = () => {
      setCurrentTime(manilaTimeFormatter.format(new Date()))
    }

    const intervalId = window.setInterval(updateTime, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const shell = sidebarShellRef.current

    if (!shell) {
      return undefined
    }

    const nodes = shell.querySelectorAll('[data-sidebar-entrance]')

    if (!nodes.length) {
      return undefined
    }

    const timeline = gsap.timeline({
      defaults: {
        ease: 'power4.out',
      },
    })

    timeline.fromTo(shell, {
      autoAlpha: 0,
      x: -42,
      scale: 0.97,
    }, {
      autoAlpha: 1,
      x: 0,
      scale: 1,
      duration: 0.62,
    })

    timeline.fromTo(nodes, {
      autoAlpha: 0,
      x: -18,
      y: 24,
    }, {
      autoAlpha: 1,
      x: 0,
      y: 0,
      duration: 0.58,
      stagger: 0.1,
    }, '-=0.38')

    return () => {
      timeline.kill()
      gsap.killTweensOf([shell, ...nodes])
    }
  }, [])

  useEffect(() => {
    const panel = menuPanelRef.current
    const items = menuItemRefs.current.filter(Boolean)

    if (menuOpen) {
      setMenuVisible(true)
      return undefined
    }

    if (!menuVisible || !panel) {
      return undefined
    }

    const timeline = gsap.timeline({
      defaults: {
        ease: 'power2.inOut',
      },
      onComplete: () => {
        setMenuVisible(false)
      },
    })

    if (items.length) {
      timeline.to(items, {
        autoAlpha: 0,
        y: 0,
        duration: 0.14,
        stagger: 0,
      }, 0)
    }

    timeline.to(panel, {
      autoAlpha: 0,
      scaleY: 0.72,
      transformOrigin: 'top center',
      duration: 0.2,
    }, 0)

    return () => {
      timeline.kill()
      gsap.killTweensOf([panel, ...items])
    }
  }, [menuOpen, menuVisible])

  useEffect(() => {
    const panel = menuPanelRef.current
    const items = menuItemRefs.current.filter(Boolean)

    if (!menuOpen || !menuVisible || !panel) {
      return undefined
    }

    const timeline = gsap.timeline({
      defaults: {
        ease: 'cubic.out',
      },
    })

    timeline.fromTo(panel, {
      autoAlpha: 0,
      y: 0,
      scaleY: 0.72,
      transformOrigin: 'top center',
    }, {
      autoAlpha: 1,
      y: 0,
      scaleY: 1,
      duration: 0.32,
    }, 0)

    if (items.length) {
      timeline.fromTo(items, {
        autoAlpha: 0,
        y: 8,
      }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.22,
        stagger: 0,
      }, 0)
    }

    return () => {
      timeline.kill()
      gsap.killTweensOf([panel, ...items])
    }
  }, [menuOpen, menuVisible])

  const handleSocialClick = (event, socialId) => {
    if (socialId !== 'gmail') {
      return
    }

    event.preventDefault()
    onSectionChange('contact')
  }

  return (
    <aside ref={sidebarShellRef} className={`relative z-20 flex min-w-0 flex-col justify-between px-5 pt-5 pb-6 sm:px-6 sm:pt-6 lg:h-full lg:px-8 lg:pt-8 lg:pb-12 ${
      isLightTheme
        ? 'border-b border-[rgba(36,40,31,0.08)] bg-[rgba(255,255,255,0.72)] shadow-[0_0_0_1px_rgba(255,255,255,0.18)] backdrop-blur-xl lg:border-r lg:border-b-0'
        : 'bg-[#0d0f11]'
    }`}>
      <div className="relative space-y-6 lg:space-y-6">
        <div data-sidebar-entrance className="relative z-50 w-full">
          <div ref={menuRef} className={`relative -mx-5 flex items-start gap-3 px-5 py-4 sm:-mx-6 sm:gap-4 sm:px-6 lg:-mx-8 lg:px-8 w-[calc(100%+2.5rem)] sm:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)] ${
            isLightTheme ? 'bg-[rgba(93,111,63,0.08)]' : 'bg-white/[0.04]'
          }`}>
          <div className="relative flex h-[3.15rem] w-[3.15rem] shrink-0 items-center justify-center sm:h-[3.45rem] sm:w-[3.45rem]">
            <div
              className={`relative flex h-[3.15rem] w-[3.15rem] items-center justify-center rounded-full sm:h-[3.45rem] sm:w-[3.45rem] ${
                isLightTheme ? 'bg-[rgba(93,111,63,0.08)] text-[#3b4230]' : 'bg-white/[0.04] text-white/72'
              }`}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current sm:h-7 sm:w-7">
                <path d="M12 12a4.25 4.25 0 1 0 0-8.5A4.25 4.25 0 0 0 12 12Zm0 2.25c-4.15 0-7.5 2.35-7.5 5.25 0 .55.45 1 1 1h13c.55 0 1-.45 1-1 0-2.9-3.35-5.25-7.5-5.25Z" />
              </svg>
            </div>
          </div>
            <div className="flex min-w-0 flex-1 items-start justify-between gap-2 sm:gap-3">
              <div className="min-w-0 flex-1 pr-1">
                <h1 className={`max-w-full text-[clamp(1rem,0.94rem+0.32vw,1.3rem)] font-semibold leading-tight tracking-[-0.04em] break-words ${
                  isLightTheme ? 'text-[#24281f]' : 'text-white'
                }`}>Mark Macaraig</h1>
                <p className="mt-1.5 text-[0.48rem] leading-relaxed uppercase tracking-[0.18em] text-[#93a66b] sm:mt-2 sm:text-[0.52rem] sm:tracking-[0.22em]">
                  Frontend Developer
                </p>
              </div>
              <div className="shrink-0 self-center pt-1 sm:pt-1.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-label="Open quick actions"
                    aria-expanded={menuOpen}
                    className={`inline-flex h-8 w-8 items-center justify-center border text-[0.95rem] transition sm:h-[2.1rem] sm:w-[2.1rem] ${
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

                {menuVisible ? (
                  <div ref={menuPanelRef} className={`absolute top-full left-0 right-0 z-50 p-1.5 ${
                    isLightTheme ? 'bg-[#edf1e3]' : 'bg-[#171a1d]'
                  }`}>
                    <div className="grid grid-cols-1 gap-1 lg:hidden">
                      {sections.map((section, index) => {
                        const isActive = section.id === activeSection

                        return (
                          <button
                            key={section.id}
                            ref={(node) => {
                              menuItemRefs.current[index] = node
                            }}
                            type="button"
                            onClick={() => {
                              onSectionChange(section.id)
                              setMenuOpen(false)
                            }}
                            className={`nav-link-hover relative flex min-w-0 items-center justify-between overflow-hidden px-3 py-2 text-left text-[0.82rem] transition-colors duration-300 ${
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
                              <span className="block text-[0.82rem] font-medium tracking-[0.01em]">
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
                      ref={(node) => {
                        menuItemRefs.current[sections.length] = node
                      }}
                      href="/docs/Dev.pdf"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 text-[0.82rem] transition ${
                        isLightTheme
                          ? 'text-[#3b4230] hover:bg-[rgba(93,111,63,0.08)] hover:text-[#24281f]'
                          : 'text-white/82 hover:bg-white/[0.05] hover:text-white'
                      }`}
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

        <div data-sidebar-entrance className="relative z-0 space-y-4 pt-4 lg:hidden">
          <p className={`max-w-[42ch] text-[0.9rem] leading-6 ${
            isLightTheme ? 'text-[#3b4230]' : 'text-white/72'
          }`}>
            {sidebarIntroCopy}
          </p>
          <p className={`text-[0.56rem] uppercase tracking-[0.24em] ${
            isLightTheme ? 'text-[#5e6550]' : 'text-white/34'
          }`}>
            Available for updates
          </p>
          <p className={`text-[0.56rem] uppercase tracking-[0.24em] ${
            isLightTheme ? 'text-[#5e6550]' : 'text-white/34'
          }`}>
            Social Links
          </p>
          <div className="w-full">
            <div className="flex w-full items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    aria-label={social.label}
                    onClick={(event) => handleSocialClick(event, social.id)}
                    className={`transition ${
                      isLightTheme
                        ? 'text-[#4e5641] hover:text-[#24281f]'
                        : 'text-white/72 hover:text-white'
                    }`}
                  >
                    <span className="flex h-4 w-4 items-center justify-center">
                      {social.icon}
                    </span>
                  </a>
                ))}
              </div>
              <span className={`shrink-0 font-dm-mono text-[0.55rem] uppercase tracking-[0.16em] ${
                isLightTheme ? 'text-[#5e6550]' : 'text-white/34'
              }`}>
                {currentTime}
              </span>
            </div>
          </div>
        </div>

        <div data-sidebar-entrance className="relative z-0 hidden space-y-4 lg:block">
          <p className={`max-w-[42ch] pr-2 text-[0.9rem] leading-6 ${
            isLightTheme ? 'text-[#3b4230]' : 'text-white/72'
          }`}>
            {sidebarIntroCopy}
          </p>
          <div className={`inline-flex rounded-full border px-2.5 py-0.5 text-[0.52rem] uppercase tracking-[0.22em] ${
            isLightTheme
              ? 'border-[rgba(36,40,31,0.12)] bg-[rgba(93,111,63,0.08)] text-[#4e5641]'
              : 'border-white/10 bg-white/[0.04] text-white/70'
          }`}>
            Available for updates
          </div>
        </div>

        <div className="hidden space-y-3 lg:block">
          <p className={`text-[0.56rem] uppercase tracking-[0.24em] ${
            isLightTheme ? 'text-[#5e6550]' : 'text-white/34'
          }`}>Social Links</p>
          <div className="flex items-center gap-2.5">
            {socials.map((social) => (
              <a
                key={social.id}
                href={social.href}
                aria-label={social.label}
                onClick={(event) => handleSocialClick(event, social.id)}
                className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
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

        <nav data-sidebar-entrance className="relative z-0 hidden lg:block lg:space-y-2">
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
                  <span className="block text-[0.82rem] font-medium tracking-[0.01em]">
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

      <footer data-sidebar-entrance className={`relative z-0 mt-6 hidden space-y-1.5 pb-1 text-[0.78rem] lg:block lg:mt-0 lg:space-y-2 ${
        isLightTheme ? 'text-[#4e5641]' : 'text-white/58'
      }`}>
        <p className={`leading-5 ${isLightTheme ? 'text-[#4e5641]' : 'text-white/58'}`}>2026 Mark Macaraig</p>
        <p className={`max-w-[26ch] text-[0.72rem] leading-5 ${isLightTheme ? 'text-[#6b735d]' : 'text-white/34'}`}>Frontend Developer based in the Philippines</p>
      </footer>
    </aside>
  )
}

export default Sidebar
