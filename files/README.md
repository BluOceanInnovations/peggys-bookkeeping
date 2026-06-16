# Peggy's Bookkeeping & Tax Service — Website

A premium, fully static, single-page website. Dark "neon-on-ink" design that reframes the brand's bright neon colors as an intentional aurora glow on a near-black canvas. Built as plain HTML, CSS, and JavaScript — no build step, no framework — so it deploys anywhere and loads fast.

## What's in here

```
index.html          The whole site (semantic HTML + structured data)
styles.css          All styling and design tokens
script.js           Nav, mobile menu, scroll animations, the neon "thread", a11y widget
site.webmanifest    PWA manifest
robots.txt          Allows all search + AI crawlers; points to the sitemap
sitemap.xml         Sitemap
llms.txt            Plain-language business brief for AI assistants / LLMs
assets/             Logo, favicons, photos, OG image, BBB badge
```

## Signature details

- **Continuous neon thread.** A single SVG line in the brand gradient draws itself down the page as you scroll (GSAP ScrollTrigger), threading every section so the page reads as one continuous canvas rather than stacked blocks. Loaded from a CDN; if it ever fails to load, the site still works perfectly — all content is visible without JavaScript.
- **Animated hero** with drifting aurora blobs keyed to the four brand colors.
- **Accessibility widget** (bottom-left): high contrast, bigger text, readable font, link highlight, extra spacing, pause motion, big cursor, dyslexia-friendly spacing. Choices persist via `localStorage`. Honors the OS "reduce motion" setting automatically.
- **AI visibility:** full JSON-LD structured data (Organization, AccountingService with address/geo/hours/services/team, FAQ), `llms.txt`, and a `robots.txt` that explicitly welcomes AI crawlers.

## Deploy: GitHub → Vercel

1. **Create a GitHub repo** and push these files to it (the repo root should contain `index.html`).
   ```bash
   git init
   git add .
   git commit -m "Peggy's website"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
2. **Import to Vercel:** go to vercel.com → **Add New… → Project** → import the repo.
3. **Framework preset:** select **Other** (it's a static site — no build command, no output directory needed).
4. Click **Deploy**. Vercel serves the files as-is.
5. **Custom domain:** Project → **Settings → Domains** → add `peggys-tax.com` (and `www`) and follow the DNS instructions.

No environment variables or build configuration are required.

## ⚠️ Before going live — please complete these

1. **Contact form delivery.** Two forms (the contact form and the e-book form) use a Formspree placeholder. Create a free form at [formspree.io](https://formspree.io), then replace `your-form-id` in **both** `<form action="https://formspree.io/f/your-form-id">` tags in `index.html`. (Alternatively, point them at any form handler you prefer.) Until then, the "Book a free consultation" button — which goes to the real Google booking form — still works.
2. **Testimonials.** The three quote cards in the **Reviews** section are clearly-labeled placeholders (see the HTML comment there). Replace them with real, attributable client reviews from Google, BBB, or Facebook before launch. The surrounding proof points (BBB A+, 90% recommend / 39 reviews) are real and can stay.
3. **Confirm business details.** Double-check the address, suite, phone, fax, email, and hours in `index.html`, `llms.txt`, and the JSON-LD block — update if anything has changed.
4. **Set the production domain.** This build assumes `https://peggys-tax.com/`. If the final domain differs, update it in: the `<link rel="canonical">` and Open Graph/Twitter URLs in `index.html`, the `Sitemap:` line in `robots.txt`, the URLs in `sitemap.xml`, and the website URL in `llms.txt`.
5. **Map embed.** The contact map uses a keyless Google Maps embed. It works as-is; if you want a styled or API-keyed map later, swap the `<iframe src>`.

## Optional

- **Third-party accessibility overlay.** The site ships with a custom, lightweight accessibility widget. If the client prefers a certified third-party tool (e.g., UserWay or AccessiBe), you can add their script and remove the `.a11y` widget block from `index.html` and `script.js`. Note: overlays are an aid, not a substitute for the accessible markup already built in (semantic structure, keyboard support, visible focus, reduced-motion).
- **Analytics.** Add your preferred analytics snippet (e.g., Vercel Analytics, Plausible, GA4) before `</head>`.

## Notes

- The supplied logo arrived as a flattened image with a gray checkerboard baked in where the background should have been transparent. That checkerboard was removed and the logo re-exported with a true transparent background (`assets/logo.png`), plus square favicon/app-icon versions.
- Fonts (Clash Display, Hanken Grotesk, Space Mono) and GSAP load from CDNs over HTTPS.
- No cookies are set by the site itself; the only stored data is the visitor's own accessibility preferences in their browser's `localStorage`.
