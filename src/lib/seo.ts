/**
 * SEO helpers: canonical URLs and Schema.org JSON-LD for Book/Chapter pages.
 */

const SITE = 'https://nerdyfiction.com';

export function canonical(pathname: string): string {
  const clean = pathname.replace(/\/+$/, '') || '/';
  return `${SITE}${clean === '/' ? '' : clean}`;
}

export function siteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Nerdy Fiction',
    url: SITE,
    description: 'Books reimagined as visual novels. Read original fiction the way it was meant to be felt.',
    publisher: {
      '@type': 'Organization',
      name: 'Nerdy Fiction',
      url: SITE,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE}/books?q={query}`,
      'query-input': 'required name=query',
    },
  };
}

type BookLite = {
  slug: string;
  title: string;
  series?: string;
  author: string;
  description: string;
  publishedDate: Date;
  keywords?: string[];
};

export function bookJsonLd(book: BookLite) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    url: canonical(`/books/${book.slug}`),
    author: { '@type': 'Person', name: book.author },
    inLanguage: 'en',
    bookFormat: 'https://schema.org/EBook',
    isPartOf: book.series ? { '@type': 'BookSeries', name: book.series } : undefined,
    description: book.description,
    datePublished: book.publishedDate.toISOString().slice(0, 10),
    publisher: { '@type': 'Organization', name: 'Nerdy Fiction', url: SITE },
    keywords: book.keywords?.join(', '),
  };
}

type ChapterLite = {
  bookSlug: string;
  bookTitle: string;
  author: string;
  number: number;
  title: string;
  summary: string;
  publishedDate: Date;
  estimatedMinutes: number;
  keywords?: string[];
};

export function chapterJsonLd(c: ChapterLite) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Chapter',
    name: c.title,
    url: canonical(`/books/${c.bookSlug}/chapter-${c.number}`),
    position: c.number,
    isPartOf: {
      '@type': 'Book',
      name: c.bookTitle,
      url: canonical(`/books/${c.bookSlug}`),
      author: { '@type': 'Person', name: c.author },
    },
    author: { '@type': 'Person', name: c.author },
    datePublished: c.publishedDate.toISOString().slice(0, 10),
    description: c.summary,
    timeRequired: `PT${c.estimatedMinutes}M`,
    keywords: c.keywords?.join(', '),
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: canonical(it.path),
    })),
  };
}
