# nerdyfiction.com — Build Handoff

> **Purpose of this file:** if the current session ends (token budget hit, switched models/APIs, new chat), the next session — human or AI — can read this and continue without re-discovering anything. Update this file as you complete or change work.

**Last updated:** 2026-06-13
**Working directory:** `C:\Users\Sanjesh Dubey\Desktop\ordinary gods\nerdyfiction`
**Source manuscript:** `..\New Text Document.txt` (1418 lines, Chapter 1 of Ordinary Gods)

---

## 1. What this project is

Static site for `nerdyfiction.com` that presents books as **interactive visual novels**. The first book is "Ordinary Gods — Book One of The Chosen Ones," chapter 1.

Design pillars:
1. **SEO-first** — static generation, JSON-LD, sitemap, OG, RSS.
2. **Zero-friction content adds** — adding a new book = one JSON file in `src/content/books/`. Adding a chapter = one JSON file in `src/content/chapters/`. Sitemap and OG metadata regenerate automatically on build.
3. **Cinematic UI** — book covers animate; on hover, character silhouettes flow OUT of the closed book. The reader is a full-screen visual-novel player with backdrops, character art, scene transitions, FX (the "red streak" moment), typewriter text.

---

## 2. Tech stack (locked decisions — don't re-litigate)

| Concern              | Choice                                | Why                                                       |
|----------------------|---------------------------------------|-----------------------------------------------------------|
| Framework            | **Astro 4** (static output)           | Best-in-class SEO for content sites; ships zero JS by default |
| Styling              | **Tailwind CSS 3**                    | Fast iteration, no CSS file sprawl                        |
| Animation            | **GSAP 3** + Astro view transitions   | Cinematic timelines, SVG, page-to-page morphs             |
| Content              | **Astro content collections** (JSON)  | Type-safe schemas, drives auto-sitemap                    |
| SEO                  | `@astrojs/sitemap` + custom JSON-LD   | Auto-generated, easy to maintain                          |
| RSS                  | `@astrojs/rss`                        | Standard                                                  |
| TypeScript           | strict mode                           | Schema enforcement at build time                          |

User-rejected alternatives recorded so we don't loop back:
- Framer Motion (needs React island; heavier)
- Pure CSS animations (less cinematic for "characters flowing out of book")
- Placeholder art (we went with code-generated SVG silhouettes + gradients)

---

## 3. File map

```
nerdyfiction/
├── HANDOFF.md                        ← this file
├── README.md                         ← end-user "how to add a book/chapter"
├── package.json
├── astro.config.mjs                  ← site URL, sitemap, view transitions
├── tailwind.config.mjs               ← color tokens (ink/ember), keyframes
├── tsconfig.json
├── public/
│   ├── robots.txt
│   └── favicon.svg
└── src/
    ├── env.d.ts
    ├── content/
    │   ├── config.ts                 ← collection schemas (books, chapters, scenes)
    │   ├── books/
    │   │   └── ordinary-gods.json    ← Ordinary Gods book metadata
    │   └── chapters/
    │       └── ordinary-gods-1.json  ← Chapter 1 scenes (VN format)
    ├── layouts/
    │   └── BaseLayout.astro          ← <head>, SEO meta, JSON-LD, view transitions
    ├── components/
    │   ├── SeoHead.astro             ← OG, Twitter, canonical, JSON-LD slots
    │   ├── Starfield.astro           ← animated cosmic backdrop
    │   ├── BookCover.astro           ← gradient cover w/ glyph (re-used everywhere)
    │   ├── AnimatedBookCard.astro    ← homepage book card w/ characters flowing out
    │   ├── ChapterCard.astro         ← book-detail chapter card w/ page-flip hover
    │   ├── SceneStage.astro          ← VN backdrop + characters (server-rendered)
    │   ├── CharacterSilhouette.astro ← single SVG silhouette w/ pose variants
    │   └── ReaderShell.astro         ← client-side scene runner (typewriter, advance, fx)
    ├── lib/
    │   ├── seo.ts                    ← buildJsonLd(book), buildJsonLd(chapter), canonical()
    │   └── nav.ts                    ← URL helpers: bookHref(book), chapterHref(book, n)
    └── pages/
        ├── index.astro               ← Home: hero + animated book shelf
        ├── books/
        │   ├── index.astro           ← All books grid
        │   └── [slug]/
        │       ├── index.astro       ← Book detail + chapter list
        │       └── chapter-[n].astro ← VN reader
        ├── about.astro
        └── rss.xml.ts                ← RSS feed of latest chapters
```

---

## 4. Scene schema (the format the VN reader consumes)

A chapter is `{ book, number, title, summary, scenes: Scene[], ... }`. A scene is one beat:

