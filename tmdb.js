// ============================================================
// src/lib/tmdb.js — TMDB API সব call এক জায়গায়
// ============================================================

import { TMDB, TMDB_KEY, IMG, IMG_BIG } from './constants';

// একটা মুভি object তৈরি করার helper
function mapMovie(m, category = '') {
  if (!m || !m.poster_path) return null;
  return {
    id: m.id,
    tmdb_id: m.id,
    title: m.title || m.name || '',
    poster: `${IMG}${m.poster_path}`,
    backdrop: m.backdrop_path ? `${IMG_BIG}${m.backdrop_path}` : '',
    year: (m.release_date || m.first_air_date || '').substr(0, 4),
    rating: m.vote_average ? m.vote_average.toFixed(1) : '',
    overview: m.overview || '',
    type: m.first_air_date ? 'series' : 'movie',
    category,
    genre_ids: m.genre_ids || [],
    source: 'tmdb',
    slug: `${m.id}-${(m.title || m.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`,
  };
}

// একটাই API call function
async function tmdbFetch(endpoint) {
  const sep = endpoint.includes('?') ? '&' : '?';
  const url = `${TMDB}${endpoint}${sep}api_key=${TMDB_KEY}`;
  const res = await fetch(url, { next: { revalidate: 3600 } }); // 1 ঘণ্টা cache
  if (!res.ok) return { results: [] };
  return res.json();
}

// ========== Home Page Data ==========
export async function getHomeData() {
  const [trending, popular, topRated, series, hindi, tamil, telugu, korean, action, horror] =
    await Promise.all([
      tmdbFetch('/trending/movie/day?include_adult=false'),
      tmdbFetch('/movie/popular?language=en-US&page=1&include_adult=false'),
      tmdbFetch('/movie/top_rated?language=en-US&page=1&include_adult=false'),
      tmdbFetch('/tv/popular?language=en-US&page=1&include_adult=false'),
      tmdbFetch('/discover/movie?with_original_language=hi&sort_by=popularity.desc&include_adult=false'),
      tmdbFetch('/discover/movie?with_original_language=ta&sort_by=popularity.desc&include_adult=false'),
      tmdbFetch('/discover/movie?with_original_language=te&sort_by=popularity.desc&include_adult=false'),
      tmdbFetch('/discover/movie?with_original_language=ko&sort_by=popularity.desc&include_adult=false'),
      tmdbFetch('/discover/movie?with_genres=28&sort_by=popularity.desc&include_adult=false'),
      tmdbFetch('/discover/movie?with_genres=27&sort_by=popularity.desc&include_adult=false'),
    ]);

  return {
    trending:  (trending.results  || []).map(m => mapMovie(m, 'Trending')).filter(Boolean).slice(0, 20),
    popular:   (popular.results   || []).map(m => mapMovie(m, 'Hollywood')).filter(Boolean).slice(0, 20),
    topRated:  (topRated.results  || []).map(m => mapMovie(m, 'Top Rated')).filter(Boolean).slice(0, 20),
    series:    (series.results    || []).map(m => mapMovie(m, 'Web Series')).filter(Boolean).slice(0, 20),
    hindi:     (hindi.results     || []).map(m => mapMovie(m, 'Bollywood Hindi')).filter(Boolean).slice(0, 20),
    tamil:     (tamil.results     || []).map(m => mapMovie(m, 'Tamil')).filter(Boolean).slice(0, 20),
    telugu:    (telugu.results    || []).map(m => mapMovie(m, 'Telugu')).filter(Boolean).slice(0, 20),
    korean:    (korean.results    || []).map(m => mapMovie(m, 'Korean')).filter(Boolean).slice(0, 20),
    action:    (action.results    || []).map(m => mapMovie(m, 'Action')).filter(Boolean).slice(0, 20),
    horror:    (horror.results    || []).map(m => mapMovie(m, 'Horror')).filter(Boolean).slice(0, 20),
  };
}

