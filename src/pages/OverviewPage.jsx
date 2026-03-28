import SectionFooterCards from '../components/SectionFooterCards'

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
        <div className="marquee-mask">
          <div className="marquee-viewport">
            <div className="marquee-track items-center">
              {sliderCopies.map((copy) =>
                toolIcons.map((tool, index) => (
                  <div
                    key={`${copy}-${tool.name}-${index}`}
                    className="flex h-14 w-14 shrink-0 items-center justify-center text-[#93a66b]"
                    aria-label={tool.name}
                    title={tool.name}
                  >
                    {tool.icon}
                  </div>
                )),
              )}
            </div>
          </div>
        </div>
      </div>

      <SectionFooterCards theme={theme} />
    </div>
  )
}

export default OverviewPage
