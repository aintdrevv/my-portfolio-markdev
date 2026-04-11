const footerSections = [
  {
    title: 'Portfolio Purpose',
    body: 'This portfolio serves as a simple presentation of my work, skills, and growth as a frontend developer.',
  },
  {
    title: 'Profile Notes',
    body: 'Key details can be updated over time while keeping the current layout and visual structure consistent.',
  },
]

function SectionFooterCards({ theme }) {
  const isLightTheme = theme === 'light'
  const borderClass = isLightTheme ? 'border-[#7f886f]/40' : 'border-white/10'
  const primaryTextClass = isLightTheme ? 'text-[#4e5641]' : 'text-white/58'
  const secondaryTextClass = isLightTheme ? 'text-[#6b735d]' : 'text-white/34'
  const labelClass = isLightTheme ? 'text-[#5f6850]' : 'text-white/40'
  const bodyClass = isLightTheme ? 'text-[#3f4635]' : 'text-white/68'

  return (
    <>
      <div className={`w-full border-t pt-5 lg:hidden ${borderClass}`}>
        <div className="px-1">
          <p className={`text-[0.82rem] leading-5 ${primaryTextClass}`}>
            2026 Mark Macaraig
          </p>
          <p className={`mt-1 max-w-[26ch] text-[0.78rem] leading-5 ${secondaryTextClass}`}>
            Frontend Developer based in the Philippines
          </p>
        </div>
      </div>

      <div className={`hidden grid-cols-1 gap-4 border-t pt-5 lg:grid lg:grid-cols-[1.25fr_0.75fr] lg:gap-5 ${borderClass}`}>
        {footerSections.map((section) => (
          <div key={section.title} className="px-1 pt-3">
            <p className={`text-[0.54rem] uppercase tracking-[0.22em] ${labelClass}`}>{section.title}</p>
            <p className={`mt-1.5 text-[0.8rem] leading-5 ${bodyClass}`}>{section.body}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default SectionFooterCards
