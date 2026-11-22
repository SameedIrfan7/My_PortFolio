# My_PortFolio
# Build and Deploy an Amazing 3D Developer Portfolio in React with Three.js

## Contact form configuration

Copy `.env.example` to `.env`, set the variables, then run `vercel dev` so the
contact API is available locally. The EmailJS credentials and Turnstile secret
are server-only; configure them as Vercel environment variables as well.
`VITE_TURNSTILE_SITE_KEY` is a public Turnstile site key. Add the deployed
hostname to `CONTACT_ALLOWED_ORIGINS`.

