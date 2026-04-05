'use client';
// ============================================================
// src/components/CategoryClient.js — Category Page with Pagination
// ============================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from './Header';
import BottomNav from './BottomNav';
import { GridCard } from './MovieCard';
import { getCategoryMovies } from '@/lib/tmdb';

export default function CategoryClient({ initialMovies, category, label, totalPages }) {
  const router = useRouter();
  const [movies, setMovies] = useState(initialMovies);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    if (page >= totalPages || loading) return;
    setLoading(true);
    const nextPage = page + 1;
    const { movies: newMovies } = await getCategoryMovies(category, nextPage);
    setMovies(prev => {
      const ids = new Set(prev.map(m => m.tmdb_id));
      return [...prev, ...newMovies.filter(m => !ids.has(m.tmdb_id))];
    });
    setPage(nextPage);
    setLoading(false);
  }

  function handleClick(movie) {
    router.push(`/movie/${movie.slug || movie.tmdb_id}`);
  }

  return (
    <div>
      <Header />
      <div style={{ paddingTop: 55, paddingBottom: 80 }}>
        <div style={{ padding: '12px 15px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => router.back()}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <h1 style={{ fontSize: 16, fontWeight: 'bold' }}>{label}</h1>
        </div>

        <div className="movie-grid">
          {movies.map((m, i) => (
            <GridCard key={m.tmdb_id || i} movie={m} onClick={handleClick} />
          ))}
        </div>

        {page < totalPages && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <button
              onClick={loadMore}
              disabled={loading}
              style={{
                background: '#e50914', border: 'none', color: '#fff',
                padding: '12px 30px', borderRadius: 8, fontSize: 14,
                cursor: loading ? 'wait' : 'pointer', fontWeight: 'bold',
              }}
            >
              {loading ? 'Loading...' : 'আরো দেখুন'}
            </button>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
