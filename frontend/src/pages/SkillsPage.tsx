import gsap from 'gsap'
import { useEffect, useRef } from 'react'

const ACCENT = '#7f8f5c'

function CellBar() {
  return (
    <div className="absolute inset-x-0 top-0 h-[2px] bg-white/14 transition duration-300 group-hover:bg-[#93a66b]" />
  )
}

function CellSurface() {
  return <div aria-hidden="true" className="bento-card-surface" />
}

function CellSpotlight() {
  return (
    <div aria-hidden="true" className="bento-card-spotlight-mask">
      <div data-card-spotlight className="bento-card-spotlight" />
    </div>
  )
}

function Pill({ label }) {
  return (
    <span className="border border-white/10 bg-white/[0.03] px-2 py-1 font-dm-mono text-[8px] uppercase tracking-[0.07em] text-white/52">
      {label}
    </span>
  )
}

function HeroCell({ title, description, pills, sub, className, containerRef, onMouseMove, onMouseLeave }) {
  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`group relative flex min-h-[10.75rem] flex-col justify-between overflow-hidden border border-white/8 bg-transparent px-4 py-3.5 transition duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:border-white/14 ${className}`}
    >
      <CellSpotlight />
      <CellSurface />
      <CellBar />
      <div className="relative z-10">
        <div
          className="font-bebas text-[1.4rem] uppercase leading-none tracking-[0.05em] text-[#93a66b]"
          style={{ color: ACCENT }}
        >
          {title}
        </div>
        <p className="mt-2 max-w-[13rem] font-space-grotesk text-[9px] font-light leading-5 text-white/35">
          {description}
        </p>
        <div className="mt-4 flex flex-wrap gap-[5px]">
          {pills.map((pill) => (
            <Pill key={pill} label={pill} />
          ))}
        </div>
      </div>
      <div className="relative z-10 mt-3 font-dm-mono text-[8px] uppercase tracking-[0.12em] text-white/20">{sub}</div>
    </div>
  )
}

function SkillCell({ label, sub, className, mini = false, containerRef, onMouseMove, onMouseLeave }) {
  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`group relative flex flex-col justify-end overflow-hidden border border-white/8 bg-transparent px-4 transition duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-white/14 ${mini ? 'min-h-[2.8rem] py-2' : 'min-h-[4rem] py-2.5'} ${className}`}
    >
      <CellSpotlight />
      <CellSurface />
      <CellBar />
      <div className={`${mini ? 'text-[9px]' : 'text-[11px]'} relative z-10 font-space-grotesk font-medium text-white/70`}>
        {label}
      </div>
      {sub ? (
        <div className="relative z-10 mt-1 font-dm-mono text-[8px] uppercase tracking-[0.1em] text-white/20">{sub}</div>
      ) : null}
    </div>
  )
}

function WideCell({ title, pills, sub, className, topAlign = false, containerRef, onMouseMove, onMouseLeave }) {
  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`group relative flex justify-between overflow-hidden border border-white/8 bg-transparent px-4 py-3 transition duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:border-white/14 ${topAlign ? 'items-start' : 'items-end'} ${className}`}
    >
      <CellSpotlight />
      <CellSurface />
      <CellBar />
      <div className="relative z-10">
        <div
          className="font-bebas text-[1.3rem] uppercase leading-none tracking-[0.05em] text-[#93a66b]"
          style={{ color: ACCENT }}
        >
          {title}
        </div>
        <div className="mt-3 flex flex-wrap gap-[5px]">
          {pills.map((pill) => (
            <Pill key={pill} label={pill} />
          ))}
        </div>
      </div>
      <div className="relative z-10 font-dm-mono text-[8px] uppercase tracking-[0.12em] text-white/20">{sub}</div>
    </div>
  )
}

