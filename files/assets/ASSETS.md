# Peggy's — Site Image Assets

All images for the website, sized and optimized for the dark "neon-on-ink" design.
Drop this `assets/` folder next to `index.html` (the site already points at `assets/...`).

## Logo & icons
- **logo.png** — Improved logo. The original had a gray checkerboard baked into the
  background; that's been keyed out to true transparency so the neon glow sits cleanly
  on the dark site. 1000px wide, transparent PNG. Optimized for dark backgrounds.
- **mark-512.png / mark-180.png / mark-32.png / mark-16.png** — Square icon built from
  the rainbow-and-hands mark. Used for favicons and the Apple touch / PWA app icon.
- **og-image.jpg** — 1200×630 social share card (logo on an aurora-ink background).
  Referenced by the Open Graph / Twitter meta tags.

## Photos
- **storefront.jpg** — Mesquite storefront, used in the hero / about area.
- **about.jpg** — Advisor-with-client photo for the About / story section.
- **ebook.jpg** — Cover of Anita's free e-book.
- **sharon.jpg / anita.jpg / tracy.jpg** — Team headshots.

## Badge
- **bbb.png** — Official BBB Accredited Business badge (kept on its white plate per
  BBB brand rules; the site sets it on a light "trust chip").

Where icons are wired in index.html:
  <link rel="icon" sizes="32x32" href="assets/mark-32.png">
  <link rel="icon" sizes="16x16" href="assets/mark-16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="assets/mark-180.png">
  og:image -> assets/og-image.jpg ; Organization logo -> assets/mark-512.png
