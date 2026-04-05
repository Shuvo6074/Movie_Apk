// ============================================================
// src/lib/sheet.js — Google Sheet থেকে ডেটা আনা
// ============================================================

import { SHEET_API } from './constants';

export function posterUrl(u) {
  if (!u) return '';
  const m = u.match(/[?&]id=([^&]+)/) || u.match(/\/d\/([^/]+)/);
  if (m) return `https://drive.google.com/thumbnail?id=${m[1]}&sz=w800`;
  if (u.startsWith('http')) return u;
  return '';
}

export function getGdriveId(url) {
  if (!url) return null;
  const m = url.match(/\/d\/([^/]+)/) || url.match(/[?&]id=([^&]+)/) || url.match(/open\?id=([^&]+)/);
  return m ? m[1] : null;
}

export function getVideoUrl(m) {
  if (m.imdb) {
    if (m.type === 'series')
      return `https://vidsrc.me/embed/tv?imdb=${m.imdb}&season=${m.season || 1}&episode=${m.episode || 1}`;
    return `https://vidsrc.me/embed/movie?imdb=${m.imdb}`;
  }
  if (m.tmdb_id) {
    if (m.type === 'series') return `https://vidsrc.me/embed/tv?tmdb=${m.tmdb_id}`;
    return `https://vidsrc.me/embed/movie?tmdb=${m.tmdb_id}`;
  }
  const v = m.video || '';
  if (!v) return '';
  const yt = v.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&\n?#]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1`;
  const gdId = getGdriveId(v);
  if (gdId) return `https://drive.google.com/file/d/${gdId}/preview`;
  if (v.includes('streamtape')) return v.replace('/v/', '/e/');
  return v;
}

export async function getSheetData() {
  try {
    const res = await fetch(SHEET_API, { next: { revalidate: 1800 } }); // 30 min cache
    const text = await res.text();
    const json = JSON.parse(text.substr(47).slice(0, -2));
    return json.table.rows
      .filter(r => r.c && r.c[0]?.v)
      .map(r => {
        const title = r.c[0]?.v || '';
        const slug = title.toLowerCase().replace(/[^a-z0-9\u0980-\u09ff]+/g, '-').replace(/(^-|-$)/g, '');
        return {
          title,
          category: r.c[1]?.v || '',
          poster: posterUrl(r.c[2]?.v || ''),
          imdb: r.c[3]?.v || '',
          video: r.c[4]?.v || '',
          year: String(r.c[5]?.v || ''),
          type: r.c[6]?.v || 'movie',
          series_id: r.c[7]?.v || '',
          season: r.c[8]?.v || '1',
          episode: r.c[9]?.v || '',
          source: 'sheet',
          slug: `sheet-${slug}`,
          id: `sheet-${slug}`,
        };
      });
  } catch {
    return [];
  }
}
