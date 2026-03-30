import { ContactError, sendContactEmail } from './contactService.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const result = await sendContactEmail(req.body ?? {})
    return res.status(200).json(result)
  } catch (error) {
    const statusCode = error instanceof ContactError ? error.status : 500
    return res.status(statusCode).json({
      error: error instanceof ContactError || error instanceof Error
        ? error.message
        : 'Unexpected server error',
    })
  }
}
