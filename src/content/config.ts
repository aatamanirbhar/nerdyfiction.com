import { defineCollection, z, reference } from 'astro:content';

/**
 * Visual-novel scene schema.
 * A "scene" is a single beat shown to the reader. They advance one at a time.
 *
 * type:
 *   narration  - prose text shown without a speaker (cosmic POV / 3rd person)
 *   thought    - internal monologue (italicized, attributed to a character)
 *   dialog     - spoken line (attributed to a character)
 *   moment     - visual beat with optional caption (the book floats; the red streak)
 *   transition - cinematic break used between sections (the "· · ·" separators)
 */
const sceneSchema = z.object({
  id: z.string(),
  type: z.enum(['narration', 'thought', 'dialog', 'moment', 'transition']),
  text: z.string().optional(),
  speaker: z.string().optional(),
  // Visual layer
  backdrop: z.enum([
    'cosmos',          // animated starfield, deep void
    'studio-city',     // warm-amber office at dusk, traffic glow through tinted glass
    'inglewood',       // green-tinted plasma TV light in a cramped apartment
    'void',            // pure black, used for impact moments
    'flash-red',       // single-frame red lightning streak
    'sunset-window',   // soft warm gradient + slow LA traffic
    'vernon-yard',     // corrugated steel scrap yard back office, blue tv glow
    'dc-lab',          // cool blue research lab with monitor glow
    'scottsdale-shop', // amber jewelry workshop with focused lamp pool
    'alex-kitchen',    // warm domestic kitchen at night
    'la-alley',        // grimy alley under sodium light
    'la-freeway',      // night freeway with red brake lights
    'warehouse-fire',  // smoke + orange flame glow
    'ohio-night',      // small-town highway, headlights through fog
    'dublin-street',   // narrow brick european street, dashcam tint
    'apartment-dark',  // dim domestic interior at night
    'blank',
  ]).default('cosmos'),
  // Character silhouettes on stage (max 3 visible)
  characters: z.array(z.object({
    id: z.string(),               // e.g. "robert", "alex"
    pose: z.enum(['idle', 'tense', 'reaching', 'reeling', 'seated', 'rising']).default('idle'),
    position: z.enum(['left', 'center', 'right', 'offscreen']).default('center'),
    intensity: z.number().min(0).max(1).default(0.85),
  })).default([]),
  // Special FX to play when this scene is entered
  fx: z.enum([
    'none',
    'red-streak',
    'flash',
    'book-float',
    'time-pinch',
    'tilt-world',
    'glass-slide',     // an object slides across the screen (Robert's first push)
    'metal-reshape',   // shimmering metallic ripple (Sam's power)
    'energy-transfer', // glow passing from one figure to another (Alex's power)
    'ant-trail',       // tiny moving dot crossing the stage (Farrukh)
    'data-stream',     // monitor characters cascade (Kassidy)
    'truck-stop',      // hard skid + dust (Dublin clip)
    'map-pulse',       // pulsing red dots on a world map
  ]).default('none'),
  // Transition into THIS scene from the previous one
  transition: z.enum(['cut', 'fade', 'slow-fade', 'flash', 'iris']).default('fade'),
  // Audio cue label (no asset shipped; reader UI just shows the cue)
  audioCue: z.string().optional(),
  // Optional sub-heading shown above the scene (used for "I.", "II." section breaks)
  marker: z.string().optional(),
});

export type Scene = z.infer<typeof sceneSchema>;

const books = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
    author: z.string(),
    tagline: z.string(),
    description: z.string().min(50).max(300),
    publishedDate: z.coerce.date(),
    // Cover art is generated in code from these tokens
    cover: z.object({
      gradientFrom: z.string(),  // tailwind color or hex
      gradientTo: z.string(),
      accent: z.string(),
      glyph: z.string().optional(), // a short symbol drawn on the spine, e.g. "OG"
    }),
    // Characters featured in this book — drives the "flowing out of book" animation
    characters: z.array(z.object({
      id: z.string(),
      name: z.string(),
      tagline: z.string(),
      silhouetteColor: z.string(),
    })),
    // SEO
    keywords: z.array(z.string()).default([]),
    chapterCount: z.number().int().positive(),
  }),
});

const chapters = defineCollection({
  type: 'data',
  schema: z.object({
    book: reference('books'),
    number: z.number().int().positive(),
    title: z.string(),
    summary: z.string().min(40).max(300),
    publishedDate: z.coerce.date(),
    estimatedMinutes: z.number().int().positive().default(20),
    scenes: z.array(sceneSchema).min(1),
    // SEO
    keywords: z.array(z.string()).default([]),
  }),
});

export const collections = { books, chapters };
