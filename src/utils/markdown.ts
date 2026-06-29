import { marked } from 'marked';

export function renderMarkdown(content: string, fallbackAltText?: string) {
  const raw = (content || '')
    .replace(/(^|\n)\s*---\s*(?=\n|$)/g, '\n\n')
    .trim();

  if (!raw) {
    return '';
  }

  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(raw);
  const html = looksLikeHtml
    ? raw
    : (marked.parse(raw, {
        gfm: true,
        breaks: true,
      }) as string);

  if (typeof window !== 'undefined' && fallbackAltText) {
    const container = document.createElement('div');
    container.innerHTML = html;

    container.querySelectorAll('img').forEach((image) => {
      const existingAlt = image.getAttribute('alt');
      if (!existingAlt || existingAlt.trim() === '') {
        image.setAttribute('alt', fallbackAltText);
      }
    });

    return container.innerHTML;
  }

  return html;
}
