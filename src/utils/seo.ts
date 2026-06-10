import { useEffect } from 'react';

type PageMetadata = {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
};

const resolveAbsoluteUrl = (value: string) => {
  if (/^https?:\/\//i.test(value)) return value;
  if (typeof window === 'undefined') return value;

  return `${window.location.origin}${value.startsWith('/') ? value : `/${value}`}`;
};

const setOrCreateMeta = (selector: string, attribute: string, value: string) => {
  const existing = document.head.querySelector<HTMLMetaElement>(selector);
  if (existing) {
    existing.setAttribute(attribute, value);
    return;
  }
  const tag = document.createElement('meta');
  const attrMatch = selector.match(/(?:name|property)="(.*?)"/);
  if (attrMatch) {
    const attrName = selector.includes('name=') ? 'name' : 'property';
    tag.setAttribute(attrName, attrMatch[1]);
  }
  tag.setAttribute(attribute, value);
  document.head.appendChild(tag);
};

const setOrCreateLink = (rel: string, href: string) => {
  const existing = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (existing) {
    existing.href = href;
    return;
  }
  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;
  document.head.appendChild(link);
};

export const usePageMetadata = ({
  title,
  description,
  url,
  image,
  type = 'website',
  noIndex = false,
}: PageMetadata) => {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    document.title = title;
    setOrCreateMeta('meta[name="description"]', 'content', description);
    setOrCreateMeta('meta[name="author"]', 'content', 'WORLD NOW');
    setOrCreateMeta('meta[property="og:title"]', 'content', title);
    setOrCreateMeta('meta[property="og:description"]', 'content', description);
    setOrCreateMeta('meta[property="og:type"]', 'content', type);
    setOrCreateMeta('meta[property="og:site_name"]', 'content', 'WORLD NOW');

    if (url) {
      setOrCreateMeta('meta[property="og:url"]', 'content', url);
      setOrCreateLink('canonical', url);
    }

    const resolvedImage = image ? resolveAbsoluteUrl(image) : undefined;

    if (resolvedImage) {
      setOrCreateMeta('meta[property="og:image"]', 'content', resolvedImage);
      setOrCreateMeta('meta[name="twitter:image"]', 'content', resolvedImage);
      setOrCreateMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
      setOrCreateLink('icon', resolvedImage);
      setOrCreateLink('shortcut icon', resolvedImage);
    } else {
      setOrCreateMeta('meta[name="twitter:card"]', 'content', 'summary');
    }

    setOrCreateMeta('meta[name="twitter:title"]', 'content', title);
    setOrCreateMeta('meta[name="twitter:description"]', 'content', description);

    if (noIndex) {
      setOrCreateMeta('meta[name="robots"]', 'content', 'noindex, nofollow');
    }
  }, [title, description, url, image, type, noIndex]);
};