// ========== একটা মুভির Detail ==========
export async function getMovieDetail(tmdbId, type = 'movie') {
  const endpoint = type === 'series' ? `/tv/${tmdbId}` : `/movie/${tmdbId}`;
  const [detail, credits, similar] = await Promise.all([
    tmdbFetch(`${endpoint}?language=en-US&append_to_response=videos,seasons`),
    tmdbFetch(`${endpoint}/credits?language=en-US`),
    tmdbFetch(`${endpoint}/similar?language=en-US&page=1`),
  ]);

  const movie = mapMovie(detail, detail.genres?.[0]?.name || '');
  if (!movie) return null;

  return {
    ...movie,
    genres: detail.genres || [],
    runtime: detail.runtime || detail.episode_run_time?.[0] || 0,
    tagline: detail.tagline || '',
    cast: (credits.cast || []).slice(0, 10).map(c => ({
      id: c.id,
      name: c.name,
      character: c.character,
      photo: c.profile_path ? `${IMG}${c.profile_path}` : null,
    })),
    seasons: detail.seasons || [],
    similar: (similar.results || []).map(m => mapMovie(m, '')).filter(Boolean).slice(0, 12),
    trailerKey: detail.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')?.key || null,
  };
}

// ========== Category Page Data ==========
export async function getCategoryMovies(category, page = 1) {
  const endpointMap = {
    popular:      `/movie/popular?language=en-US&page=${page}&include_adult=false`,
    'top-rated':  `/movie/top_rated?language=en-US&page=${page}&include_adult=false`,
    'now-playing':`/movie/now_playing?language=en-US&page=${page}&include_adult=false`,
    'web-series': `/tv/popular?language=en-US&page=${page}&include_adult=false`,
    hollywood:    `/discover/movie?sort_by=popularity.desc&include_adult=false&page=${page}`,
    bangla:       `/discover/movie?with_original_language=bn&sort_by=popularity.desc&include_adult=false&page=${page}`,
    kolkata:      `/discover/movie?with_original_language=bn&sort_by=vote_count.desc&include_adult=false&page=${page}`,
    hindi:        `/discover/movie?with_original_language=hi&sort_by=popularity.desc&include_adult=false&page=${page}`,
    anime:        `/discover/movie?with_original_language=ja&sort_by=popularity.desc&include_adult=false&page=${page}`,
    indian:       `/discover/movie?with_original_language=ta,te,kn,ml&sort_by=vote_count.desc&include_adult=false&page=${page}`,
    '18plus':     `/discover/movie?with_genres=10749&sort_by=popularity.desc&include_adult=true&page=${page}`,
  };

  const endpoint = endpointMap[category];
  if (!endpoint) return { movies: [], totalPages: 1 };

  const catLabelMap = {
    popular: 'Popular', 'top-rated': 'Top Rated', 'now-playing': 'Now Playing',
    'web-series': 'Web Series', hollywood: 'Hollywood', bangla: 'Bangla',
    kolkata: 'Kolkata Bengali', hindi: 'Bollywood Hindi', anime: 'Anime',
    indian: 'Indian', '18plus': '18+',
  };

  const data = await tmdbFetch(endpoint);
  return {
    movies: (data.results || []).map(m => mapMovie(m, catLabelMap[category] || category)).filter(Boolean),
    totalPages: Math.min(data.total_pages || 1, 20),
  };
}

// ========== Genre Filter ==========
export async function getMoviesByGenre(genreId, page = 1) {
  const data = await tmdbFetch(
    `/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&include_adult=false&page=${page}`
  );
  return {
    movies: (data.results || []).map(m => mapMovie(m, 'Genre')).filter(Boolean),
    totalPages: Math.min(data.total_pages || 1, 20),
  };
}

// ========== Search ==========
export async function searchMovies(query, page = 1) {
  if (!query) return { movies: [], totalPages: 1 };
  const data = await tmdbFetch(
    `/search/multi?query=${encodeURIComponent(query)}&include_adult=false&page=${page}`
  );
  return {
    movies: (data.results || [])
      .filter(m => m.media_type !== 'person' && m.poster_path)
      .map(m => mapMovie(m, ''))
      .filter(Boolean),
    totalPages: Math.min(data.total_pages || 1, 5),
  };
}
