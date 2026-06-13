# nerdyfiction.com

Original novels presented as cinematic, browser-native visual novels.
Static site built with Astro 4 + Tailwind + GSAP.

The first book is **Ordinary Gods**, Book One of *The Chosen Ones*.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # generates dist/, sitemap, robots.txt, RSS
npm run preview    # serves dist/ on http://localhost:4321
```

The site is fully static. Deploy the `dist/` folder to any static host (Netlify,
Cloudflare Pages, GitHub Pages, S3 + CloudFront, etc.). Set the `site` field in
`astro.config.mjs` to your final canonical URL.

---

## Add a new book

1. Create `src/content/books/<slug>.json` matching the schema in
   `src/content/config.ts`. Minimum fields:
   ```json
   {
     "slug": "my-book",
     "title": "My Book",
     "author": "Author Name",
     "tagline": "A one-line hook.",
     "description": "50–300 char description used for OG, Twitter, JSON-LD.",
     "publishedDate": "2026-07-01",
     "cover": {
       "gradientFrom": "#0a0805",
       "gradientTo":   "#3d321e",
       "accent":       "#ff3b1a",
       "glyph":        "MB"
     },
     "characters": [
       { "id": "alice", "name": "Alice",
         "tagline": "One-line character pitch.",
         "silhouetteColor": "#b09f7d" }
     ],
     "chapterCount": 1
   }
   ```
2. Run `npm run build`. The book automatically appears on:
   - the homepage shelf (`/`)
   - the library index (`/books`)
   - its own detail page (`/books/<slug>`)
   - `sitemap-index.xml` with a Book JSON-LD block emitted in `<head>`

No code changes required.

## Add a new chapter

1. Create `src/content/chapters/<book-slug>-<n>.json`.
2. Reference the book and number the chapter:
   ```json
   {
     "book": "my-book",
     "number": 1,
     "title": "Chapter Title",
     "summary": "40–300 character summary used for OG + RSS + JSON-LD.",
     "publishedDate": "2026-07-01",
     "estimatedMinutes": 12,
     "scenes": [ ... ]
   }
   ```
3. Fill `scenes[]` using the scene schema (see below).
4. Run `npm run build`.

The chapter renders at `/books/<slug>/chapter-<n>`, the RSS feed picks it up at
`/rss.xml`, the sitemap is updated, and a Chapter JSON-LD block is emitted.

---

## Scene schema (cheat sheet)

See `src/content/config.ts` for the full Zod schema. A scene is one beat:

| field        | values                                                                                  |
|--------------|------------------------------------------------------------------------------------------|
| `id`         | unique within the chapter                                                                |
| `type`       | `narration` \| `thought` \| `dialog` \| `moment` \| `transition`                         |
| `text`       | the prose shown to the reader (optional for `moment`/`transition`)                       |
| `speaker`    | required for `thought` and `dialog`                                                      |
| `backdrop`   | `cosmos` \| `studio-city` \| `inglewood` \| `void` \| `flash-red` \| `sunset-window` \| `blank` |
| `characters` | array of `{ id, pose, position, intensity }` (see below)                                 |
| `fx`         | `none` \| `red-streak` \| `flash` \| `book-float` \| `time-pinch` \| `tilt-world`        |
| `transition` | `cut` \| `fade` \| `slow-fade` \| `flash` \| `iris` — how to enter THIS scene            |
| `audioCue`   | label only (no audio shipped)                                                            |
| `marker`     | section heading shown above scene (e.g. `"I."`)                                          |

**Character object:**

| field      | values                                                                |
|------------|------------------------------------------------------------------------|
| `id`       | must match a `characters[].id` from the book file                      |
| `pose`     | `idle` \| `tense` \| `reaching` \| `reeling` \| `seated` \| `rising`   |
| `position` | `left` \| `center` \| `right` \| `offscreen`                           |
| `intensity`| 0–1 (silhouette opacity)                                               |

---

## Reading controls

- **Space / Right arrow / Enter / click** — advance
- **Left arrow** — back
- **Esc** — exit to the book page

Reader progress is saved per-chapter in `localStorage` so reloading resumes
where the reader left off.

---

## Adding real character art later

Today, silhouettes are CSS-generated SVG paths in
`src/components/CharacterSilhouette.astro`. Swap them for commissioned art by
dropping SVGs under `public/characters/<id>/<pose>.svg` and updating that
component to load by path. Schema, scene JSON, and reader logic don't need to
change.

---

## Project structure

See `HANDOFF.md` §3 for the full file map.

---

## License

All original fiction. © Nerdy Fiction, all rights reserved.
