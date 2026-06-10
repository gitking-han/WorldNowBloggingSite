import { marked } from 'marked';

export function renderMarkdown(content: string) {
  const raw = (content || '')
    .replace(/(^|\n)\s*---\s*(?=\n|$)/g, '\n\n')
    .trim();

  if (!raw) {
    return '';
  }

  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(raw);

  if (looksLikeHtml) {
    return raw;
  }

  return marked.parse(raw, {
    gfm: true,
    breaks: true,
  }) as string;
}
