import gsap from 'gsap'
import { useEffect, useRef } from 'react'

const welcomeImages = [
  '/store-unsplash.jpg',
  '/sakura-unsplash.jpg',
  '/shadow-unsplash.jpg',
  '/bike-unsplash.jpg',
]

const imagePositions = ['center center', 'center 40%', 'center center', 'center 30%']
const cursorSymbols = ['+', 'x', 'o', '::', '/']
const welcomeImageBaseScale = 1

function WelcomeScreen({ onEnter, isExiting = false }) {
  const marqueeImages = [...welcomeImages, ...welcomeImages]
  const mobileLoopImages = Array.from({ length: 6 }, () => welcomeImages).flat()
  const rootRef = useRef(null)
  const buttonRef = useRef(null)
  const particlesRef = useRef(null)
  const symbolRefs = useRef([])
  const symbolIndexRef = useRef(0)
  const lastSymbolPointRef = useRef({ x: 0, y: 0 })
  const marqueeRef = useRef(null)
  const mobileGalleryViewportRef = useRef(null)
  const mobileLoopResetTimeoutRef = useRef(null)
  const imageRefs = useRef([])

  useEffect(() => {
    const viewportNode = mobileGalleryViewportRef.current

    if (!viewportNode || typeof window === 'undefined' || window.innerWidth >= 1024) {
      return undefined
    }

    const setWidth = () => viewportNode.scrollWidth / 6

    const centerLoop = () => {
      const singleSetWidth = setWidth()

      if (!singleSetWidth) {
        return
      }

      viewportNode.scrollLeft = singleSetWidth * 2
    }

    const handleScroll = () => {
      if (mobileLoopResetTimeoutRef.current) {
        window.clearTimeout(mobileLoopResetTimeoutRef.current)
      }

      mobileLoopResetTimeoutRef.current = window.setTimeout(() => {
        const singleSetWidth = setWidth()

        if (!singleSetWidth) {
          return
        }

        if (viewportNode.scrollLeft <= singleSetWidth * 0.5) {
          viewportNode.scrollLeft += singleSetWidth * 2
        } else if (viewportNode.scrollLeft >= singleSetWidth * 3.5) {
          viewportNode.scrollLeft -= singleSetWidth * 2
        }
      }, 80)
    }

    const frameId = window.requestAnimationFrame(centerLoop)
    viewportNode.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', centerLoop)

    return () => {
      window.cancelAnimationFrame(frameId)
      if (mobileLoopResetTimeoutRef.current) {
        window.clearTimeout(mobileLoopResetTimeoutRef.current)
      }
      viewportNode.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', centerLoop)
    }
  }, [])

  const handleMagneticMove = (event) => {
    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const offsetX = event.clientX - rect.left - (rect.width / 2)
    const offsetY = event.clientY - rect.top - (rect.height / 2)

    gsap.to(button, {
      x: offsetX * 0.18,
      y: offsetY * 0.22,
      duration: 0.28,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  }

  const resetMagneticButton = (event) => {
    gsap.to(event.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.45,
      ease: 'elastic.out(1, 0.5)',
      overwrite: 'auto',
    })
  }

  useEffect(() => {
    if (!rootRef.current || isExiting) {
      return undefined
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: {
          ease: 'power3.out',
        },
      })

      timeline.fromTo('[data-welcome-panel]', {
        autoAlpha: 0,
        x: -72,
      }, {
        autoAlpha: 1,
        x: 0,
        duration: 0.54,
      })

      timeline.fromTo('[data-welcome-kicker]', {
        autoAlpha: 0,
        y: 26,
      }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.34,
      }, '-=0.3')

      timeline.fromTo('[data-welcome-title]', {
        autoAlpha: 0,
        y: 70,
        scale: 0.88,
        rotate: -2,
      }, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        rotate: 0,
        duration: 0.95,
        ease: 'elastic.out(1, 0.62)',
      }, '-=0.18')

      timeline.fromTo('[data-welcome-meta], [data-welcome-copy]', {
        autoAlpha: 0,
        y: 28,
      }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.42,
        stagger: 0.08,
      }, '-=0.56')

      timeline.fromTo('[data-welcome-button]', {
        autoAlpha: 0,
        y: 34,
        scale: 0.84,
      }, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.82,
        ease: 'elastic.out(1, 0.55)',
      }, '-=0.3')

      timeline.fromTo('[data-welcome-marquee]', {
        autoAlpha: 0,
        x: 92,
        scale: 0.92,
        rotate: 1.2,
      }, {
        autoAlpha: 1,
        x: 0,
        scale: 1,
        rotate: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.7)',
      }, '-=1.02')

      timeline.fromTo('[data-welcome-image] img', {
        y: 64,
        scale: welcomeImageBaseScale + 0.08,
      }, {
        y: 0,
        scale: welcomeImageBaseScale,
        duration: 0.8,
        ease: 'back.out(1.45)',
        stagger: 0.05,
      }, '-=0.82')

    }, rootRef)

    return () => ctx.revert()
  }, [isExiting])

  const handleEnterClick = () => {
    const button = buttonRef.current
    const particlesRoot = particlesRef.current

    if (!button || !particlesRoot) {
      onEnter()
      return
    }

    const buttonRect = button.getBoundingClientRect()
    const rootRect = particlesRoot.getBoundingClientRect()
    const palette = ['#93a66b', '#7d8d5a', '#c8d5a8', '#ffffff']
    const clusterAnchors = [
      { angle: -132, spread: 18, strength: 54 },
      { angle: -92, spread: 22, strength: 42 },
      { angle: -38, spread: 16, strength: 48 },
      { angle: 18, spread: 20, strength: 44 },
      { angle: 72, spread: 18, strength: 50 },
    ]
    const particles = Array.from({ length: 13 }, (_, index) => {
      const particle = document.createElement('span')
      const cluster = clusterAnchors[index % clusterAnchors.length]
      const angle = (cluster.angle + gsap.utils.random(-cluster.spread, cluster.spread)) * (Math.PI / 180)
      const distance = cluster.strength + gsap.utils.random(-10, 14)
      const isBlob = index % 4 !== 3
      const width = isBlob ? gsap.utils.random(10, 22) : gsap.utils.random(4, 7)
      const height = isBlob ? gsap.utils.random(9, 20) : gsap.utils.random(18, 30)
      const color = palette[index % palette.length]
      const dx = Math.cos(angle) * distance
      const dy = Math.sin(angle) * distance
      const driftX = dx + gsap.utils.random(-10, 12)
      const driftY = dy + gsap.utils.random(14, 30)
      const launchX = buttonRect.width * gsap.utils.random(0.14, 0.86)
      const launchY = buttonRect.height * gsap.utils.random(0.24, 0.78)

      particle.style.position = 'absolute'
      particle.style.left = `${buttonRect.left - rootRect.left + launchX}px`
      particle.style.top = `${buttonRect.top - rootRect.top + launchY}px`
      particle.style.width = `${width}px`
      particle.style.height = `${height}px`
      particle.style.borderRadius = isBlob
        ? `${gsap.utils.random(34, 58)}% ${gsap.utils.random(46, 70)}% ${gsap.utils.random(32, 56)}% ${gsap.utils.random(42, 66)}%`
        : '999px'
      particle.style.pointerEvents = 'none'
      particle.style.background = isBlob
        ? `radial-gradient(circle at 28% 24%, rgba(255,255,255,0.38) 0%, ${color} 36%, ${color}ee 100%)`
        : `linear-gradient(180deg, rgba(255,255,255,0.75) 0%, ${color} 100%)`
      particle.style.boxShadow = `0 0 10px ${color}22`
      particle.style.opacity = '0'
      particle.style.transform = 'translate(-50%, -50%) scale(0.4) rotate(0deg)'
      particle.dataset.dx = String(dx)
      particle.dataset.dy = String(dy)
      particle.dataset.driftX = String(driftX)
      particle.dataset.driftY = String(driftY)
      particle.dataset.rotation = String(gsap.utils.random(-28, 28))
      particlesRoot.appendChild(particle)
      return particle
    })

    const timeline = gsap.timeline({
      onComplete: () => {
        particles.forEach((particle) => particle.remove())
        onEnter()
      },
    })

    timeline.to(button, {
      scale: 0.94,
      duration: 0.08,
      ease: 'power2.out',
    })

    timeline.to(button, {
      boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.18), 0 0 28px rgba(223, 233, 243, 0.24)',
      duration: 0.12,
      ease: 'power2.out',
    }, 0)

    timeline.to(button, {
      scale: 1,
      duration: 0.42,
      ease: 'elastic.out(1, 0.55)',
    }, '>')

    timeline.to(button, {
      boxShadow: 'none',
      duration: 0.28,
      ease: 'power2.out',
    }, 0.12)

    timeline.to(particles, {
      autoAlpha: 1,
      scale: 1,
      rotation: (_, element) => Number(element.dataset.rotation ?? 0),
      x: (_, element) => Number(element.dataset.dx ?? 0),
      y: (_, element) => Number(element.dataset.dy ?? 0),
      duration: 0.28,
      ease: 'power2.out',
      stagger: 0.01,
    }, 0)

    timeline.to(particles, {
      x: (_, element) => Number(element.dataset.driftX ?? 0),
      y: (_, element) => Number(element.dataset.driftY ?? 0),
      rotation: (_, element) => Number(element.dataset.rotation ?? 0) * 1.6,
      autoAlpha: 0,
      scale: (_, element) => (Number(element.dataset.rotation ?? 0) === 0 ? 0.82 : 0.68),
      duration: 0.48,
      ease: 'power2.in',
      stagger: 0.01,
    }, 0.1)
  }

  const spawnCursorSymbol = (x, y) => {
    const symbols = symbolRefs.current

    if (!symbols.length) {
      return
    }

    const wrappedIndex = symbolIndexRef.current % symbols.length
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
      scale: gsap.utils.random(0.95, 1.2),
      rotation: gsap.utils.random(-34, 34),
      duration: 0.4,
      ease: 'back.out(2)',
    })

    timeline.to(symbolNode, {
      y: y + gsap.utils.random(44, 82),
      rotation: `+=${gsap.utils.random(-24, 24)}`,
      autoAlpha: 0,
      duration: 0.78,
      ease: 'power2.in',
    }, 0.05)

    symbolIndexRef.current += 1
  }

  const handleMarqueeParallax = (event) => {
    const marquee = marqueeRef.current

    if (!marquee) {
      return
    }

    const hoveredFrame = event.target instanceof Element
      ? event.target.closest('[data-welcome-image]')
      : null

    if (!hoveredFrame) {
      resetMarqueeParallax()
      return
    }

    const hoveredImage = hoveredFrame.querySelector('img')

    if (!hoveredImage) {
      resetMarqueeParallax()
      return
    }

    const rect = hoveredFrame.getBoundingClientRect()
    const pointerX = ((event.clientX - rect.left) / rect.width) - 0.5
    imageRefs.current.forEach((image, index) => {
      if (!image) {
        return
      }

      if (image !== hoveredImage) {
        gsap.to(image, {
          x: 0,
          y: 0,
          scale: welcomeImageBaseScale,
          duration: 0.35,
          ease: 'power3.out',
          overwrite: 'auto',
        })
        return
      }

      const depth = 1 + ((index % welcomeImages.length) * 0.22)

      gsap.to(image, {
        x: pointerX * 18 * depth,
        y: 0,
        scale: welcomeImageBaseScale + 0.03 + (depth * 0.012),
        duration: 0.55,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    })
  }

  const resetMarqueeParallax = () => {
    imageRefs.current.forEach((image) => {
      if (!image) {
        return
      }

      gsap.to(image, {
        x: 0,
        y: 0,
        scale: welcomeImageBaseScale,
        duration: 0.7,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    })
  }

  return (
    <div
      ref={rootRef}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const nextX = event.clientX - rect.left
        const nextY = event.clientY - rect.top
        const lastPoint = lastSymbolPointRef.current
        const distance = Math.hypot(nextX - lastPoint.x, nextY - lastPoint.y)

        if (distance > 42) {
          spawnCursorSymbol(nextX, nextY)
          lastSymbolPointRef.current = { x: nextX, y: nextY }
        }
      }}
      className={`fixed inset-0 z-[200] overflow-hidden bg-[#0d0f11] transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isExiting ? 'pointer-events-none scale-[1.01] opacity-0' : 'scale-100 opacity-100'
      }`}
    >
      <div ref={particlesRef} className="pointer-events-none absolute inset-0 z-[220]" />
      {Array.from({ length: 10 }, (_, trail) => (
        <span
          key={trail}
          ref={(node) => {
            symbolRefs.current[trail] = node
          }}
          aria-hidden="true"
          className="page-cursor-symbol z-[210]"
        >
          {cursorSymbols[trail % cursorSymbols.length]}
        </span>
      ))}
      <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[0.92fr_1.08fr]">
        <div data-welcome-panel className="flex min-h-0 flex-col justify-end px-0 pt-8 pb-0 sm:pt-10 lg:justify-center lg:px-12 lg:py-10 xl:px-16">
          <div className="w-full">
            <div className="flex min-h-[48svh] items-center">
              <div className="max-w-[30rem] px-6 sm:px-8 lg:px-0">
              <p data-welcome-kicker className="font-dm-mono text-[0.68rem] uppercase tracking-[0.34em] text-white/34">
              Welcome
              </p>
              <h1 data-welcome-title className="mt-5 text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
                Mark Macaraig
              </h1>
              <p data-welcome-meta className="mt-4 text-[0.78rem] uppercase tracking-[0.34em] text-[#93a66b]">
                Frontend Developer
              </p>
              <p data-welcome-copy className="mt-8 max-w-[26rem] text-base leading-8 text-white/66 sm:text-[1.02rem]">
                Designing and building simple, refined, and modern digital experiences.
              </p>
              <button
                data-welcome-button
                ref={buttonRef}
                type="button"
                onClick={handleEnterClick}
                onMouseMove={handleMagneticMove}
                onMouseLeave={resetMagneticButton}
                className="mt-10 inline-flex h-12 items-center bg-white px-6 text-sm font-medium uppercase tracking-[0.18em] text-[#0d0f11] transition hover:bg-[#93a66b]"
              >
                Enter Portfolio
              </button>
              </div>
            </div>

            <div
              ref={mobileGalleryViewportRef}
              className="mobile-welcome-gallery mt-auto w-full snap-x snap-mandatory overflow-x-auto pb-0 lg:hidden"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                overscrollBehaviorX: 'contain',
                touchAction: 'pan-x',
              }}
            >
              <div className="flex gap-0">
                {mobileLoopImages.map((image, index) => (
                  <div
                    key={`mobile-welcome-${image}-${index}`}
                    className="relative h-[40svh] w-full min-w-full shrink-0 snap-center overflow-hidden bg-[#090b0d]"
                  >
                    <img
                      src={image}
                      alt=""
                      aria-hidden="true"
                      className="block h-full w-full object-cover"
                      style={{ objectPosition: imagePositions[index % welcomeImages.length] }}
                      draggable={false}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-black/18" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          ref={marqueeRef}
          data-welcome-marquee
          onMouseMove={handleMarqueeParallax}
          onMouseLeave={resetMarqueeParallax}
          className="relative hidden h-full min-h-0 overflow-hidden lg:block"
        >
          <div className="welcome-marquee-track absolute inset-x-0 top-0 flex flex-col">
            {marqueeImages.map((image, index) => (
              <div key={`${image}-${index}`} data-welcome-image className="h-[40rem] w-full shrink-0 overflow-hidden bg-[#090b0d] xl:h-[42rem]">
                <img
                  ref={(node) => {
                    imageRefs.current[index] = node
                  }}
                  src={image}
                  alt=""
                  aria-hidden="true"
                  className="block h-full w-full object-cover"
                  style={{ objectPosition: imagePositions[index % welcomeImages.length] }}
                  draggable={false}
                />
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-black/24" />
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen
