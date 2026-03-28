import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { useRef, useState } from 'react'
import SectionFooterCards from '../components/SectionFooterCards'
import { socials } from '../data/siteContent'

gsap.registerPlugin(TextPlugin)

function ContactPage({ section, theme }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [sendSuccess, setSendSuccess] = useState('')
  const buttonTextRef = useRef(null)

  const handleMagneticMove = (event) => {
    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const offsetX = event.clientX - rect.left - (rect.width / 2)
    const offsetY = event.clientY - rect.top - (rect.height / 2)

    gsap.to(button, {
      x: offsetX * 0.16,
      y: offsetY * 0.2,
      duration: 0.28,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  }

  const resetMagneticButton = (event) => {
    gsap.to(event.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.45,
      ease: 'elastic.out(1, 0.5)',
      overwrite: 'auto',
    })
  }

  const playSendTimeline = ({ finalText = 'Sent!', onComplete }) => {
    const buttonNode = buttonTextRef.current

    if (!buttonNode) {
      onComplete()
      return
    }

    const timeline = gsap.timeline({
      defaults: {
        ease: 'sine.inOut',
      },
      onComplete,
    })

    timeline.to(buttonNode, {
      duration: 0.8,
      text: {
        value: 'Sending...',
        type: 'diff',
      },
      ease: 'sine.in',
    })

    timeline.to(buttonNode, {
      duration: 0.45,
      text: {
        value: 'Sending',
        type: 'diff',
      },
      ease: 'sine.inOut',
      repeat: 3,
      yoyo: true,
    })

    timeline.to(buttonNode, {
      duration: 0.2,
      text: {
        value: finalText,
        type: 'diff',
      },
      ease: 'none',
    }, '+=0.2')
  }

  const resetButtonLabel = (delay = 1400) => {
    const buttonNode = buttonTextRef.current
    window.setTimeout(() => {
      if (buttonNode) {
        gsap.set(buttonNode, { text: 'Send' })
      }
      setIsSending(false)
    }, delay)
  }

  const handleSend = () => {
    if (isSending) {
      return
    }

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedSubject = subject.trim()
    const trimmedMessage = message.trim()

    if (!trimmedMessage) {
      return
    }

    setIsSending(true)
    setSendError('')
    setSendSuccess('')

    playSendTimeline({
      onComplete: async () => {
        try {
          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: trimmedName,
              email: trimmedEmail,
              subject: trimmedSubject,
              message: trimmedMessage,
            }),
          })

          if (!response.ok) {
            const data = await response.json().catch(() => ({}))
            throw new Error(data?.error || 'Failed to send message')
          }

          setName('')
          setEmail('')
          setSubject('')
          setMessage('')
          setSendSuccess('Message sent successfully. I will get back to you soon.')
          resetButtonLabel()
        } catch (error) {
          const messageText = error instanceof Error ? error.message : 'Failed to send message'
          setSendError(messageText)
          setSendSuccess('')
          const buttonNode = buttonTextRef.current
          if (buttonNode) {
            gsap.set(buttonNode, { text: 'Retry' })
          }
          setIsSending(false)
        }
      },
    })
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col py-5 lg:py-8">
        <div className="contact-form-panel mx-auto my-auto w-full max-w-[42rem] p-4 sm:p-5 lg:p-6">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-white">Contact Form</p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/34">
                Professional Inquiry
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-white/50" />
              <span className="text-xs uppercase tracking-[0.16em] text-white/34">Available</span>
            </div>
          </div>

          <div className="grid gap-4 py-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-[0.68rem] uppercase tracking-[0.2em] text-white/34">Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  className="contact-form-field rounded-md border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white/86 outline-none transition placeholder:text-white/30 focus:border-white/20"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[0.68rem] uppercase tracking-[0.2em] text-white/34">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="contact-form-field rounded-md border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white/86 outline-none transition placeholder:text-white/30 focus:border-white/20"
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-[0.68rem] uppercase tracking-[0.2em] text-white/34">Subject</span>
              <input
                type="text"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Project inquiry"
                className="contact-form-field rounded-md border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white/86 outline-none transition placeholder:text-white/30 focus:border-white/20"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-[0.68rem] uppercase tracking-[0.2em] text-white/34">Message</span>
              <textarea
                rows="6"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write your message here..."
                className="contact-form-field min-h-[10rem] resize-none rounded-md border border-white/10 bg-white/[0.035] px-4 py-3 text-sm leading-7 text-white/86 outline-none transition placeholder:text-white/30 focus:border-white/20"
              ></textarea>
            </label>

            {sendSuccess ? (
              <p className="rounded-md border border-[#93a66b]/28 bg-[#93a66b]/10 px-4 py-3 text-sm text-[#d8e6bf]">
                {sendSuccess}
              </p>
            ) : null}

            {sendError ? (
              <p className="rounded-md border border-[#d8a29d]/28 bg-[#d8a29d]/10 px-4 py-3 text-sm text-[#f0c5c0]">
                {sendError}
              </p>
            ) : null}

            <div className="flex flex-col gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 text-sm text-white/52">
                <span>Available through</span>
                <div className="flex items-center gap-3">
                  {socials.map((social) => (
                    <a
                      key={social.id}
                      href={social.id === 'gmail' ? 'mailto:itsmarkmacaraig@gmail.com' : social.href}
                      aria-label={social.label}
                      className="text-white/58 transition hover:text-white"
                    >
                      <span className="flex h-5 w-5 items-center justify-center">
                        {social.icon}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={handleSend}
                onMouseMove={handleMagneticMove}
                onMouseLeave={resetMagneticButton}
                className="inline-flex h-11 items-center justify-center rounded-md border border-white/12 bg-white/[0.04] px-5 text-sm text-slate-100 transition hover:bg-[#93a66b]/12 hover:text-white"
              >
                <span ref={buttonTextRef} className="inline-flex items-center">
                  Send
                </span>
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
