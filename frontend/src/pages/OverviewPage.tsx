import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionFooterCards from '../components/SectionFooterCards'

gsap.registerPlugin(ScrollTrigger)

function TaggedPoint({ tag, text }) {
  return (
    <div className="flex h-full w-full items-center border-l-4 border-white/18 bg-white/[0.025] px-5 py-5 lg:ml-auto lg:w-[92%] lg:px-6 lg:py-6">
      <div className="space-y-4">
        <span className="inline-flex border border-white/14 bg-white/[0.04] px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] text-white/65">
          {tag}
        </span>
        <p className="text-base leading-8 text-slate-300">{text}</p>
      </div>
    </div>
  )
}

function OverviewPage({ section, sliderCopies, toolIcons, theme }) {
  const iconRefs = useRef([])
  const mobilePurposeRef = useRef(null)
  const dockPointerXRef = useRef(null)
  const dockHoverActiveRef = useRef(false)
  const isLightTheme = theme === 'light'

  useEffect(() => {
    const footerNode = mobilePurposeRef.current

    if (!footerNode || typeof window === 'undefined' || window.innerWidth >= 1024) {
      return undefined
    }

    const timeline = gsap.timeline({
      paused: true,
      scrollTrigger: {
        trigger: footerNode,
        start: 'top 92%',
        once: true,
      },
    })

    timeline.fromTo(footerNode, {
      autoAlpha: 0,
      y: 42,
      scale: 0.92,
      boxShadow: '0 0 0 rgba(147,166,107,0)',
    }, {
      autoAlpha: 1,
      y: -8,
      scale: 1.03,
      boxShadow: '0 0 28px rgba(147,166,107,0.12)',
      duration: 0.5,
      ease: 'power2.out',
    })

    timeline.to(footerNode, {
      y: 0,
      scale: 1,
      boxShadow: '0 0 0 rgba(147,166,107,0)',
      duration: 0.52,
      ease: 'back.out(1.8)',
      clearProps: 'opacity,visibility,transform,boxShadow',
    })

    return () => {
      timeline.kill()
      gsap.killTweensOf(footerNode)
    }
  }, [])

  const applyDockEffect = (pointerX) => {
    iconRefs.current.forEach((icon) => {
      if (!icon) {
        return
      }

      const rect = icon.getBoundingClientRect()
      const centerX = rect.left + (rect.width / 2)
      const distance = Math.abs(pointerX - centerX)
      const maxDistance = 180
      const influence = Math.max(0, 1 - (distance / maxDistance))
      const scale = 1 + (influence * 0.85)
      const lift = influence * -18
      const brightness = 1 + (influence * 0.35)

      gsap.to(icon, {
        scale,
        y: lift,
        filter: `brightness(${brightness})`,
        duration: 0.22,
        ease: 'power3.out',
      })
    })
  }

  const resetDockEffect = () => {
    dockHoverActiveRef.current = false
    dockPointerXRef.current = null

    iconRefs.current.forEach((icon) => {
      if (!icon) {
        return
      }

      gsap.to(icon, {
        scale: 1,
        y: 0,
        filter: 'brightness(1)',
        duration: 0.28,
        ease: 'power3.out',
      })
    })
  }

  const handleDockMove = (event) => {
    dockHoverActiveRef.current = true
    dockPointerXRef.current = event.clientX
    applyDockEffect(event.clientX)
  }

  useEffect(() => {
    const tick = () => {
      if (!dockHoverActiveRef.current || dockPointerXRef.current == null) {
        return
      }

      applyDockEffect(dockPointerXRef.current)
    }

    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
    }
  }, [])

  return (
    <div className="flex h-full flex-col">
      <div className="grid flex-1 grid-cols-1 gap-8 py-5 lg:grid-cols-[1.1fr_0.9fr] lg:py-8">
        <div className="flex min-w-0 flex-col rounded-[1.75rem] p-2">
          <p className="max-w-xl whitespace-pre-line text-base leading-8 text-slate-300">
            {section.description}
          </p>
        </div>

        <div className="grid gap-4 self-start lg:min-h-[26rem] lg:grid-rows-3 lg:gap-5">
          {section.items.map((item) => (
            <TaggedPoint key={item.tag} tag={item.tag} text={item.text} />
          ))}
        </div>
      </div>

      <div className="mt-auto w-full py-2">
        <div
          className="marquee-mask"
          onMouseMove={handleDockMove}
          onMouseLeave={resetDockEffect}
        >
          <div className="marquee-viewport">
            <div className="marquee-track items-center">
              {sliderCopies.map((copy) =>
                toolIcons.map((tool, index) => (
                  <div
                    key={`${copy}-${tool.name}-${index}`}
                    ref={(node) => {
                      const refIndex = (copy * toolIcons.length) + index
                      iconRefs.current[refIndex] = node
                    }}
                    className="flex h-14 w-14 shrink-0 items-center justify-center text-[#93a66b]"
                    aria-label={tool.name}
                    title={tool.name}
                    style={{ willChange: 'transform, filter' }}
                  >
                    {tool.icon}
                  </div>
                )),
              )}
            </div>
          </div>
        </div>
      </div>

      <div ref={mobilePurposeRef} className={`w-full border-t pt-6 lg:hidden ${
        isLightTheme ? 'border-[#7f886f]/40' : 'border-white/10'
      }`}>
        <div className="px-1">
          <p className={`text-[0.62rem] uppercase tracking-[0.28em] ${
            isLightTheme ? 'text-[#5f6850]' : 'text-white/40'
          }`}>
            Portfolio Purpose
          </p>
          <p className={`mt-2 max-w-[34rem] text-[0.92rem] leading-6 ${
            isLightTheme ? 'text-[#3f4635]' : 'text-white/68'
          }`}>
            This portfolio serves as a simple presentation of my work, skills, and growth as a
            frontend developer.
          </p>
        </div>
      </div>

      <div className="hidden lg:block">
        <SectionFooterCards theme={theme} />
      </div>

    </div>
  )
}

export default OverviewPage
