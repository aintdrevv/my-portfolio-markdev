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

      timeline.fromTo('[data-welcome-image]', {
        y: 64,
        scale: 1.08,
      }, {
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'back.out(1.45)',
        stagger: 0.05,
      }, '-=0.82')

      gsap.to('[data-welcome-image]', {
        y: (index) => (index % 2 === 0 ? -10 : 10),
        duration: 3.6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: {
          each: 0.12,
          from: 'start',
        },
      })
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
    const originX = buttonRect.left - rootRect.left + (buttonRect.width / 2)
    const originY = buttonRect.top - rootRect.top + (buttonRect.height / 2)

    const palette = ['#ffffff', '#93a66b', '#f4d58d']
    const particles = Array.from({ length: 10 }, (_, index) => {
      const particle = document.createElement('span')
      const angle = (-95 + ((190 / 9) * index)) * (Math.PI / 180)
      const distance = 34 + ((index % 3) * 10)
      const size = 4 + (index % 3)
      const color = palette[index % palette.length]

      particle.style.position = 'absolute'
      particle.style.left = `${originX}px`
      particle.style.top = `${originY}px`
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.borderRadius = '999px'
      particle.style.pointerEvents = 'none'
      particle.style.background = color
      particle.style.boxShadow = `0 0 12px ${color}, 0 0 20px ${color}55`
      particle.style.opacity = '0'
      particle.style.transform = 'translate(-50%, -50%) scale(0.4)'
      particle.dataset.dx = String(Math.cos(angle) * distance)
      particle.dataset.dy = String(Math.sin(angle) * distance)
      particlesRoot.appendChild(particle)
      return particle
    })

    const trails = particles.map((particle, index) => {
      const trail = document.createElement('span')
      const color = palette[index % palette.length]
      trail.style.position = 'absolute'
      trail.style.left = `${originX}px`
      trail.style.top = `${originY}px`
      trail.style.width = '24px'
      trail.style.height = '2px'
      trail.style.borderRadius = '999px'
      trail.style.pointerEvents = 'none'
      trail.style.opacity = '0'
      trail.style.transformOrigin = '0% 50%'
      trail.style.background = `linear-gradient(90deg, ${color}b3 0%, ${color}4d 45%, transparent 100%)`
      trail.style.filter = 'blur(0.5px)'
      trail.dataset.dx = particle.dataset.dx ?? '0'
      trail.dataset.dy = particle.dataset.dy ?? '0'
      trail.dataset.rotation = `${Math.atan2(Number(trail.dataset.dy), Number(trail.dataset.dx)) * (180 / Math.PI)}`
      particlesRoot.appendChild(trail)
      return trail
    })

    const timeline = gsap.timeline({
      onComplete: () => {
        particles.forEach((particle) => particle.remove())
        trails.forEach((trail) => trail.remove())
        onEnter()
      },
    })

    timeline.to(button, {
      scale: 0.94,
      duration: 0.08,
      ease: 'power2.out',
    })

    timeline.to(button, {
      scale: 1,
      duration: 0.42,
      ease: 'elastic.out(1, 0.55)',
    }, '>')

    timeline.to(particles, {
      autoAlpha: 1,
      scale: 1,
      x: (_, element) => Number(element.dataset.dx ?? 0),
      y: (_, element) => Number(element.dataset.dy ?? 0),
      duration: 0.34,
      ease: 'power3.out',
      stagger: 0.008,
    }, 0)

    timeline.fromTo(trails, {
      autoAlpha: 0,
      scaleX: 0.2,
      rotation: (_, element) => Number(element.dataset.rotation ?? 0),
      x: 0,
      y: 0,
    }, {
      autoAlpha: 0.95,
      scaleX: 1,
      rotation: (_, element) => Number(element.dataset.rotation ?? 0),
      x: (_, element) => Number(element.dataset.dx ?? 0) * 0.45,
      y: (_, element) => Number(element.dataset.dy ?? 0) * 0.45,
      duration: 0.18,
      ease: 'power2.out',
      stagger: 0.006,
    }, 0.02)

    timeline.to(particles, {
      y: (_, element) => Number(element.dataset.dy ?? 0) + 12,
      autoAlpha: 0,
      duration: 0.3,
      ease: 'power2.in',
      stagger: 0.005,
    }, 0.16)

    timeline.to(trails, {
      autoAlpha: 0,
      scaleX: 1.06,
      duration: 0.22,
      ease: 'power2.in',
      stagger: 0.004,
    }, 0.14)
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

    const rect = marquee.getBoundingClientRect()
    const pointerX = ((event.clientX - rect.left) / rect.width) - 0.5
    const pointerY = ((event.clientY - rect.top) / rect.height) - 0.5

    imageRefs.current.forEach((image, index) => {
      if (!image) {
        return
      }

      const depth = 1 + ((index % welcomeImages.length) * 0.22)

      gsap.to(image, {
        x: pointerX * 22 * depth,
        y: pointerY * 30 * depth,
        scale: 1.03 + (depth * 0.012),
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
        scale: 1,
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
