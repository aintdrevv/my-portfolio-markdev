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
function App() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [activeSection, setActiveSection] = useState(sections[0].id)
  const [theme, setTheme] = useState('dark')
  const [isMobile, setIsMobile] = useState(() => (
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  ))
  const [showMobileNavLinks, setShowMobileNavLinks] = useState(true)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0, active: false })
  const mobileSectionRefs = useRef({})
  const mobileNavHideTimeoutRef = useRef(null)
  const currentSection = sections.find((section) => section.id === activeSection) ?? sections[0]
  const ActivePage = pageComponents[currentSection.id]
  const isLightTheme = theme === 'light'
  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
      setShowMobileNavLinks(true)
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

  return (
    <main className={`min-h-screen lg:h-screen lg:overflow-hidden ${isLightTheme ? 'light-theme bg-[#cdd6b6] text-[#24281f]' : 'bg-[#111315] text-slate-100'}`}>
      {showWelcome ? <WelcomeScreen onEnter={() => setShowWelcome(false)} /> : null}
      <div className="mx-auto flex min-h-screen max-w-[1528px] flex-col lg:grid lg:h-full lg:min-h-0 lg:grid-cols-[340px_minmax(0,1fr)_40px]">
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
            setCursorPosition({
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
              active: true,
            })
          }}
          onMouseLeave={() => {
            setCursorPosition((current) => ({ ...current, active: false }))
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
            <div
              aria-hidden="true"
              className={`page-cursor-glow ${cursorPosition.active ? 'opacity-100' : 'opacity-0'}`}
              style={{ left: `${cursorPosition.x}px`, top: `${cursorPosition.y}px` }}
            />
            <div className="relative flex h-full min-h-0 flex-col">
              <SectionHeader
                eyebrow={currentSection.eyebrow}
                title={currentSection.title}
                ghostWord={currentSection.ghostWord}
                accentText={currentSection.accentText}
                theme={theme}
              />
              <div
                key={currentSection.id}
                className={`page-transition ${
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
                  <SectionHeader
                    eyebrow={section.eyebrow}
                    title={section.title}
                    ghostWord={section.ghostWord}
                    accentText={section.accentText}
                    theme={theme}
                  />
                  <MobilePage section={section} sliderCopies={sliderCopies} toolIcons={toolIcons} theme={theme} />
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
              showMobileNavLinks ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-4 opacity-0'
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
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`fixed inset-x-0 bottom-4 z-40 mx-auto flex h-8 w-8 items-center justify-center border backdrop-blur-xl transition duration-300 lg:hidden ${
              isLightTheme
                ? 'border-[rgba(36,40,31,0.08)] bg-[rgba(255,255,255,0.7)] text-[#5e6550]'
                : 'border-white/8 bg-[#0d0f11]/84 text-white/46'
            } ${
              showMobileNavLinks ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
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
        />

      </div>
    </main>
  )
}

export default App