```ts
{
  id: "robert-04",
  type: "narration" | "thought" | "dialog" | "moment" | "transition",
  text?: string,               // optional for `moment`/`transition`
  speaker?: string,            // required for "dialog" + "thought"
  backdrop:                    // one of:
    "cosmos" | "studio-city" | "inglewood" | "void"
    | "flash-red" | "sunset-window" | "blank",
  characters: [{
    id: "robert",
    pose: "idle"|"tense"|"reaching"|"reeling"|"seated"|"rising",
    position: "left"|"center"|"right"|"offscreen",
    intensity: 0..1
  }],
  fx:         "none"|"red-streak"|"flash"|"book-float"|"time-pinch"|"tilt-world",
  transition: "cut"|"fade"|"slow-fade"|"flash"|"iris",
  audioCue?:  string,          // label only — no audio assets shipped
  marker?:    string,          // e.g. "I." section break label
}
```

The full source of truth is `src/content/config.ts`.

---

## 5. Build progress (update as you go)

| # | Task                                                          | Status        | Notes |
|---|---------------------------------------------------------------|---------------|-------|
| 1 | Scaffold Astro + Tailwind + GSAP + sitemap                    | ✅ done       | `npm install` ran clean, 469 packages |
| 2 | Content collection schemas (`config.ts`, book JSON)           | ✅ done       | books + chapters + scene schema all defined; ordinary-gods.json written |
| 3 | SEO foundation (BaseLayout, SeoHead, JSON-LD, robots, RSS)    | ⏳ next       | start with `src/layouts/BaseLayout.astro` + `src/components/SeoHead.astro` + `src/lib/seo.ts` |
| 4 | Homepage w/ animated book shelf (chars flowing out)           | ⏳ pending    | needs `BookCover`, `AnimatedBookCard`, `Starfield` |
| 5 | Book detail + chapter index                                   | ⏳ pending    | `/books/[slug]/index.astro` |
| 6 | Visual-novel reader (`/books/[slug]/chapter-[n]`)             | ⏳ pending    | `SceneStage` (server) + `ReaderShell` (client GSAP) |
| 7 | Convert source text lines 1–156 into scenes (chapter-1 JSON)  | ⏳ pending    | prologue (cosmic) → "I." (Robert) → book-float → callback → exit. Mark the red-streak moment with `fx: "red-streak"` + `transition: "flash"`. |
| 8 | README (how to add new books/chapters) + `npm run build` check| ⏳ pending    | sitemap.xml, robots.txt, RSS, pages |
| 9 | This handoff file                                             | ✅ done       | keep it current |

---

## 6. Resume instructions

### If you're a fresh session picking this up

1. **Read this file top-to-bottom first.**
2. **Don't re-scaffold or re-install.** Run `ls src/` to confirm what already exists, then check the table in §5.
3. The user's clarifying answers, already collected:
   - Project lives at `./nerdyfiction/`
   - VN scope for this build: lines 1–156 of the source text (prologue + Robert's audition + the floating book)
   - Art: CSS-generated SVG silhouettes + animated gradient backdrops
   - Animation: GSAP + Astro view transitions
4. **Pick up at the first ⏳ row in §5.** Work top-down.
5. **When you finish a task, flip its row to ✅ and write a one-line note** in the Notes column.
6. **Never delete entries from this file** — only mark them done or add new ones.

### The source manuscript

Lives at `../New Text Document.txt` (one level up from project root). 1418 lines.

For the current build, only lines **1–156** are in scope (the cosmic prologue + Robert's section ending with him sitting in his car). The remaining four-character sections are deferred to future chapters/builds — the framework should handle them without changes when their JSON is dropped in.

### Verifying

After finishing tasks 3–8:
```bash
cd nerdyfiction
npm run build          # confirms schemas pass, generates dist/sitemap.xml, robots.txt, RSS
npm run preview        # open http://localhost:4321
```

The `verify` skill is available — invoke it to drive the running app in a browser and confirm the homepage book animation + reader work.

---

## 7. "How to add new content" (the user's stated requirement)

This is the operational doc for the human running the site. Mirror it in `README.md` once the build is complete.

**Add a new book:**
1. Drop `src/content/books/<slug>.json` matching the schema in `src/content/config.ts`.
2. Run `npm run build`.
3. `/books/<slug>` is generated; sitemap.xml includes it; homepage shelf shows it; JSON-LD `Book` schema emitted.

**Add a new chapter:**
1. Drop `src/content/chapters/<book-slug>-<n>.json`.
2. Set `book: "<book-slug>"` (reference) and `number: <n>`.
3. Fill `scenes[]` using the schema in §4.
4. `npm run build` → `/books/<slug>/chapter-<n>` is generated; sitemap updated; RSS feed picks it up.

No code changes needed for either operation. That's the design.

---

## 8. Known follow-ups / parking lot

- The other three characters (Alex, plus the two unrevealed) need scene JSON for the full chapter — out of scope for this build but the schema and reader support them.
- Audio cues are labeled in the scene data (`audioCue: "low drone"`), but no audio assets ship. Wiring real audio is a future task.
- Character silhouettes are generic SVG shapes today; swapping in commissioned art = drop files in `public/characters/<id>/<pose>.svg` and update `CharacterSilhouette.astro` to load them by path.
- Series landing page (`/series/the-chosen-ones`) is not built yet; collection already supports `series` + `seriesOrder` so it's trivial to add.
