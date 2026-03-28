import SectionFooterCards from '../components/SectionFooterCards'

function ContactPage({ section }) {
  return (
    <>
      <div className="grid flex-1 grid-cols-1 gap-8 py-8">
        <div className="w-full py-4">
          <p className="text-center text-sm leading-7 text-slate-300">{section.description}</p>
        </div>

        <div className="mx-auto mt-6 w-full max-w-[42rem] bg-white/[0.03] p-5">
          <div className="flex items-center justify-between border-b border-white/8 pb-4">
            <div>
              <p className="text-sm font-medium text-white">Inbox</p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">
                Chat Style Contact
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/70" />
              <span className="text-xs uppercase tracking-[0.16em] text-slate-500">Available</span>
            </div>
          </div>

          <div className="space-y-4 py-5">
            <div className="flex justify-start">
              <div className="max-w-[78%] rounded-[1.5rem] rounded-bl-sm bg-black/25 px-4 py-3 text-sm leading-7 text-slate-300">
                Hi Mark, I would like to ask about your frontend work and availability.
              </div>
            </div>

            <div className="flex justify-end">
              <div className="max-w-[74%] rounded-[1.5rem] rounded-br-sm bg-cyan-300/12 px-4 py-3 text-sm leading-7 text-cyan-50">
                You can send your message here and I will get back to you as soon as possible.
              </div>
            </div>

            <div className="flex justify-start">
              <div className="max-w-[70%] rounded-[1.5rem] rounded-bl-sm bg-black/25 px-4 py-3 text-sm leading-7 text-slate-300">
                Available through {section.items.join(', ')}.
              </div>
            </div>
          </div>

          <div className="border-t border-white/8 pt-4">
            <div className="rounded-[1.6rem] bg-black/25 px-4 py-3">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-slate-500">
                New Message
              </p>
              <div className="mt-3 flex items-end gap-3">
                <textarea
                  rows="3"
                  placeholder="Type your message here..."
                  className="min-h-[4.5rem] flex-1 resize-none bg-transparent text-sm leading-7 text-slate-200 outline-none placeholder:text-slate-500"
                />
                <button
                  type="button"
                  className="inline-flex h-11 items-center rounded-full bg-white/[0.08] px-5 text-sm text-slate-200 transition hover:bg-white/[0.12] hover:text-white"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SectionFooterCards />
    </>
  )
}

export default ContactPage
