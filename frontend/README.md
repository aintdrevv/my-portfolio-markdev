# My Profile Frontend

Frontend portfolio app built with React, Vite, Tailwind CSS, and GSAP.

## Run Locally

Install dependencies and start the Vite dev server:

```bash
npm install
npm run dev
```

## Contact Form

The contact form posts to `/api/contact`.

- In local development, Vite serves that endpoint through a dev middleware in [`vite.config.js`](./vite.config.js).
- In production, the serverless handler in [`api/contact.js`](./api/contact.js) should be deployed on a platform that supports API functions, such as Vercel.
- In a static-only deployment, the frontend will load but the contact form will not be able to send messages.

Create a `.env.local` file with:

```env
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=your_verified_sender@example.com
CONTACT_TO_EMAIL=your_inbox@example.com
```

## Notes

- The contact form requires a message.
- If an email is provided, it must be a valid email address.
- The projects section attempts to load remote project images from Xano and falls back to local images if that request fails.
