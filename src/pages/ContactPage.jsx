import { useState } from 'react'
import SectionFooterCards from '../components/SectionFooterCards'

function ContactPage({ section, theme }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const handleSend = () => {
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedSubject = subject.trim()
    const trimmedMessage = message.trim()

    if (!trimmedMessage) {
      return
    }

    const body = [
      trimmedName ? `Name: ${trimmedName}` : null,
      trimmedEmail ? `Email: ${trimmedEmail}` : null,
      '',
      trimmedMessage,
    ]
      .filter(Boolean)
      .join('\n')

    const mailtoUrl = `mailto:itsmarkmacaraig@gmail.com?subject=${encodeURIComponent(trimmedSubject || 'Portfolio Inquiry')}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoUrl
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col py-8">
        <div className="contact-form-panel mx-auto my-auto w-full max-w-[42rem] p-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-sm font-medium text-white">Contact Form</p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">
                Professional Inquiry
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-white/50" />
              <span className="text-xs uppercase tracking-[0.16em] text-slate-500">Available</span>
            </div>
          </div>

          <div className="grid gap-4 py-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-[0.68rem] uppercase tracking-[0.2em] text-slate-500">Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  className="border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-white/20"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[0.68rem] uppercase tracking-[0.2em] text-slate-500">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-white/20"
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-[0.68rem] uppercase tracking-[0.2em] text-slate-500">Subject</span>
              <input
                type="text"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Project inquiry"
                className="border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-white/20"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-[0.68rem] uppercase tracking-[0.2em] text-slate-500">Message</span>
              <textarea
                rows="6"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write your message here..."
                className="min-h-[10rem] resize-none border border-white/10 bg-white/[0.035] px-4 py-3 text-sm leading-7 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-white/20"
              />
            </label>

            <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4">
              <p className="text-sm leading-6 text-slate-400">
                Available through {section.items.join(', ')}.
              </p>
              <button
                type="button"
                onClick={handleSend}
                className="inline-flex h-11 items-center border border-white/12 bg-white/[0.04] px-5 text-sm text-slate-100 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <SectionFooterCards theme={theme} />
    </div>
  )
}

export default ContactPage
