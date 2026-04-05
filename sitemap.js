// ============================================================
// src/app/sitemap.js — Auto Sitemap (Google Bot এর জন্য)
// ============================================================

import { SITE_URL } from '@/lib/constants';
import { getHomeData } from '@/lib/tmdb';

export default async function sitemap() {
  const homeData = await getHomeData();

  // সব trending + popular মুভি sitemap এ
  const allMovies = [
    ...homeData.trending,
    ...homeData.popular,
    ...homeData.topRated,
    ...homeData.hindi,
    ...homeData.tamil,
  ].filter((m, i, a) => a.findIndex(x => x.tmdb_id === m.tmdb_id) === i);

  const movieUrls = allMovies.map(m => ({
    url: `${SITE_URL}/movie/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const categoryUrls = [
    'popular', 'top-rated', 'now-playing', 'web-series',
    'hollywood', 'bangla', 'kolkata', 'hindi', 'anime', 'indian',
  ].map(slug => ({
    url: `${SITE_URL}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/viral`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...categoryUrls,
    ...movieUrls,
  ];
}
