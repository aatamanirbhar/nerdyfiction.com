export function bookHref(slug: string) {
  return `/books/${slug}`;
}

export function chapterHref(bookSlug: string, chapterNumber: number) {
  return `/books/${bookSlug}/chapter-${chapterNumber}`;
}

export function seriesHref(seriesSlug: string) {
  return `/series/${seriesSlug}`;
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
