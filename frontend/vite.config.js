import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { ContactError, sendContactEmail } from './api/contactService.js'

const readJsonBody = (req) => new Promise((resolve, reject) => {
  let body = ''

  req.on('data', (chunk) => {
    body += chunk
  })

  req.on('end', () => {
    if (!body) {
      resolve({})
      return
    }

    try {
      resolve(JSON.parse(body))
    } catch {
      reject(new ContactError('Invalid JSON body', 400))
    }
  })

  req.on('error', reject)
})

const contactDevApiPlugin = () => ({
  name: 'contact-dev-api',
  configureServer(server) {
    server.middlewares.use('/api/contact', async (req, res) => {
      if (req.method === 'OPTIONS') {
        res.statusCode = 204
        res.end()
        return
      }

      if (req.method !== 'POST') {
        res.statusCode = 405
        res.setHeader('Allow', 'POST')
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'Method not allowed' }))
        return
      }

      try {
        const body = await readJsonBody(req)
        const result = await sendContactEmail(body)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(result))
      } catch (error) {
        res.statusCode = error instanceof ContactError ? error.status : 500
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({
          error: error instanceof Error ? error.message : 'Unexpected server error',
        }))
      }
    })
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), contactDevApiPlugin()],
})
