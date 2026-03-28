import SectionFooterCards from '../components/SectionFooterCards'

function SkillsPage({ section }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="flex h-full flex-col">
          <div className="w-full pt-8 pb-4">
            <div className="w-full max-w-[48rem] px-5 py-4">
              <p className="max-w-[36rem] text-left text-base leading-8 text-slate-300">
                {section.description}
              </p>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 justify-center pt-4 pb-0">
            <div className="min-h-0 w-full max-w-[74rem] overflow-y-auto pr-2">
              <div className="flex flex-col gap-4">
                {section.groups.map((group) => {
                  const groupData =
                    group.title === 'Frontend'
                      ? {
                          positions: [
                            'md:col-span-1 md:row-span-2',
                            'md:col-span-1 md:row-span-1 md:col-start-2 md:row-start-1',
                            'md:col-span-1 md:row-span-1 md:col-start-3 md:row-start-1',
                            'md:col-span-1 md:row-span-1 md:col-start-4 md:row-start-1',
                            'md:col-span-2 md:row-span-1 md:col-start-2 md:row-start-2 md:self-center',
                            'md:col-span-1 md:row-span-1 md:col-start-4 md:row-start-2',
                            'md:col-span-1 md:row-span-1 md:col-start-1 md:row-start-3',
                            'md:col-span-1 md:row-span-1 md:col-start-3 md:row-start-3',
                            'md:col-span-1 md:row-span-1 md:col-start-4 md:row-start-3',
                          ],
                          items: [
                            { label: group.items[0], size: 'normal' },
                            { label: group.items[1], size: 'normal' },
                            { label: group.items[2], size: 'mini' },
                            { type: 'split' },
                            { label: group.title, size: 'title' },
                            { label: group.items[5], size: 'normal' },
                            { label: group.items[6], size: 'normal' },
                            { label: group.items[7], size: 'mini' },
                            { label: group.items[8], size: 'empty' },
                          ],
                        }
                      : group.title === 'Tools'
                        ? {
                            positions: [
                              'md:col-span-1 md:row-span-1 md:col-start-2 md:row-start-1',
                              'md:col-span-1 md:row-span-2 md:col-start-4 md:row-start-1',
                              'md:col-span-2 md:row-span-1 md:col-start-1 md:row-start-1',
                              'md:col-span-2 md:row-span-1 md:col-start-2 md:row-start-2 md:self-center',
                              'md:col-span-1 md:row-span-1 md:col-start-1 md:row-start-2',
                              'md:col-span-1 md:row-span-1 md:col-start-4 md:row-start-3',
                              'md:col-span-1 md:row-span-1 md:col-start-2 md:row-start-3',
                              'md:col-span-1 md:row-span-1 md:col-start-3 md:row-start-3',
                              'md:col-span-1 md:row-span-1 md:col-start-1 md:row-start-3',
                            ],
                            items: [
                              { type: 'skip' },
                              { label: group.items[1], size: 'normal' },
                              { type: 'toolsTriple' },
                              { label: group.title, size: 'title' },
                              { label: group.items[3], size: 'normal' },
                              { label: group.items[4], size: 'mini' },
                              { type: 'toolsSmallPair' },
                              { type: 'skip' },
                              { label: group.items[7], size: 'mini' },
                            ],
                          }
                        : {
                            positions: [
                              'md:col-span-1 md:row-span-1 md:col-start-3 md:row-start-1',
                              'md:col-span-1 md:row-span-1 md:col-start-1 md:row-start-1',
                              'md:col-span-1 md:row-span-2 md:col-start-4 md:row-start-1',
                              'md:col-span-2 md:row-span-1 md:col-start-2 md:row-start-2 md:self-center',
                              'md:col-span-1 md:row-span-1 md:col-start-1 md:row-start-2',
                              'md:col-span-1 md:row-span-1 md:col-start-2 md:row-start-1',
                              'md:col-span-1 md:row-span-1 md:col-start-1 md:row-start-3',
                              'md:col-span-1 md:row-span-1 md:col-start-2 md:row-start-3',
                              'md:col-span-1 md:row-span-1 md:col-start-3 md:row-start-3',
                            ],
                            items: [
                              { label: group.items[0], size: 'mini' },
                              { label: group.items[1], size: 'normal' },
                              { label: group.items[2], size: 'normal' },
                              { label: group.title, size: 'title' },
                              { label: group.items[3], size: 'normal' },
                              { label: group.items[4], size: 'mini' },
                              { label: group.items[5], size: 'normal' },
                              { label: group.items[6], size: 'mini' },
                              { label: group.items[7], size: 'normal' },
                            ],
                          }

                  return (
                    <article
                      key={group.title}
                      className="grid min-h-[18rem] grid-cols-1 gap-2.5 md:grid-cols-4 md:grid-rows-3"
                    >
                      {groupData.items.map((item, index) => {
                        if (item.type === 'split') {
                          return (
                            <div key={`${group.title}-split`} className={`grid grid-cols-2 gap-2 ${groupData.positions[index]}`}>
                              <div className="rounded-[1.05rem] bg-white/[0.03] p-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
                                <div className="rounded-[0.85rem] bg-black/20 px-3 py-2 text-sm text-slate-300">
                                  {group.items[3]}
                                </div>
                              </div>
                              <div className="rounded-[1.05rem] bg-white/[0.03] p-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
                                <div className="rounded-[0.85rem] bg-black/20 px-3 py-2 text-sm text-slate-300" />
                              </div>
                            </div>
                          )
                        }

                        if (item.type === 'toolsTriple') {
                          return (
                            <div key={`${group.title}-tools-triple`} className={`grid grid-cols-[0.9fr_2.1fr] gap-2 ${groupData.positions[index]}`}>
                              <div className="rounded-[1.05rem] bg-white/[0.03] p-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
                                <div className="rounded-[0.85rem] bg-black/20 px-3 py-2 text-sm text-slate-300">
                                  {group.items[0]}
                                </div>
                              </div>
                              <div className="rounded-[1.05rem] bg-white/[0.03] p-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
                                <div className="rounded-[0.85rem] bg-black/20 px-3 py-2 text-sm text-slate-300">
                                  {group.items[2]}
                                </div>
                              </div>
                            </div>
                          )
                        }

                        if (item.type === 'toolsSmallPair') {
                          return (
                            <div key={`${group.title}-tools-small-pair`} className={`grid grid-cols-2 gap-2 ${groupData.positions[index]}`}>
                              <div className="rounded-[1.05rem] bg-white/[0.03] p-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
                                <div className="rounded-[0.85rem] bg-black/20 px-3 py-2 text-sm text-slate-300">
                                  {group.items[5]}
                                </div>
                              </div>
                              <div className="rounded-[1.05rem] bg-white/[0.03] p-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
                                <div className="rounded-[0.85rem] bg-black/20 px-3 py-2 text-sm text-slate-300">
                                  {group.items[6]}
                                </div>
                              </div>
                            </div>
                          )
                        }

                        if (item.type === 'skip') return null

                        if (item.size === 'title') {
                          return (
                            <div
                              key={`${group.title}-${index}`}
                              className={`rounded-[1.3rem] bg-white/[0.035] p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.22)] ${groupData.positions[index]}`}
                            >
                              <div className="flex h-full items-center justify-center text-center">
                                <h3 className="text-[1.35rem] font-semibold tracking-[-0.05em] text-white">
                                  {item.label}
                                </h3>
                              </div>
                            </div>
                          )
                        }

                        if (item.size === 'empty') {
                          return (
                            <div
                              key={`${group.title}-${index}`}
                              className={`rounded-[1.05rem] bg-white/[0.03] p-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.18)] ${groupData.positions[index]}`}
                            >
                              <div className="rounded-[0.85rem] bg-black/20 px-3 py-2 text-sm text-slate-300" />
                            </div>
                          )
                        }

                        const outerClass =
                          item.size === 'mini'
                            ? 'rounded-[1.05rem] bg-white/[0.03] p-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.18)]'
                            : 'rounded-[1.2rem] bg-white/[0.03] p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.18)]'
                        const innerClass =
                          item.size === 'mini'
                            ? 'rounded-[0.85rem] bg-black/20 px-3 py-2 text-sm text-slate-300'
                            : 'rounded-[0.95rem] bg-black/20 px-3 py-2.5 text-sm text-slate-300'

                        return (
                          <div
                            key={`${group.title}-${index}`}
                            className={`${outerClass} ${groupData.positions[index]}`}
                          >
                            <div className={innerClass}>{item.label}</div>
                          </div>
                        )
                      })}
                    </article>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SectionFooterCards />
    </div>
  )
}

export default SkillsPage
