export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const resendApiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  const to = process.env.CONTACT_TO_EMAIL

  if (!resendApiKey || !from || !to) {
    return res.status(500).json({ error: 'Missing email configuration' })
  }

  try {
    const { name = '', email = '', subject = '', message = '' } = req.body ?? {}

    const trimmedName = String(name).trim()
    const trimmedEmail = String(email).trim()
    const trimmedSubject = String(subject).trim()
    const trimmedMessage = String(message).trim()

    if (!trimmedMessage) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const emailLines = [
      trimmedName ? `Name: ${trimmedName}` : null,
      trimmedEmail ? `Email: ${trimmedEmail}` : null,
      '',
      trimmedMessage,
    ].filter(Boolean)

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: trimmedEmail || undefined,
        subject: trimmedSubject || 'Portfolio Inquiry',
        text: emailLines.join('\n'),
      }),
    })

    const resendData = await resendResponse.json()

    if (!resendResponse.ok) {
      return res.status(resendResponse.status).json({
        error: resendData?.message || 'Failed to send email',
      })
    }

    return res.status(200).json({ ok: true, id: resendData?.id ?? null })
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unexpected server error',
    })
  }
}
