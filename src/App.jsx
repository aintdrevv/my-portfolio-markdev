import { useState } from 'react'
import SectionHeader from './components/SectionHeader'
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

function App() {
  const [activeSection, setActiveSection] = useState(sections[0].id)
  const currentSection = sections.find((section) => section.id === activeSection) ?? sections[0]
  const ActivePage = pageComponents[currentSection.id]
  const sliderCopies = Array.from({ length: 6 }, (_, copy) => copy)
  const constrainedSections = new Set(['skills'])

  return (
    <main className="h-screen overflow-hidden bg-[#0f1117] text-slate-100">
      <div className="mx-auto grid h-full max-w-[1500px] grid-cols-[340px_minmax(0,1fr)]">
        <Sidebar
          sections={sections}
          socials={socials}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <section
          className={`relative h-full min-h-0 bg-white/[0.015] shadow-[-1px_0_0_rgba(255,255,255,0.05)] ${
            currentSection.id === 'projects' ? 'px-10 pt-10 pb-0' : 'p-10'
          }`}
        >
          <div className="relative flex h-full min-h-0 flex-col">
            <SectionHeader
              eyebrow={currentSection.eyebrow}
              title={currentSection.title}
              ghostWord={currentSection.ghostWord}
              accentText={currentSection.accentText}
            />
            <div className={constrainedSections.has(currentSection.id) ? 'min-h-0 flex-1 overflow-hidden' : 'flex-1'}>
              <ActivePage section={currentSection} sliderCopies={sliderCopies} toolIcons={toolIcons} />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
