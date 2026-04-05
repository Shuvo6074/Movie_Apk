// ============================================================
// src/app/robots.js — robots.txt auto-generate
// ============================================================

import { SITE_URL } from '@/lib/constants';

export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
