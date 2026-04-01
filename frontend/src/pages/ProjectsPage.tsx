import gsap from 'gsap'
import { useEffect, useMemo, useRef, useState } from 'react'

const fallbackPanels = [
  { id: 'store', src: '/store-unsplash.jpg', objectPosition: 'center center', imageScale: 1 },
  { id: 'bike', src: '/bike-unsplash.jpg', objectPosition: 'center center', imageScale: 1 },
  { id: 'shadow', src: '/shadow-unsplash.jpg', objectPosition: 'center center', imageScale: 1 },
]

const XANO_PICTURES_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:4Sxa9QnL/list'

const getPanelObjectPosition = (panel) => panel.objectPosition ?? 'center center'
const getPanelImageScale = (panel) => panel.imageScale ?? 1

const attachPanelMeta = (panels, metas) =>
  panels.map((panel, index) => ({
    ...panel,
    meta: panel.meta ?? metas[index] ?? null,
  }))

const getPanelLabel = (panel) => {
  const tech = panel?.meta?.tech

  if (Array.isArray(tech) && tech.length > 0) {
    return tech.slice(0, 3).join(' / ')
  }

  return 'React / Vite / CSS'
}

const desktopSlots = [
  { top: 96, left: 0, right: 0, height: 'calc(100% - 96px)', zIndex: 3, opacity: 1, scale: 1 },
  { top: 58, left: 28, right: 28, height: 'calc(100% - 150px)', zIndex: 2, opacity: 0.96, scale: 1 },
  { top: 30, left: 58, right: 58, height: 'calc(100% - 200px)', zIndex: 1, opacity: 0.68, scale: 1 },
]

const PANEL_SHIFT_DURATION = 0.48
const PANEL_SHIFT_OFFSET = 0.14
const WHEEL_TRIGGER_THRESHOLD = 36
const DOWN_SETTLE_DURATION = 0.22

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

