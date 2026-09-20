const OG_IMAGE_PATH = '/og-image.jpg';

/** Injects absolute-URL SEO tags and emits sitemap.xml when VITE_SITE_URL is set. */
export default function seoPlugin(siteUrl) {
  const base = (siteUrl || '').replace(/\/$/, '');
  return {
    name: 'portfolio-seo',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        if (!base) return html;
        const withUrl = html.replace(
          '"sameAs"',
          `"url": "${base}/",\n        "image": "${base}${OG_IMAGE_PATH}",\n        "sameAs"`,
        );
        return {
          html: withUrl,
          tags: [
            { tag: 'link', attrs: { rel: 'canonical', href: `${base}/` }, injectTo: 'head' },
            { tag: 'meta', attrs: { property: 'og:url', content: `${base}/` }, injectTo: 'head' },
            { tag: 'meta', attrs: { property: 'og:image', content: `${base}${OG_IMAGE_PATH}` }, injectTo: 'head' },
            { tag: 'meta', attrs: { name: 'twitter:image', content: `${base}${OG_IMAGE_PATH}` }, injectTo: 'head' },
          ],
        };
      },
    },
    generateBundle() {
      if (!base) return;
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${base}/</loc></url>\n</urlset>\n`,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`,
      });
    },
  };
}
