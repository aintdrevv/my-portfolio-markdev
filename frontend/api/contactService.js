const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export class ContactError extends Error {
  constructor(message, status = 500) {
    super(message)
    this.name = 'ContactError'
    this.status = status
  }
}

export function validateContactPayload(payload = {}) {
  const trimmedName = String(payload.name ?? '').trim()
  const trimmedEmail = String(payload.email ?? '').trim()
  const trimmedSubject = String(payload.subject ?? '').trim()
  const trimmedMessage = String(payload.message ?? '').trim()

  if (!trimmedMessage) {
    throw new ContactError('Message is required', 400)
  }

  if (trimmedEmail && !EMAIL_PATTERN.test(trimmedEmail)) {
    throw new ContactError('Please enter a valid email address', 400)
  }

  return {
    name: trimmedName,
    email: trimmedEmail,
    subject: trimmedSubject,
    message: trimmedMessage,
  }
}

export async function sendContactEmail(payload, env = globalThis.process?.env ?? {}, fetchImpl = fetch) {
  const resendApiKey = env.RESEND_API_KEY
  const from = env.RESEND_FROM_EMAIL
  const to = env.CONTACT_TO_EMAIL

  if (!resendApiKey || !from || !to) {
    throw new ContactError('Missing email configuration', 500)
  }

  const { name, email, subject, message } = validateContactPayload(payload)
  const emailLines = [
    name ? `Name: ${name}` : null,
    email ? `Email: ${email}` : null,
    '',
    message,
  ].filter(Boolean)

  const resendResponse = await fetchImpl('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email || undefined,
      subject: subject || 'Portfolio Inquiry',
      text: emailLines.join('\n'),
    }),
  })

  const resendData = await resendResponse.json().catch(() => ({}))

  if (!resendResponse.ok) {
    throw new ContactError(resendData?.message || 'Failed to send email', resendResponse.status)
  }

  return { ok: true, id: resendData?.id ?? null }
}
