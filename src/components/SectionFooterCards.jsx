function SectionFooterCards({ theme }) {
  const isLightTheme = theme === 'light'

  return (
    <div className={`grid grid-cols-[1.25fr_0.75fr] gap-6 pt-6 ${
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
  )
}

export default SectionFooterCards
