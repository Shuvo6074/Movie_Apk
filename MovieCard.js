'use client';
// ============================================================
// src/components/MovieCard.js — Reusable Movie Card
// ============================================================

import { useRouter } from 'next/navigation';

export default function MovieCard({ movie, onClick }) {
  const router = useRouter();

  function handleClick() {
    if (onClick) { onClick(movie); return; }
    if (movie.tmdb_id) {
      router.push(`/movie/${movie.slug || movie.tmdb_id}`);
    }
  }

  return (
    <div className="m-card" onClick={handleClick}>
      <img
        className="m-thumb"
        src={movie.poster || ''}
        alt={movie.title}
        loading="lazy"
        onError={e => { e.target.style.background = '#333'; e.target.src = ''; }}
      />
      {movie.rating && <div className="m-rating">⭐{movie.rating}</div>}
      <div className="m-title">{movie.title}</div>
    </div>
  );
}

// Wide card — Courses/Cartoons এর জন্য
export function WideCard({ movie, onClick }) {
  return (
    <div className="w-card" onClick={() => onClick && onClick(movie)}>
      <img
        className="w-thumb"
        src={movie.poster || ''}
        alt={movie.title}
        loading="lazy"
        onError={e => { e.target.style.background = '#333'; e.target.src = ''; }}
      />
      <div className="w-title">{movie.title}</div>
    </div>
  );
}

// Grid card — Category/Search pages
export function GridCard({ movie, onClick }) {
  const router = useRouter();

  function handleClick() {
    if (onClick) { onClick(movie); return; }
    if (movie.tmdb_id) router.push(`/movie/${movie.slug || movie.tmdb_id}`);
  }

  return (
    <div className="grid-card" onClick={handleClick}>
      <img
        className="grid-thumb"
        src={movie.poster || ''}
        alt={movie.title}
        loading="lazy"
        onError={e => { e.target.style.background = '#333'; e.target.src = ''; }}
      />
      <div className="grid-title">{movie.title}</div>
      {movie.year && <div className="grid-year">{movie.year}</div>}
    </div>
  );
}
