import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const chapters = await getCollection('chapters');
  const books = await getCollection('books');
  const bookBySlug = new Map(books.map(b => [b.id, b]));

  return rss({
    title: 'Nerdy Fiction — Latest Chapters',
    description: 'New visual-novel chapters as they publish on nerdyfiction.com.',
    site: context.site ?? 'https://nerdyfiction.com',
    items: chapters
      .slice()
      .sort((a, b) => +b.data.publishedDate - +a.data.publishedDate)
      .map(c => {
        const book = bookBySlug.get(c.data.book.id);
        return {
          title: book ? `${book.data.title} — Chapter ${c.data.number}: ${c.data.title}` : c.data.title,
          link: `/books/${c.data.book.id}/chapter-${c.data.number}`,
          pubDate: c.data.publishedDate,
          description: c.data.summary,
          categories: c.data.keywords,
        };
      }),
    customData: '<language>en-us</language>',
  });
}
