// ============================================================
// src/lib/constants.js — সব config এক জায়গায়
// ============================================================

export const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_KEY;
export const TMDB = process.env.NEXT_PUBLIC_TMDB_BASE || 'https://api.themoviedb.org/3';
export const IMG = process.env.NEXT_PUBLIC_IMG || 'https://image.tmdb.org/t/p/w500';
export const IMG_BIG = process.env.NEXT_PUBLIC_IMG_BIG || 'https://image.tmdb.org/t/p/w1280';
export const SHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID;
export const SHEET_API = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourusername.github.io/movie-app';

export const GENRES = [
  { id: 0,     label: '🎬 All',       name: 'all' },
  { id: 28,    label: '💥 Action',    name: 'action' },
  { id: 10749, label: '❤️ Romance',   name: 'romance' },
  { id: 35,    label: '😂 Comedy',    name: 'comedy' },
  { id: 53,    label: '😱 Thriller',  name: 'thriller' },
  { id: 27,    label: '👻 Horror',    name: 'horror' },
  { id: 18,    label: '🎭 Drama',     name: 'drama' },
  { id: 878,   label: '🚀 Sci-Fi',    name: 'scifi' },
  { id: 14,    label: '🧙 Fantasy',   name: 'fantasy' },
  { id: 12,    label: '🗺️ Adventure', name: 'adventure' },
  { id: 80,    label: '🔫 Crime',     name: 'crime' },
  { id: 9648,  label: '🔍 Mystery',   name: 'mystery' },
  { id: 16,    label: '🎨 Animation', name: 'animation' },
  { id: 10751, label: '👨‍👩‍👧 Family',  name: 'family' },
  { id: 99,    label: '📹 Documentary', name: 'documentary' },
];

export const CATEGORIES = [
  { label: '🔥 ভাইরাল',    href: '/viral' },
  { label: 'All',           href: '/' },
  { label: 'Popular',       href: '/category/popular' },
  { label: 'Top Rated',     href: '/category/top-rated' },
  { label: 'Now Playing',   href: '/category/now-playing' },
  { label: 'Web Series',    href: '/category/web-series' },
  { label: 'Hollywood',     href: '/category/hollywood' },
  { label: 'Bangla',        href: '/category/bangla' },
  { label: 'Kolkata',       href: '/category/kolkata' },
  { label: 'Hindi',         href: '/category/hindi' },
  { label: 'Anime',         href: '/category/anime' },
  { label: 'Indian',        href: '/category/indian' },
  { label: '18+',           href: '/category/18plus' },
];

export const BOLLYWOOD_IDS = [
  19404, 580489, 951891, 14290, 1599,
  297762, 297802, 292203,
  758009, 390043, 99861,
  340101, 497582, 665, 634492,
  375262, 400928, 290380,
  839033, 841887, 726566,
];

export const KOLKATA_IDS = [
  27629, 242090, 96724, 18148, 18149, 56264, 398173, 339964,
];

export const SOUTH_INDIAN_IDS = [
  76341, 278154, 763215,
  822054, 663712,
  545611,
  493922, 359724,
  694919, 855289,
  724495, 390043, 399579, 264660,
  475557, 725201, 668534,
];
