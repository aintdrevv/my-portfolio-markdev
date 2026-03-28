import { useState } from 'react'
import SectionHeader from './components/SectionHeader'
import RightRail from './components/RightRail'
import Sidebar from './components/Sidebar'
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
const constrainedSections = new Set(['skills'])

function App() {
  const [activeSection, setActiveSection] = useState(sections[0].id)
  const [theme, setTheme] = useState('dark')
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0, active: false })
  const currentSection = sections.find((section) => section.id === activeSection) ?? sections[0]
  const ActivePage = pageComponents[currentSection.id]
  const isLightTheme = theme === 'light'
  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))

  return (
    <main className={`h-screen overflow-hidden ${isLightTheme ? 'light-theme bg-[#cdd6b6] text-[#24281f]' : 'bg-[#111315] text-slate-100'}`}>
      <div className="mx-auto grid h-full max-w-[1556px] grid-cols-[340px_minmax(0,1fr)_40px]">
        <Sidebar
          sections={sections}
          socials={socials}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
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
          className={`content-surface relative h-full min-h-0 ${
            isLightTheme
              ? 'bg-white shadow-[-1px_0_0_rgba(36,40,31,0.08)]'
              : 'bg-[#171a1d] shadow-[-1px_0_0_rgba(255,255,255,0.04)]'
          } ${
            currentSection.id === 'projects' ? 'px-10 pt-10 pb-0' : 'p-10'
          }`}
        >
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
              className={`page-transition ${constrainedSections.has(currentSection.id) ? 'min-h-0 flex-1 overflow-hidden' : 'flex-1'}`}
            >
              <ActivePage section={currentSection} sliderCopies={sliderCopies} toolIcons={toolIcons} theme={theme} />
            </div>
          </div>
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