function MarqueeCell({ className, containerRef, onMouseMove, onMouseLeave }) {
  const items = ['TypeScript', 'Next.js', 'Node.js', 'PostgreSQL', 'Framer Motion', 'GSAP', 'React Native']
  const doubled = [...items, ...items]

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`group relative overflow-hidden flex min-h-[4.2rem] flex-col justify-between border border-white/8 bg-transparent px-4 py-3 transition duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:border-white/14 ${className}`}
    >
      <CellSpotlight />
      <CellSurface />
      <CellBar />
      <style>{`@keyframes skills-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
      <div className="relative z-10 font-dm-mono text-[8px] uppercase tracking-[0.14em] text-white/45">
        Currently Learning
      </div>
      <div className="relative z-10 overflow-hidden whitespace-nowrap">
        <div
          className="inline-block"
          style={{ animation: 'skills-marquee 14s linear infinite' }}
        >
          {doubled.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="mr-4 font-dm-mono text-[8px] uppercase tracking-[0.1em] text-white/25"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function SkillsPage() {
  const cellRefs = useRef([])
  const cellMotionRef = useRef(new WeakMap())
  const spotlightMotionRef = useRef(new WeakMap())

  useEffect(() => {
    const cells = cellRefs.current.filter(Boolean)

    if (!cells.length) {
      return undefined
    }

    gsap.fromTo(
      cells,
      {
        autoAlpha: 0,
        y: 42,
        scale: 0.96,
      },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.85,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'opacity,visibility,transform',
      },
    )

    return () => {
      gsap.killTweensOf(cells)
    }
  }, [])

  const registerCell = (index) => (node) => {
    cellRefs.current[index] = node
  }

  const getCellMotion = (cell) => {
    let motion = cellMotionRef.current.get(cell)

    if (!motion) {
      motion = {
        xTo: gsap.quickTo(cell, 'x', { duration: 0.28, ease: 'power3.out' }),
        yTo: gsap.quickTo(cell, 'y', { duration: 0.28, ease: 'power3.out' }),
      }
      cellMotionRef.current.set(cell, motion)
    }

    return motion
  }

  const getSpotlightMotion = (spotlight) => {
    let motion = spotlightMotionRef.current.get(spotlight)

    if (!motion) {
      motion = {
        xTo: gsap.quickTo(spotlight, 'x', { duration: 0.22, ease: 'power3.out' }),
        yTo: gsap.quickTo(spotlight, 'y', { duration: 0.22, ease: 'power3.out' }),
        opacityTo: gsap.quickTo(spotlight, 'autoAlpha', { duration: 0.22, ease: 'power3.out' }),
      }
      spotlightMotionRef.current.set(spotlight, motion)
    }

    return motion
  }

  const handleCellMove = (event) => {
    const cell = event.currentTarget
    const rect = cell.getBoundingClientRect()
    const pointerX = ((event.clientX - rect.left) / rect.width) - 0.5
    const pointerY = ((event.clientY - rect.top) / rect.height) - 0.5
    const spotlight = cell.querySelector('[data-card-spotlight]')
    const localX = event.clientX - rect.left
    const localY = event.clientY - rect.top

    const cellMotion = getCellMotion(cell)
    cellMotion.xTo(pointerX * 10)
    cellMotion.yTo(pointerY * 8)

    if (spotlight) {
      const spotlightMotion = getSpotlightMotion(spotlight)
      spotlightMotion.xTo(localX)
      spotlightMotion.yTo(localY)
      spotlightMotion.opacityTo(1)
    }
  }

  const resetCellMove = (event) => {
    const cell = event.currentTarget
    const spotlight = cell.querySelector('[data-card-spotlight]')

    const cellMotion = getCellMotion(cell)
    cellMotion.xTo(0)
    cellMotion.yTo(0)

    if (spotlight) {
      const spotlightMotion = getSpotlightMotion(spotlight)
      spotlightMotion.opacityTo(0)
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="flex h-full min-h-0 flex-1 items-center justify-center py-3 lg:py-2">
        <div className="flex w-full items-center justify-center">
          <div className="grid w-full max-w-[66rem] grid-cols-1 gap-2 pr-2 md:grid-cols-4">
            <HeroCell
              containerRef={registerCell(0)}
              onMouseMove={handleCellMove}
              onMouseLeave={resetCellMove}
              title="Frontend"
              description="Focused on building clean, responsive interfaces with modern frontend tools."
              pills={['HTML', 'CSS', 'JavaScript', 'React', 'Vite']}
              sub="core stack"
              className="order-1 md:order-none md:col-span-2 md:row-span-2"
            />
            <SkillCell containerRef={registerCell(1)} onMouseMove={handleCellMove} onMouseLeave={resetCellMove} label="React" sub="framework" className="order-2 md:order-none md:col-span-1" />
            <SkillCell containerRef={registerCell(2)} onMouseMove={handleCellMove} onMouseLeave={resetCellMove} label="Tailwind" sub="styling" className="order-3 md:order-none md:col-span-1" />
            <SkillCell containerRef={registerCell(3)} onMouseMove={handleCellMove} onMouseLeave={resetCellMove} label="Vite" sub="bundler" className="order-4 md:order-none md:col-span-1" />
            <SkillCell containerRef={registerCell(4)} onMouseMove={handleCellMove} onMouseLeave={resetCellMove} label="JavaScript" sub="language" className="order-5 md:order-none md:col-span-1" />

            <SkillCell containerRef={registerCell(5)} onMouseMove={handleCellMove} onMouseLeave={resetCellMove} label="GitHub" sub="versioning" className="order-7 md:order-none md:col-span-1" />
            <SkillCell containerRef={registerCell(6)} onMouseMove={handleCellMove} onMouseLeave={resetCellMove} label="VS Code" sub="editor" className="order-8 md:order-none md:col-span-1" />
            <HeroCell
              containerRef={registerCell(7)}
              onMouseMove={handleCellMove}
              onMouseLeave={resetCellMove}
              title="Tools"
              description="Workflow and build tools I use while developing and iterating on projects."
              pills={['Cursor', 'GitHub', 'VS Code', 'Figma', 'npm']}
              sub="workflow"
              className="order-6 md:order-none md:col-span-2 md:row-span-2"
            />
            <SkillCell containerRef={registerCell(8)} onMouseMove={handleCellMove} onMouseLeave={resetCellMove} label="Figma" sub="design" className="order-9 md:order-none md:col-span-1" />
            <SkillCell containerRef={registerCell(9)} onMouseMove={handleCellMove} onMouseLeave={resetCellMove} label="Blender" sub="3D" className="order-10 md:order-none md:col-span-1" />

            <WideCell
              containerRef={registerCell(10)}
              onMouseMove={handleCellMove}
              onMouseLeave={resetCellMove}
              title="Styling"
              pills={['Tailwind CSS', 'Grid', 'Flexbox', 'Typography']}
              sub="ui system"
              className="order-11 md:order-none md:col-span-2"
            />
            <WideCell
              containerRef={registerCell(11)}
              onMouseMove={handleCellMove}
              onMouseLeave={resetCellMove}
              title="3D / Design"
              pills={['Blender', 'Three.js', 'WebGL', 'GSAP']}
              sub="creative"
              topAlign
              className="order-12 md:order-none md:col-span-2"
            />

            <SkillCell containerRef={registerCell(12)} onMouseMove={handleCellMove} onMouseLeave={resetCellMove} label="Terminal" sub="cli" className="order-13 md:order-none md:col-span-1" mini />
            <SkillCell containerRef={registerCell(13)} onMouseMove={handleCellMove} onMouseLeave={resetCellMove} label="npm" sub="packages" className="order-14 md:order-none md:col-span-1" mini />
            <MarqueeCell containerRef={registerCell(14)} onMouseMove={handleCellMove} onMouseLeave={resetCellMove} className="order-15 md:order-none md:col-span-2" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkillsPage
