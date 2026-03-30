import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function SectionFooterCards({ theme }) {
  const isLightTheme = theme === 'light'
  const mobileFooterRef = useRef(null)

  useEffect(() => {
    const footerNode = mobileFooterRef.current

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

  return (
    <>
      <div ref={mobileFooterRef} className={`w-full border-t pt-6 lg:hidden ${
        isLightTheme ? 'border-[#7f886f]/40' : 'border-white/10'
      }`}>
        <div className="px-1">
          <p className={`text-sm leading-6 ${
            isLightTheme ? 'text-[#4e5641]' : 'text-white/58'
          }`}>
            2026 Mark Macaraig
          </p>
          <p className={`mt-1 max-w-[26ch] text-sm leading-6 ${
            isLightTheme ? 'text-[#6b735d]' : 'text-white/34'
          }`}>
            Frontend Developer based in the Philippines
          </p>
        </div>
      </div>

      <div className={`hidden grid-cols-1 gap-5 pt-6 lg:grid lg:grid-cols-[1.25fr_0.75fr] lg:gap-6 ${
        isLightTheme ? 'border-t border-[#7f886f]/40' : 'border-t border-white/10'
      }`}>
        <div className="px-1 pt-4">
          <p className={`text-[0.62rem] uppercase tracking-[0.28em] ${isLightTheme ? 'text-[#5f6850]' : 'text-white/40'}`}>Portfolio Purpose</p>
          <p className={`mt-2 text-[0.92rem] leading-6 ${isLightTheme ? 'text-[#3f4635]' : 'text-white/68'}`}>
            This portfolio serves as a simple presentation of my work, skills, and growth as a
            frontend developer.
          </p>
        </div>

        <div className="px-1 pt-4">
          <p className={`text-[0.62rem] uppercase tracking-[0.28em] ${isLightTheme ? 'text-[#5f6850]' : 'text-white/40'}`}>Profile Notes</p>
          <p className={`mt-2 text-[0.92rem] leading-6 ${isLightTheme ? 'text-[#3f4635]' : 'text-white/68'}`}>
            Key details can be updated over time while keeping the current layout and visual
            structure consistent.
          </p>
        </div>
      </div>
    </>
  )
}

export default SectionFooterCards
