# Strucmind.ai Website (production deploy)

This repo holds the **built, static production site** served at https://strucmind.ai
via Netlify (auto-deploys on every push to `main`).

## Source code

Do NOT edit `index.html` or anything in `assets/` by hand — they are build
artifacts. The actual source lives in the
[strucmind-website](https://github.com/strucmindai/strucmind-website) repo
(React + Vite + Tailwind).

## Publishing a new version

```sh
# in the strucmind-website repo
pnpm install
pnpm run build        # outputs to dist/public

# copy dist/public contents into this repo (keep robots.txt, sitemap.xml,
# 404.html, netlify.toml and the google*.html verification file), then:
git add -A && git commit -m "deploy: <description>" && git push
```

## Files that belong to THIS repo (not the build)

- `netlify.toml` — security headers + caching
- `robots.txt`, `sitemap.xml` — SEO (update `lastmod` when deploying)
- `404.html` — self-contained not-found page
- `google4535a08b6834a1fb.html` — Google Search Console verification

## Forms

The quote form posts to **Netlify Forms** (form name: `quote-request`).
Form detection must be enabled in Netlify → Site configuration → Forms,
and submissions appear in the Netlify dashboard under Forms.

## Contact

- Phone: 407-686-5270
- Email: contact@strucmind.ai
- Booking: calendly.com/contact-strucmind/30min
