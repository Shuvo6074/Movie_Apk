'use client';
// ============================================================
// src/components/SearchClient.js — Search + Actor Search
// তোমার original এর সব feature — Sheet + TMDB + Actor
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from './Header';
import BottomNav from './BottomNav';
import { GridCard } from './MovieCard';

const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_KEY;
const TMDB = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p/w500';

const POPULAR_ACTORS = [
  'Shah Rukh Khan', 'Salman Khan', 'Prabhas', 'Allu Arjun',
  'Vijay', 'Rajinikanth', 'Aamir Khan', 'Hrithik Roshan',
  'Deepika Padukone', 'Tom Cruise', 'Leonardo DiCaprio',
  'Robert Downey Jr', 'Scarlett Johansson', 'Brad Pitt',
  'Dwayne Johnson', 'Ryan Reynolds', 'Chris Evans',
  'Will Smith', 'Keanu Reeves', 'Katrina Kaif',
];

export default function SearchClient({ initialMovies, initialQuery, sheetData = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isActorMode = searchParams.get('actor') === '1';

  const [query, setQuery] = useState(initialQuery || '');
  const [movies, setMovies] = useState(initialMovies || []);
  const [actorInfo, setActorInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const debounce = useRef(null);

  useEffect(() => {
    if (initialQuery) doSearch(initialQuery);
  }, []);

  function handleInput(val) {
    setQuery(val);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      if (val.length > 1) doSearch(val);
      else { setMovies([]); setActorInfo(null); }
    }, 400);
  }

  async function doSearch(q) {
    if (!q) return;
    setLoading(true);
    setActorInfo(null);
    try {
      // TMDB search
      const res = await fetch(
        `${TMDB}/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(q)}&include_adult=false`
      );
      const data = await res.json();
      const results = data.results || [];

      // Actor found?
      const person = results.find(m => m.media_type === 'person' && m.profile_path);

      if (person) {
        // Load actor's movies
        setActorInfo({ name: person.name, photo: `${IMG}${person.profile_path}`, loading: true });
        const mc = await fetch(`${TMDB}/person/${person.id}/combined_credits?api_key=${TMDB_KEY}`);
        const md = await mc.json();
        const actorMovies = (md.cast || [])
          .filter(m => m.poster_path && (m.media_type === 'movie' || m.media_type === 'tv'))
          .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
          .slice(0, 50)
          .map(m => ({
            tmdb_id: m.id,
            title: m.title || m.name,
            poster: `${IMG}${m.poster_path}`,
            year: (m.release_date || m.first_air_date || '').substr(0, 4),
            rating: m.vote_average ? m.vote_average.toFixed(1) : '',
            type: m.media_type === 'tv' ? 'series' : 'movie',
            slug: `${m.id}-${(m.title || m.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          }));
        setActorInfo({ name: person.name, photo: `${IMG}${person.profile_path}`, count: actorMovies.length });
        setMovies(actorMovies);
      } else {
        // Normal movie/series search
        const found = results
          .filter(m => m.media_type !== 'person' && m.poster_path)
          .map(m => ({
            tmdb_id: m.id,
            title: m.title || m.name,
            poster: `${IMG}${m.poster_path}`,
            year: (m.release_date || m.first_air_date || '').substr(0, 4),
            rating: m.vote_average ? m.vote_average.toFixed(1) : '',
            type: m.media_type === 'tv' ? 'series' : 'movie',
            slug: `${m.id}-${(m.title || m.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          }));
        setMovies(found);
      }
    } catch {}
    setLoading(false);
  }

  function handleMovieClick(movie) {
    router.push(`/movie/${movie.slug || movie.tmdb_id}`);
  }

  return (
    <div>
      <Header />
      <div style={{ paddingTop: 55, minHeight: '100vh', paddingBottom: 80 }}>
        {/* Search Bar */}
        <div style={{ padding: '10px 15px' }}>
          <div className="search-top-bar">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style={{ color: '#555', flexShrink: 0 }}>
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              autoFocus
              value={query}
              onChange={e => handleInput(e.target.value)}
              placeholder={isActorMode ? 'Search actor name...' : 'Search movies & series...'}
            />
            {query && (
              <button className="search-close-btn" onClick={() => { setQuery(''); setMovies([]); setActorInfo(null); }}>✕</button>
            )}
          </div>
        </div>

        {/* Actor Info Card */}
        {actorInfo && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 15, background: '#1a1a1a', margin: '0 15px 10px', borderRadius: 10 }}>
            <img src={actorInfo.photo} style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover' }} alt={actorInfo.name} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 'bold' }}>{actorInfo.name}</div>
              <div style={{ fontSize: 12, color: '#888' }}>
                {actorInfo.loading ? 'Loading movies...' : `${actorInfo.count} movies found`}
              </div>
            </div>
          </div>
        )}

        {/* Popular Actors (when no query) */}
        {!query && (
          <div style={{ padding: '10px 15px', color: '#888', fontSize: 13 }}>
            <div style={{ marginBottom: 8 }}>জনপ্রিয় Actor দিয়ে search করুন:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {POPULAR_ACTORS.map(name => (
                <button
                  key={name}
                  onClick={() => { setQuery(name); doSearch(name); }}
                  style={{
                    background: '#1e1e1e', border: '1px solid #333', color: '#fff',
                    padding: '6px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && <div className="loading">Searching...</div>}

        {/* Results */}
        {!loading && movies.length > 0 && (
          <div className="search-grid" style={{ padding: '5px 15px' }}>
            {movies.map((m, i) => (
              <GridCard key={m.tmdb_id || i} movie={m} onClick={handleMovieClick} />
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && query && movies.length === 0 && (
          <div className="loading">No results found</div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
