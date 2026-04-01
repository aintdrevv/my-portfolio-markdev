import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'
import SectionHeader from './components/SectionHeader'
import RightRail from './components/RightRail'
import Sidebar from './components/Sidebar'
import WelcomeScreen from './components/WelcomeScreen'
import { sections, socials, toolIcons } from './data/siteContent'
import ContactPage from './pages/ContactPage'
import OverviewPage from './pages/OverviewPage'
import ProjectsPage from './pages/ProjectsPage'
import SkillsPage from './pages/SkillsPage'

const pageComponents = {
  overview: OverviewPage,
  skills: SkillsPage,
  projects: ProjectsPage,
  contact: ContactPage,
}

const sliderCopies = Array.from({ length: 6 }, (_, copy) => copy)
const cursorSymbols = ['+', 'x', 'o', '::', '/']

gsap.registerPlugin(ScrollTrigger)

function App() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [isEnteringPortfolio, setIsEnteringPortfolio] = useState(false)
  const [activeSection, setActiveSection] = useState(sections[0].id)
  const [theme, setTheme] = useState('dark')
  const [isMobile, setIsMobile] = useState(() => (
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  ))
  const [showMobileNavLinks, setShowMobileNavLinks] = useState(true)
  const mobileSectionRefs = useRef({})
  const mobileSectionBodyRefs = useRef({})
  const mobileNavHideTimeoutRef = useRef(null)
  const desktopTransitionRef = useRef(null)
  const cursorSymbolRefs = useRef([])
  const cursorTrailIndexRef = useRef(0)
  const lastTrailPointRef = useRef({ x: 0, y: 0 })
  const previousSectionIndexRef = useRef(0)
  const currentSection = sections.find((section) => section.id === activeSection) ?? sections[0]
  const ActivePage = pageComponents[currentSection.id]
  const isLightTheme = theme === 'light'
  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))

  const handleEnterPortfolio = () => {
    setIsEnteringPortfolio(true)
    window.setTimeout(() => {
      setShowWelcome(false)
      setIsEnteringPortfolio(false)
    }, 520)
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined
    }

    const htmlNode = document.documentElement
    const bodyNode = document.body
    const previousHtmlOverflow = htmlNode.style.overflow
    const previousBodyOverflow = bodyNode.style.overflow

    if (showWelcome) {
      htmlNode.style.overflow = 'hidden'
      bodyNode.style.overflow = 'hidden'
    } else {
      htmlNode.style.overflow = ''
      bodyNode.style.overflow = isMobile ? 'auto' : ''
    }

    return () => {
      htmlNode.style.overflow = previousHtmlOverflow
      bodyNode.style.overflow = previousBodyOverflow
    }
  }, [showWelcome, isMobile])

  useEffect(() => {
    const sectionNodes = sections
      .map((section) => mobileSectionRefs.current[section.id])
      .filter(Boolean)

    if (sectionNodes.length === 0) {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visibleEntries[0]) {
          const activeId = visibleEntries[0].target.getAttribute('data-section-id')

          if (activeId) {
            setActiveSection(activeId)
          }
        }
      },
      {
        threshold: [0.35, 0.55, 0.75],
        rootMargin: '-10% 0px -35% 0px',
      },
    )

    sectionNodes.forEach((node) => observer.observe(node))

    return () => observer.disconnect()
  }, [isMobile])

  useEffect(() => {
    if (!isMobile) {
      return undefined
    }

    const revealNavLinks = () => {
      setShowMobileNavLinks(true)

      if (mobileNavHideTimeoutRef.current) {
        window.clearTimeout(mobileNavHideTimeoutRef.current)
      }

      mobileNavHideTimeoutRef.current = window.setTimeout(() => {
        setShowMobileNavLinks(false)
      }, 1800)
    }

    revealNavLinks()
    window.addEventListener('scroll', revealNavLinks, { passive: true })
    window.addEventListener('touchstart', revealNavLinks, { passive: true })

    return () => {
      window.removeEventListener('scroll', revealNavLinks)
      window.removeEventListener('touchstart', revealNavLinks)

      if (mobileNavHideTimeoutRef.current) {
        window.clearTimeout(mobileNavHideTimeoutRef.current)
      }
    }
  }, [isMobile])

  useEffect(() => {
    if (isMobile || showWelcome || !desktopTransitionRef.current) {
      return undefined
    }

    const currentIndex = sections.findIndex((section) => section.id === activeSection)
    const previousIndex = previousSectionIndexRef.current
    const direction = currentIndex >= previousIndex ? 1 : -1
    previousSectionIndexRef.current = currentIndex

    const ctx = gsap.context(() => {
      gsap.killTweensOf('[data-page-chrome], [data-page-body]')

      gsap.fromTo('[data-page-chrome]', {
        autoAlpha: 0,
        x: 18 * direction,
        y: 12,
        rotate: 0.5 * direction,
      }, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        rotate: 0,
        duration: 0.54,
        ease: 'power4.out',
      })

      gsap.fromTo('[data-page-body]', {
        autoAlpha: 0,
        x: 34 * direction,
        y: 20,
        rotate: 0.75 * direction,
      }, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        rotate: 0,
        duration: 0.7,
        ease: 'power4.out',
        delay: 0.1,
      })
    }, desktopTransitionRef)

    return () => ctx.revert()
  }, [activeSection, isMobile, showWelcome])

  useEffect(() => {
    if (!isMobile || showWelcome) {
      return undefined
    }

    const sectionNodes = sections
      .map((section) => ({
        shell: mobileSectionRefs.current[section.id],
        body: mobileSectionBodyRefs.current[section.id],
      }))
      .filter((entry) => entry.shell && entry.body)

    if (sectionNodes.length === 0) {
      return undefined
    }

    const ctx = gsap.context(() => {
      sectionNodes.forEach(({ shell, body }, index) => {
        gsap.set(body, {
          autoAlpha: index === 0 ? 1 : 0,
          y: index === 0 ? 0 : 34,
        })

        gsap.fromTo(body, {
          autoAlpha: index === 0 ? 0 : 0,
          y: index === 0 ? 18 : 34,
        }, {
          autoAlpha: 1,
          y: 0,
          duration: index === 0 ? 0.52 : 0.62,
          ease: 'power3.out',
          scrollTrigger: index === 0
            ? undefined
            : {
                trigger: shell,
                start: 'top 82%',
                toggleActions: 'play none none none',
                once: true,
              },
        })
      })
    })

    return () => ctx.revert()
  }, [isMobile, showWelcome, theme])

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId)

    if (!isMobile) {
      return
    }

    if (sectionId === 'overview') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const targetNode = mobileSectionRefs.current[sectionId]

    if (targetNode) {
      targetNode.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const spawnCursorSymbol = (x, y) => {
    const symbols = cursorSymbolRefs.current

    if (!symbols.length) {
      return
    }

    const wrappedIndex = cursorTrailIndexRef.current % symbols.length
    const symbolNode = symbols[wrappedIndex]

    if (!symbolNode) {
      return
    }

    gsap.killTweensOf(symbolNode)
    gsap.set(symbolNode, {
      x,
      y,
      xPercent: -50,
      yPercent: -50,
      scale: 0,
      rotation: 0,
      autoAlpha: 1,
    })

    const timeline = gsap.timeline()

    timeline.to(symbolNode, {
      scale: gsap.utils.random(0.95, 1.25),
      rotation: gsap.utils.random(-36, 36),
      duration: 0.42,
      ease: 'back.out(2.2)',
    })

    timeline.to(symbolNode, {
      y: y + gsap.utils.random(46, 86),
      rotation: `+=${gsap.utils.random(-24, 24)}`,
      autoAlpha: 0,
      duration: 0.8,
      ease: 'power2.in',
    }, 0.04)

    cursorTrailIndexRef.current += 1
  }

  return (
    <main className={`min-h-screen lg:h-screen lg:overflow-hidden ${isLightTheme ? 'light-theme bg-[#cdd6b6] text-[#24281f]' : 'bg-[#111315] text-slate-100'}`}>
      {showWelcome ? (
        <WelcomeScreen
          onEnter={handleEnterPortfolio}
          isExiting={isEnteringPortfolio}
        />
      ) : null}
      <div className={`mx-auto flex min-h-screen max-w-[1528px] flex-col lg:grid lg:h-full lg:min-h-0 lg:grid-cols-[340px_minmax(0,1fr)_40px] ${
        isEnteringPortfolio ? 'portfolio-entering' : 'portfolio-entered'
      }`}>
        <Sidebar
          sections={sections}
          socials={socials}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          onToggleTheme={toggleTheme}
          theme={theme}
        />

        <section
          onMouseMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect()
            const nextX = event.clientX - rect.left
            const nextY = event.clientY - rect.top
            const lastPoint = lastTrailPointRef.current
            const distance = Math.hypot(nextX - lastPoint.x, nextY - lastPoint.y)

            if (distance > 42) {
              spawnCursorSymbol(nextX, nextY)
              lastTrailPointRef.current = { x: nextX, y: nextY }
            }
          }}
          className={`content-surface relative min-h-0 flex-1 lg:h-full ${
            isLightTheme
              ? 'bg-white shadow-[-1px_0_0_rgba(36,40,31,0.08)]'
              : 'bg-[#171a1d] shadow-[-1px_0_0_rgba(255,255,255,0.04)]'
          } ${
            currentSection.id === 'projects'
              ? 'px-0 pt-6 pb-0 sm:px-6 lg:px-10 lg:pt-10'
              : 'p-5 sm:p-6 lg:p-10'
          }`}
        >
          <div className="hidden h-full lg:block">
            {Array.from({ length: 10 }, (_, trail) => (
              <span
                key={trail}
                ref={(node) => {
                  cursorSymbolRefs.current[trail] = node
                }}
                aria-hidden="true"
                className="page-cursor-symbol"
              >
                {cursorSymbols[trail % cursorSymbols.length]}
              </span>
            ))}
            <div ref={desktopTransitionRef} className="relative flex h-full min-h-0 flex-col">
              <div data-page-chrome>
                <SectionHeader
                  eyebrow={currentSection.eyebrow}
                  title={currentSection.title}
                  ghostWord={currentSection.ghostWord}
                  accentText={currentSection.accentText}
                  theme={theme}
                />
              </div>
              <div
                key={currentSection.id}
                data-page-body
                className={`${
                  currentSection.id === 'skills' || currentSection.id === 'projects' ? 'min-h-0 flex-1' : 'flex-1'
                }`}
              >
                <ActivePage section={currentSection} sliderCopies={sliderCopies} toolIcons={toolIcons} theme={theme} />
              </div>
            </div>
          </div>

          <div className="space-y-12 lg:hidden">
            {sections.map((section) => {
              const MobilePage = pageComponents[section.id]

              return (
                <div
                  key={section.id}
                  ref={(node) => {
                    mobileSectionRefs.current[section.id] = node
                  }}
                  data-section-id={section.id}
                  className="scroll-mt-6"
                >
                  <div
                    ref={(node) => {
                      mobileSectionBodyRefs.current[section.id] = node
                    }}
                  >
                    <SectionHeader
                      eyebrow={section.eyebrow}
                      title={section.title}
                      ghostWord={section.ghostWord}
                      accentText={section.accentText}
                      theme={theme}
                    />
                    <MobilePage section={section} sliderCopies={sliderCopies} toolIcons={toolIcons} theme={theme} />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="fixed top-1/2 right-3 z-40 flex -translate-y-1/2 flex-col items-center gap-3 lg:hidden">
            <div className={`flex flex-col items-center gap-2 border px-1.5 py-2 backdrop-blur-xl transition duration-300 ${
              isLightTheme
                ? 'border-[rgba(36,40,31,0.08)] bg-[rgba(255,255,255,0.7)]'
                : 'border-white/8 bg-[#0d0f11]/84'
            } ${
              !isMobile || showMobileNavLinks
                ? 'translate-x-0 opacity-100'
                : 'pointer-events-none translate-x-4 opacity-0'
            }`}>
              {sections.map((section) => {
                const isActive = activeSection === section.id

                return (
                  <button
                    key={section.id}
                    type="button"
                    aria-label={section.label}
                    onClick={() => handleSectionChange(section.id)}
                    className={`flex h-8 w-8 items-center justify-center font-dm-mono text-[0.62rem] uppercase tracking-[0.18em] transition ${
                      isActive
                        ? 'text-[#93a66b]'
                        : isLightTheme ? 'text-[#5e6550]' : 'text-white/46'
                    }`}
                  >
                    {section.label.charAt(0)}
                  </button>
                )
              })}
            </div>
          </div>

          <button
            type="button"
            aria-label="Back to welcome page"
            onClick={() => setShowWelcome(true)}
            className={`fixed top-4 left-4 z-40 flex h-9 w-9 items-center justify-center border backdrop-blur-xl transition duration-300 lg:hidden ${
              isLightTheme
                ? 'border-[rgba(36,40,31,0.08)] bg-[rgba(255,255,255,0.7)] text-[#5e6550]'
                : 'border-white/8 bg-[#0d0f11]/84 text-white/46'
            } ${
              !isMobile || showMobileNavLinks
                ? 'translate-y-0 opacity-100'
                : 'pointer-events-none -translate-y-3 opacity-0'
            }`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 4.75h7.25A1.75 1.75 0 0 1 19 6.5v11a1.75 1.75 0 0 1-1.75 1.75H10" />
              <path d="M13 12H5.25" />
              <path d="m8.5 8.75-3.25 3.25 3.25 3.25" />
            </svg>
          </button>

          <button
            type="button"
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`fixed inset-x-0 bottom-4 z-40 mx-auto flex h-8 w-8 items-center justify-center border backdrop-blur-xl transition duration-300 lg:hidden ${
              isLightTheme
                ? 'border-[rgba(36,40,31,0.08)] bg-[rgba(255,255,255,0.7)] text-[#5e6550]'
                : 'border-white/8 bg-[#0d0f11]/84 text-white/46'
            } ${
              !isMobile || showMobileNavLinks
                ? 'translate-y-0 opacity-100'
                : 'pointer-events-none translate-y-3 opacity-0'
            }`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current animate-[projects-indicator-bounce_2.1s_cubic-bezier(0.22,1,0.36,1)_infinite] rotate-180">
              <path d="M12 16.28a.75.75 0 0 1-.53-.22l-5.5-5.5a.75.75 0 1 1 1.06-1.06L12 14.47l4.97-4.97a.75.75 0 0 1 1.06 1.06l-5.5 5.5a.75.75 0 0 1-.53.22Z" />
            </svg>
          </button>
        </section>

        <RightRail
          theme={theme}
          onToggleTheme={toggleTheme}
          onExitToWelcome={() => setShowWelcome(true)}
        />

      </div>
    </main>
  )
}

export default App
