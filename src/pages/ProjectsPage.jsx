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
  const [zoomedPanel, setZoomedPanel] = useState(null)
  const [isMobile, setIsMobile] = useState(() => (
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  ))
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (zoomedPanel === null) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setZoomedPanel(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [zoomedPanel])

  const previewPanelNodes = previewPanels.map((panel, index) => {
    const start = index * viewportHeight
    const progress = viewportHeight > 0
      ? Math.max(0, Math.min((scrollTop - start) / viewportHeight, 1))
      : 0
    const maxShrink = [0.08, 0.04, 0.02][index] ?? 0.04
    const scale = isMobile ? 1 : 1 - (progress * maxShrink)

    return (
      <div
        key={panel}
        className="projects-preview-panel sticky snap-start"
        ref={(node) => {
          panelRefs.current[index] = node
        }}
        style={{
          top: isMobile ? '0px' : `${index * 28}px`,
          height: isMobile ? '100%' : `calc(100% - ${index * 28}px)`,
          zIndex: index + 1,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start px-4 pt-3 md:px-5 md:pt-4">
          <span className="font-dm-mono text-[0.65rem] uppercase tracking-[0.24em] text-white/62">
            {projectLabels[index] ?? 'React / Vite / CSS'}
          </span>
        </div>
        <img
          src={panel}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="projects-preview-image pointer-events-none block h-full w-full select-none object-cover"
          style={{ WebkitUserSelect: 'none', userSelect: 'none', touchAction: 'pan-y' }}
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

      <div className="relative min-h-0 flex-1 px-0 md:px-5">
        {isMobile ? (
          <div className="w-full">
            {previewPanels.map((panel, index) => (
              <button
                key={panel}
                type="button"
                onClick={() => setZoomedPanel(panel)}
                className="relative block h-[78svh] w-full overflow-hidden text-left"
                aria-label={`Open project preview ${index + 1}`}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start px-4 pt-3">
                  <span className="font-dm-mono text-[0.65rem] uppercase tracking-[0.24em] text-white/62">
                    {projectLabels[index] ?? 'React / Vite / CSS'}
                  </span>
                </div>
                <img
                  src={panel}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  className="block h-full w-full select-none object-cover"
                  style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
                />
              </button>
            ))}
          </div>
        ) : (
          <div
            ref={previewRef}
            className="projects-preview-scroll h-full overflow-y-auto"
            style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y', overscrollBehaviorY: 'contain' }}
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
        )}
      </div>

      <div
        className={`pointer-events-none absolute inset-x-0 bottom-10 z-40 hidden justify-center transition duration-300 md:flex ${
          scrollTop > 24 ? 'translate-y-2 opacity-0' : 'opacity-100'
        }`}
      >
        <div className="projects-scroll-indicator flex items-center gap-2 font-dm-mono text-[0.62rem] uppercase tracking-[0.22em] text-white/52">
          <span className="text-white/42">↓</span>
          <span>Scroll to view</span>
        </div>
      </div>

      {isMobile && zoomedPanel ? (
        <div
          className="fixed inset-0 z-[120] bg-black/92"
          role="dialog"
          aria-modal="true"
          aria-label="Expanded project preview"
          onClick={() => setZoomedPanel(null)}
          style={{ touchAction: 'pinch-zoom' }}
        >
          <button
            type="button"
            onClick={() => setZoomedPanel(null)}
            aria-label="Close expanded project preview"
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center text-white/82"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
              <path d="M6.97 5.91 12 10.94l5.03-5.03a.75.75 0 1 1 1.06 1.06L13.06 12l5.03 5.03a.75.75 0 1 1-1.06 1.06L12 13.06l-5.03 5.03a.75.75 0 0 1-1.06-1.06L10.94 12 5.91 6.97a.75.75 0 0 1 1.06-1.06Z" />
            </svg>
          </button>
          <div
            className="flex h-full w-full items-center justify-center overflow-auto p-4"
            onClick={(event) => event.stopPropagation()}
            style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pinch-zoom' }}
          >
            <img
              src={zoomedPanel}
              alt=""
              aria-hidden="true"
              className="block max-h-none min-h-full w-auto max-w-none select-none object-contain"
              draggable={false}
              style={{ touchAction: 'pinch-zoom' }}
            />
          </div>
        </div>
      ) : null}

    </div>
  )
}

export default ProjectsPage
