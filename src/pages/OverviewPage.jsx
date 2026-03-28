import SectionFooterCards from '../components/SectionFooterCards'
import TaggedPoint from '../components/TaggedPoint'

function OverviewPage({ section, sliderCopies, toolIcons }) {
  return (
    <div className="flex h-full flex-col">
      <div className="grid flex-1 grid-cols-[1.1fr_0.9fr] gap-8 py-8">
        <div className="flex min-w-0 flex-col rounded-[1.75rem] p-2">
          <p className="max-w-xl whitespace-pre-line text-base leading-8 text-slate-300">
            {section.description}
          </p>
        </div>

        <div className="grid min-h-[26rem] grid-rows-3 gap-5 self-start">
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
                    className="flex h-14 w-14 shrink-0 items-center justify-center text-slate-200"
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

      <SectionFooterCards />
    </div>
  )
}

export default OverviewPage
