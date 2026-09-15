# 6CAT AGENCY

Responsive landing page built with semantic HTML, CSS and JavaScript. No dependencies required.

## Run

`npm run dev` — open http://127.0.0.1:3000

`npm run build` — validates local asset references and copies the website to `dist/`.

`npm start` — preview the build.

## Deploy to a VPS

Build the static output first with `npm run build`. For Docker deployments:

1. `docker build -t 6cat-agency .`
2. `docker run -d --restart unless-stopped --name 6cat-agency -p 80:80 6cat-agency`

For a Node-based deployment, run `npm ci && npm run build`, then start with
`HOST=0.0.0.0 PORT=3000 npm start` behind your existing reverse proxy.

## Structure

- `index.html`: header, hero, featured project, services, studio, client strip, journal and contact sections; project/service dialogs.
- `styles.css`: design tokens, editorial layout, responsive layouts, reduced-motion support.
- `app.js`: mobile navigation, dialogs, entrance animations and copyable project brief.
- `public/images/`: four original supplied PNG compositions, preserved without modification.

Google Fonts provides Barlow Condensed, Inter and Noto Sans Thai with system fallbacks. The supplied full-page image is the visual reference, not a flattened page background. Client wordmarks and SŪRA are reference concept content. Journal is a coming-soon section. Contact copies a brief locally; no contact destination was supplied and no form submission backend is connected.

## GSAP motion
GSAP and ScrollTrigger power the short reload intro, staggered entrances, scroll reveals, geometry parallax, badge rotation, client loop, and CREATE/DESIGN hover and keyboard-focus interaction. Motion respects reduced-motion settings. Press Escape to skip the intro. Vendor scripts are served locally from public/vendor; motion.js contains the choreography.

