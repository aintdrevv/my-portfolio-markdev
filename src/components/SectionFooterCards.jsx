function SectionFooterCards({ theme }) {
  const isLightTheme = theme === 'light'

  return (
    <div className="grid grid-cols-[1.25fr_0.75fr] gap-8 pt-8">
      <div className={`border-t px-1 pt-5 ${isLightTheme ? 'border-[#7f886f]/40' : 'border-white/10'}`}>
        <p className={`text-[0.68rem] uppercase tracking-[0.3em] ${isLightTheme ? 'text-[#5f6850]' : 'text-slate-500'}`}>Portfolio Purpose</p>
        <p className={`mt-3 text-sm leading-7 ${isLightTheme ? 'text-[#3f4635]' : 'text-slate-300'}`}>
          This portfolio serves as a simple presentation of my work, skills, and growth as a
          frontend developer.
        </p>
      </div>

      <div className={`border-t px-1 pt-5 ${isLightTheme ? 'border-[#7f886f]/40' : 'border-white/10'}`}>
        <p className={`text-[0.68rem] uppercase tracking-[0.3em] ${isLightTheme ? 'text-[#5f6850]' : 'text-slate-500'}`}>Next</p>
        <p className={`mt-3 text-sm leading-7 ${isLightTheme ? 'text-[#3f4635]' : 'text-slate-300'}`}>
          We can swap in your real name, image, skills, and project entries next without changing
          the overall design.
        </p>
      </div>
    </div>
  )
}

export default SectionFooterCards
