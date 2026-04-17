# HyperVision LED

Industrial LED display solutions website, built with Astro 6 and deployed on Cloudflare Workers.

## Tech Stack

- **Framework:** Astro 6 (SSR mode)
- **Styling:** Tailwind CSS 4
- **Runtime:** Cloudflare Workers (`@astrojs/cloudflare` adapter)
- **Database:** Cloudflare D1 (SQLite)
- **Storage:** Cloudflare R2 (file attachments)
- **Cache:** Cloudflare KV
- **Queue:** Cloudflare Queues (inquiry notifications)
- **Auth:** Cloudflare Access + JWT verification
- **Validation:** Zod 4

## Project Structure

```text
├── src/
│   ├── pages/            # Astro pages & API routes
│   │   ├── api/          # REST API endpoints
│   │   ├── zh/           # Chinese-language pages
│   │   └── admin/        # Admin dashboard
│   ├── components/       # Reusable Astro components
│   ├── layouts/          # Page layouts
│   ├── client/           # Client-side TypeScript
│   ├── lib/
│   │   ├── server/       # Server-side utilities (DB, auth, cache, validation)
│   │   ├── i18n.ts       # Internationalization (en/zh)
│   │   ├── seo.ts        # SEO helpers
│   │   └── visuals.ts    # Image assets
│   ├── styles/           # Global CSS (Tailwind entry)
│   └── middleware.ts     # Security headers middleware
├── workers/              # Cloudflare Queue consumer (separate worker)
├── db/                   # D1 schema and seed SQL
├── wrangler.toml         # Site worker config
└── wrangler.queue.toml   # Queue consumer config
```

## Development

```bash
npm install
npm run dev          # Start dev server at localhost:4321
```

Create a `.dev.vars` file from `.dev.vars.example` for local environment variables.

## Commands

| Command             | Action                          |
| :------------------ | :------------------------------ |
| `npm run dev`       | Start local dev server          |
| `npm run build`     | Build for production            |
| `npm run preview`   | Preview production build        |
| `npm run check`     | Run Astro type checks           |
| `npm run cf:types`  | Generate Wrangler binding types |
| `npm run cf:deploy` | Deploy to Cloudflare            |

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for Cloudflare setup instructions.
