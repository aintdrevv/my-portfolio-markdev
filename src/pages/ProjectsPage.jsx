import { useEffect, useRef, useState } from 'react'

const previewPanels = [
  '/project-placeholder-black.svg',
  '/project-placeholder-blue.svg',
  '/project-placeholder-violet.svg',
]

function ProjectsPage({ section }) {
  const projectLabels = section.projects?.map((project) => project.tech?.slice(0, 3).join(' / ')) ?? []
  const previewRef = useRef(null)
  const panelRefs = useRef([])
  const snapTimeoutRef = useRef(null)
  const snappingRef = useRef(false)
  const [scrollTop, setScrollTop] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(0)

  useEffect(() => {
    const node = previewRef.current

    if (!node) {
      return undefined
    }

    const updateViewportHeight = () => {
      setViewportHeight(node.clientHeight)
    }

    updateViewportHeight()

    const observer = new ResizeObserver(updateViewportHeight)
    observer.observe(node)

    return () => {
      observer.disconnect()

      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current)
      }
    }
  }, [])

  const previewPanelNodes = previewPanels.map((panel, index) => {
    const start = index * viewportHeight
    const progress = viewportHeight > 0
      ? Math.max(0, Math.min((scrollTop - start) / viewportHeight, 1))
      : 0
    const maxShrink = [0.08, 0.04, 0.02][index] ?? 0.04
    const scale = 1 - (progress * maxShrink)

    return (
      <div
        key={panel}
        className="projects-preview-panel sticky snap-start"
        ref={(node) => {
          panelRefs.current[index] = node
        }}
        style={{
          top: `${index * 28}px`,
          height: `calc(100% - ${index * 28}px)`,
          zIndex: index + 1,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start px-5 pt-4">
          <span className="font-dm-mono text-[0.65rem] uppercase tracking-[0.24em] text-white/62">
            {projectLabels[index] ?? 'React / Vite / CSS'}
          </span>
        </div>
        <img
          src={panel}
          alt=""
          aria-hidden="true"
          className="projects-preview-image block h-full w-full object-cover"
        />
      </div>
    )
  })

  return (
    <div className="relative flex h-full flex-col">
      <div className="w-full pt-8 pb-4">
        <div className="w-full max-w-[48rem] px-5 py-4">
          {section.description ? (
            <p className="max-w-[36rem] text-left text-base leading-8 text-slate-300">
              {section.description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="relative min-h-0 flex-1 px-5">
        <div
          ref={previewRef}
          className="projects-preview-scroll h-full overflow-y-auto"
          onScroll={(event) => {
            const node = event.currentTarget
            const nextScrollTop = node.scrollTop

            setScrollTop(nextScrollTop)

            if (snappingRef.current) {
              return
            }

            if (snapTimeoutRef.current) {
              clearTimeout(snapTimeoutRef.current)
            }

            snapTimeoutRef.current = setTimeout(() => {
              const offsets = panelRefs.current
                .map((panelNode) => panelNode?.offsetTop ?? 0)
                .filter((offset, offsetIndex, array) => array.indexOf(offset) === offset)

              if (offsets.length === 0) {
                return
              }

              const targetTop = offsets.reduce((closest, offset) => (
                Math.abs(offset - node.scrollTop) < Math.abs(closest - node.scrollTop) ? offset : closest
              ))

              if (Math.abs(targetTop - node.scrollTop) < 2) {
                return
              }

              snappingRef.current = true
              node.scrollTo({
                top: targetTop,
                behavior: 'smooth',
              })

              window.setTimeout(() => {
                snappingRef.current = false
              }, 220)
            }, 110)
          }}
        >
          {previewPanelNodes}
        </div>
      </div>

      <div
        className={`pointer-events-none absolute inset-x-0 bottom-10 z-40 flex justify-center transition duration-300 ${
          scrollTop > 24 ? 'translate-y-2 opacity-0' : 'opacity-100'
        }`}
      >
        <div className="projects-scroll-indicator flex items-center gap-2 font-dm-mono text-[0.62rem] uppercase tracking-[0.22em] text-white/52">
          <span className="text-white/42">↓</span>
          <span>Scroll to view</span>
        </div>
      </div>

    </div>
  )
}

export default ProjectsPage
