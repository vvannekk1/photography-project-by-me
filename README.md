# Dublin Photo Spots

A directory of photography locations across Dublin, built as a repeat assessment
project for DATAH1010 (Nature of Enterprise Computing, TU Dublin).

Each location carries genre tags, an access rating and a best-light
recommendation. A synthetic dataset of 220 photo sessions drives the statistics
pages and a linear regression model that predicts how a shoot is likely to
score before you leave the house.

**All session data in this project is fictional.** No real photographers,
ratings or personal information are involved.

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 with CSS custom properties |
| Fonts | Fraunces (display), IBM Plex Mono (data), Inter (body) |
| Data | CSV + JSON read from `data/` at build time |
| Model | Linear regression coefficients trained offline in Python |
| Hosting | Netlify |

No database and no backend API — every page is statically generated from the
files in `data/`.

---

## Features

1. **Location directory** — search by name plus genre and access filters, with a
   live result count announced to screen readers.
2. **Scouting map** — the fifteen spots plotted from their real coordinates onto
   an SVG grid, each pin linking through to its location page.
3. **Location pages** — description, access, best light, average rating drawn
   from the session data, a generated contact strip with a lightbox, and a link
   out to Google Maps.
4. **Session statistics** — average rating by time of day, by weather and by
   month, plus a genre-against-month heatmap rendered as an accessible table.
5. **Session rating predictor** — the regression model runs in the browser and
   breaks down how each factor pushes the score up or down, then points at the
   closest matching real location in the dataset.
6. **Golden hour calculator** — sunrise, sunset, golden hour and blue hour
   windows computed from the NOAA sunrise equation for any date and any spot.
7. **Suggest a spot** — a submission form that deliberately collects no personal
   data (see Privacy below).
8. **Command palette** — `Cmd/Ctrl + K` opens a keyboard-driven search across
   every location and page.

---

## Running locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

The dev server prints the port it picked — usually <http://localhost:3000>, but
it will move to 3001 and upwards if that port is busy.

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

No environment variables are needed.

---

## Project structure

```
app/
  page.tsx                  home page with the light meter
  locations/page.tsx        directory with map and filters
  locations/[slug]/page.tsx individual location pages
  light/page.tsx            golden hour calculator
  stats/page.tsx            charts and heatmap
  predict/page.tsx          regression predictor
  suggest/page.tsx          suggestion form
  globals.css               design tokens, themes, animations
components/                 reusable UI, one component per file
lib/
  data.ts                   reads and parses the dataset
  predict.ts                regression coefficients and scoring
  sun.ts                    NOAA solar position maths
  genre.ts                  genre colour and gradient mapping
  matchLocation.ts          maps predictor input to a real location
data/
  locations.json            15 locations
  sessions.csv              220 fictional session records
prompt-log.md               record of AI use (Appendix C)
```

---

## The model

A linear regression was fitted offline in Python (scikit-learn) on the 220
session records, one-hot encoding genre, time of day and weather, and treating
crowd level as a numeric feature.

| Metric | Value |
| --- | --- |
| R² (test) | 0.916 |
| R² (train) | 0.877 |
| Mean absolute error | 0.44 |
| Train / test split | 176 / 44 |

Linear regression suits this problem because the target is a continuous numeric
rating and the effects of light, weather and crowding are close to additive.

The R² is unusually high because the dataset is synthetic and the correlations
were deliberately built into it. Real session data would be considerably
noisier, and a genuine model would be expected to land somewhere nearer 0.4–0.6.
This is a limitation of the data, not evidence of a strong model.

---

## Accessibility

- Semantic landmarks, one `h1` per page and a skip link to the main content.
- Every control has a visible label; the result count uses `aria-live`.
- The heatmap is a real `<table>` with `scope` attributes and a caption.
- Charts expose their values through `aria-label` rather than colour alone.
- The command palette and lightbox trap nothing but return focus on close, and
  respond to `Escape` and arrow keys.
- An accessibility panel offers larger text, higher contrast and reduced motion.
- Every animation also honours the `prefers-reduced-motion` media query.

---

## Privacy

The suggestion form asks only about the place — name, area, genre, best time and
notes. It collects no name, email or any other identifier, and stores entries in
the browser's `localStorage` rather than sending them anywhere.

This is a deliberate data minimisation decision under GDPR Article 5(1)(c):
personal data that is never collected cannot be breached, misused or subjected
to a retention policy. The trade-off is that suggestions stay on one device and
cannot be moderated centrally, which a production version would need to solve —
most likely with a moderated queue and an explicit privacy notice.

---

## Deployment

Hosted on Netlify with the official Next.js plugin. Configuration lives in
`netlify.toml`, so connecting the GitHub repository is enough:

1. Netlify → Add new site → Import an existing project.
2. Pick this repository; the build command and publish directory come from
   `netlify.toml` automatically.
3. Deploy.

Every push to `main` triggers a new build.

---

## AI use

Components 2, 3 and 4 were built with AI assistance, logged in full in
`prompt-log.md` in the format required by Appendix C of the brief.

Component 1 (the written report) and Component 6 (the presentation) were
produced without any AI assistance, as the brief requires.
