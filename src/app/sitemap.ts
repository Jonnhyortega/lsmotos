import type { MetadataRoute } from 'next';

const baseUrl = 'https://lsmotos.com';

// Only indexable pages belong here: the thank-you page and the /landing/* design
// variants are marked noindex, so listing them would only confuse Search Console.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/catalogo`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];
}