function ProjectsPage({ section }) {
  const projectMetas = useMemo(() => section.projects ?? [], [section.projects])
  const [panelOrder, setPanelOrder] = useState(() => attachPanelMeta(fallbackPanels, projectMetas))
  const previewRef = useRef<HTMLDivElement | null>(null)
  const wheelDeltaRef = useRef(0)
  const isAnimatingRef = useRef(false)
  const activeDirectionRef = useRef(0)
  const queuedDirectionRef = useRef(0)
  const queuedIntensityRef = useRef(1)
  const movePanelsRef = useRef<((direction: number, intensity?: number) => void) | null>(null)
  const panelOrderRef = useRef(panelOrder)
  const moveTimelineRef = useRef(null)
  const pendingSettleDirectionRef = useRef(null)
  const [zoomedPanel, setZoomedPanel] = useState(null)
  const [isMobile, setIsMobile] = useState(() => (
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  ))

  useEffect(() => {
    panelOrderRef.current = panelOrder
  }, [panelOrder])

  useEffect(() => {
    let ignore = false

    const loadPictures = async () => {
      try {
        const response = await fetch(XANO_PICTURES_URL)

        if (!response.ok) {
          throw new Error('Failed to load Xano pictures')
        }

        const records = await response.json()
        const projectRecords = Array.isArray(records)
          ? records.filter((record) => record?.category === 'project' && record?.image_url).slice(0, 3)
          : []

        if (!ignore && projectRecords.length > 0) {
          const panels = projectRecords.map((record, index) => ({
            id: `project-${record.id ?? index}`,
            src: record.image_url,
            objectPosition: 'center center',
            imageScale: 1,
          }))

          setPanelOrder(attachPanelMeta(panels, projectMetas))
        }
      } catch {
        if (!ignore) {
          setPanelOrder(attachPanelMeta(fallbackPanels, projectMetas))
        }
      }
    }

    loadPictures()

    return () => {
      ignore = true
    }
  }, [projectMetas])

  useEffect(() => () => {
    moveTimelineRef.current?.kill()
    wheelDeltaRef.current = 0
    isAnimatingRef.current = false
    activeDirectionRef.current = 0
    queuedDirectionRef.current = 0
    queuedIntensityRef.current = 1
    movePanelsRef.current = null
    panelOrderRef.current = attachPanelMeta(fallbackPanels, projectMetas)
  }, [projectMetas])

  useEffect(() => {
    const node = previewRef.current

    if (!node || isMobile) {
      return undefined
    }

    const flushQueuedMove = () => {
      if (!queuedDirectionRef.current) {
        return
      }

      const nextDirection = queuedDirectionRef.current
      const nextIntensity = queuedIntensityRef.current
      queuedDirectionRef.current = 0
      queuedIntensityRef.current = 1

      window.requestAnimationFrame(() => {
        movePanelsRef.current?.(nextDirection, nextIntensity)
      })
    }

    const direction = pendingSettleDirectionRef.current

    if (!direction) {
      return undefined
    }

    pendingSettleDirectionRef.current = null

    const reorderedItems = Array.from(node.querySelectorAll<HTMLElement>('.projects-loop-item'))
    const reorderedImages = Array.from(node.querySelectorAll<HTMLImageElement>('.projects-preview-image'))

    reorderedItems.forEach((item, index) => {
      const slot = desktopSlots[index] ?? desktopSlots[desktopSlots.length - 1]

      gsap.set(item, {
        top: slot.top,
        left: slot.left ?? 0,
        right: slot.right ?? 0,
        height: slot.height,
        opacity: slot.opacity,
        scale: slot.scale ?? 1,
        zIndex: slot.zIndex,
        x: 0,
        y: 0,
        yPercent: 0,
      })
    })

    reorderedImages.forEach((image) => {
      const panelId = image.closest('[data-panel-id]')?.getAttribute('data-panel-id')
      const panel = panelOrderRef.current.find((item) => item.id === panelId)

      gsap.set(image, {
        x: 0,
        y: 0,
        yPercent: 0,
        scale: getPanelImageScale(panel),
      })
    })

    if (direction > 0) {
      const backItem = reorderedItems[reorderedItems.length - 1]

      if (!backItem) {
        isAnimatingRef.current = false
        activeDirectionRef.current = 0
        return undefined
      }

      gsap.set(backItem, {
        autoAlpha: desktopSlots[desktopSlots.length - 1].opacity,
      })

      gsap.fromTo(backItem, {
        yPercent: 18,
      }, {
        yPercent: 0,
        duration: DOWN_SETTLE_DURATION,
        ease: 'power2.out',
        overwrite: false,
        clearProps: 'yPercent',
        onComplete: () => {
          isAnimatingRef.current = false
          activeDirectionRef.current = 0
          flushQueuedMove()
        },
      })

      return undefined
    }

    reorderedItems.forEach((item, index) => {
      gsap.set(item, {
        autoAlpha: desktopSlots[index]?.opacity ?? 1,
        y: 0,
        clearProps: 'y,yPercent',
      })
    })

    isAnimatingRef.current = false
    activeDirectionRef.current = 0
    flushQueuedMove()

    return undefined
  }, [isMobile, panelOrder])

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

  useEffect(() => {
    const node = previewRef.current

    if (!node || isMobile) {
      return undefined
    }

    const movePanels = (direction, intensity = 1) => {
      if (isAnimatingRef.current) {
        if (direction !== activeDirectionRef.current) {
          queuedDirectionRef.current = direction
          queuedIntensityRef.current = intensity
        }
        return
      }

      const items = Array.from(node.querySelectorAll<HTMLElement>('.projects-loop-item'))
      const images = Array.from(node.querySelectorAll<HTMLImageElement>('.projects-preview-image'))
      if (items.length < 2) {
        return
      }

      isAnimatingRef.current = true
      activeDirectionRef.current = direction
      const motionFactor = clamp(intensity, 1, 1.8)
      const shiftDuration = direction < 0
        ? PANEL_SHIFT_DURATION
        : clamp(PANEL_SHIFT_DURATION - ((motionFactor - 1) * 0.14), 0.3, PANEL_SHIFT_DURATION)
      const currentOrder = panelOrderRef.current
      const outgoingIndex = direction > 0 ? 0 : items.length - 1
      const outgoingItem = items[outgoingIndex]
      const remainingItems = items.filter((_, index) => index !== outgoingIndex)
      const destinationSlots = direction > 0
        ? desktopSlots.slice(0, remainingItems.length)
        : desktopSlots.slice(1, items.length)

      moveTimelineRef.current?.kill()
      gsap.killTweensOf(images)

      images.forEach((image) => {
        const panelId = image.closest('[data-panel-id]')?.getAttribute('data-panel-id')
        const panel = panelOrderRef.current.find((item) => item.id === panelId)

        gsap.set(image, {
          x: 0,
          y: 0,
          scale: getPanelImageScale(panel),
        })
      })

      const timeline = gsap.timeline({
        defaults: {
          duration: shiftDuration,
          ease: 'power3.inOut',
          force3D: true,
        },
        onComplete: () => {
          pendingSettleDirectionRef.current = direction
          setPanelOrder(() => {
            if (direction > 0) {
              return [...currentOrder.slice(1), currentOrder[0]]
            }

            return [currentOrder[currentOrder.length - 1], ...currentOrder.slice(0, -1)]
          })
        },
      })
      moveTimelineRef.current = timeline

      if (direction > 0) {
        timeline.to(outgoingItem, {
          yPercent: 110,
          autoAlpha: 1,
          duration: shiftDuration,
          ease: 'power3.inOut',
          force3D: true,
        }, 0)
      }

      remainingItems.forEach((item, index) => {
        const slot = destinationSlots[index]

        if (!slot) {
          return
        }

        timeline.to(item, {
          top: slot.top,
          left: slot.left ?? 0,
          right: slot.right ?? 0,
          height: slot.height,
          opacity: slot.opacity,
          scale: slot.scale ?? 1,
          ease: 'power3.inOut',
          force3D: true,
        }, PANEL_SHIFT_OFFSET)
      })

      if (direction < 0) {
        const recycledItem = outgoingItem
        const frontSlot = desktopSlots[0]

        if (recycledItem && frontSlot) {
          gsap.set(recycledItem, {
            top: frontSlot.top,
            left: frontSlot.left ?? 0,
            right: frontSlot.right ?? 0,
            height: frontSlot.height,
            opacity: frontSlot.opacity,
            scale: frontSlot.scale ?? 1,
            zIndex: frontSlot.zIndex + 1,
            yPercent: 100,
          })

          timeline.to(recycledItem, {
            yPercent: 0,
            duration: shiftDuration,
            ease: 'power2.out',
            force3D: true,
            clearProps: 'yPercent',
          }, PANEL_SHIFT_OFFSET)
        }
      }

    }

    movePanelsRef.current = movePanels

    const handleWheel = (event) => {
      event.preventDefault()

      wheelDeltaRef.current += event.deltaY

      if (Math.abs(wheelDeltaRef.current) < WHEEL_TRIGGER_THRESHOLD) {
        return
      }

      const direction = wheelDeltaRef.current > 0 ? 1 : -1
      const intensity = clamp(Math.abs(wheelDeltaRef.current) / 120, 1, 1.8)
      wheelDeltaRef.current = 0
      movePanels(direction, intensity)
    }

    const handlePointerMove = (event) => {
      const rect = node.getBoundingClientRect()
      const pointerX = ((event.clientX - rect.left) / rect.width) - 0.5
      const pointerY = ((event.clientY - rect.top) / rect.height) - 0.5
      const images = Array.from(node.querySelectorAll<HTMLImageElement>('.projects-preview-image'))
      const frontImage = images[0]

      if (!frontImage) {
        return
      }

      const panelId = frontImage.closest('[data-panel-id]')?.getAttribute('data-panel-id')
      const panel = panelOrderRef.current.find((item) => item.id === panelId)
      const baseScale = getPanelImageScale(panel)

      gsap.to(frontImage, {
        x: pointerX * 14,
        y: pointerY * 20,
        scale: baseScale + 0.02,
        duration: 0.42,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }

    const resetPointerMove = () => {
      const images = Array.from(node.querySelectorAll<HTMLImageElement>('.projects-preview-image'))
      const frontImage = images[0]

      if (!frontImage) {
        return
      }

      const panelId = frontImage.closest('[data-panel-id]')?.getAttribute('data-panel-id')
      const panel = panelOrderRef.current.find((item) => item.id === panelId)
      const baseScale = getPanelImageScale(panel)

      gsap.to(frontImage, {
        x: 0,
        y: 0,
        scale: baseScale,
        duration: 0.55,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }

    node.addEventListener('wheel', handleWheel, { passive: false })
    node.addEventListener('pointermove', handlePointerMove)
    node.addEventListener('pointerleave', resetPointerMove)

    return () => {
      movePanelsRef.current = null
      node.removeEventListener('wheel', handleWheel)
      node.removeEventListener('pointermove', handlePointerMove)
      node.removeEventListener('pointerleave', resetPointerMove)
    }
  }, [isMobile, panelOrder])

  const desktopPanelNodes = panelOrder.map((panel, index) => {
    const slot = desktopSlots[index] ?? desktopSlots[desktopSlots.length - 1]
    return (
      <div
        key={panel.id}
        data-panel-id={panel.id}
        className="projects-loop-item absolute overflow-hidden rounded-t-[1.5rem]"
        style={{
          top: `${slot.top}px`,
          left: `${slot.left ?? 0}px`,
          right: `${slot.right ?? 0}px`,
          height: slot.height,
          zIndex: slot.zIndex,
          opacity: slot.opacity,
          transform: `scale(${slot.scale ?? 1})`,
          transformOrigin: 'center top',
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
        }}
      >
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start px-4 pt-3 md:px-5 md:pt-4">
            <span className="font-dm-mono text-[0.65rem] uppercase tracking-[0.24em] text-white/62">
              {getPanelLabel(panel)}
            </span>
          </div>
        <img
          src={panel.src}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="projects-preview-image pointer-events-none block h-full w-full select-none object-cover"
          style={{
            WebkitUserSelect: 'none',
            userSelect: 'none',
            objectPosition: getPanelObjectPosition(panel),
            transform: `scale(${getPanelImageScale(panel)})`,
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
          }}
        />
      </div>
    )
  })

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <div className="w-full shrink-0 pt-6 pb-3">
        <div className="w-full max-w-[48rem] px-5 py-3">
          {section.description ? (
            <p className="max-w-[36rem] text-left text-base leading-8 text-slate-300">
              {section.description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="relative min-h-[24rem] flex-1 px-0 md:px-5">
        {isMobile ? (
          <div className="w-full">
            {panelOrder.map((panel, index) => (
              <button
                key={panel.id}
                type="button"
                onClick={() => setZoomedPanel(panel.src)}
                className="relative block h-[82svh] w-full overflow-hidden rounded-t-[1.5rem] text-left"
                aria-label={`Open project preview ${index + 1}`}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start px-4 pt-3">
                  <span className="font-dm-mono text-[0.65rem] uppercase tracking-[0.24em] text-white/62">
                    {getPanelLabel(panel)}
                  </span>
                </div>
                <img
                  src={panel.src}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  className="block h-full w-full select-none object-cover"
                  style={{
                    WebkitUserSelect: 'none',
                    userSelect: 'none',
                    objectPosition: getPanelObjectPosition(panel),
                    transform: `scale(${getPanelImageScale(panel)})`,
                  }}
                />
              </button>
            ))}
          </div>
        ) : (
          <div
            ref={previewRef}
            className="relative h-full min-h-0 overflow-hidden"
            style={{ touchAction: 'pan-y', overscrollBehaviorY: 'contain' }}
          >
            {desktopPanelNodes}
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-10 z-40 hidden justify-center transition duration-300 md:flex opacity-100">
        <div className="projects-scroll-indicator flex items-center gap-2 font-dm-mono text-[0.62rem] uppercase tracking-[0.22em] text-white/52">
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
