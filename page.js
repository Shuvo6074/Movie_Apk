// ============================================================
// src/app/movie/[slug]/page.js — প্রতিটা মুভির আলাদা URL ও SEO
// ============================================================

import { getMovieDetail } from '@/lib/tmdb';
import MovieClient from '@/components/MovieClient';
import { SITE_URL, IMG } from '@/lib/constants';
import { notFound } from 'next/navigation';

// slug থেকে tmdb_id বের করা — format: "123-movie-title"
function getIdFromSlug(slug) {
  const parts = slug.split('-');
  const id = parseInt(parts[0]);
  return isNaN(id) ? null : id;
}

// ========== Dynamic SEO Metadata ==========
export async function generateMetadata({ params }) {
  const { slug } = params;
  const tmdbId = getIdFromSlug(slug);
  if (!tmdbId) return { title: 'Movie Not Found' };

  const movie = await getMovieDetail(tmdbId);
  if (!movie) return { title: 'Movie Not Found' };

  const type = slug.includes('series') ? 'series' : 'movie';

  return {
    title: `${movie.title} (${movie.year}) — বাংলায় দেখুন`,
    description: movie.overview || `${movie.title} দেখুন Movie App এ। ${movie.genres?.map(g => g.name).join(', ')}।`,
    keywords: [movie.title, `${movie.title} watch online`, `${movie.title} bangla`, ...movie.genres?.map(g => g.name) || []],
    alternates: { canonical: `${SITE_URL}/movie/${slug}` },
    openGraph: {
      title: `${movie.title} (${movie.year})`,
      description: movie.overview,
      images: [{ url: movie.poster, width: 500, height: 750, alt: movie.title }],
      type: 'video.movie',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${movie.title} (${movie.year})`,
      description: movie.overview,
      images: [movie.poster],
    },
    other: {
      'schema:Movie': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': type === 'series' ? 'TVSeries' : 'Movie',
        name: movie.title,
        datePublished: movie.year,
        description: movie.overview,
        image: movie.poster,
        genre: movie.genres?.map(g => g.name),
        aggregateRating: movie.rating ? {
          '@type': 'AggregateRating',
          ratingValue: movie.rating,
          bestRating: '10',
          ratingCount: '1000',
        } : undefined,
        actor: movie.cast?.slice(0, 5).map(c => ({
          '@type': 'Person',
          name: c.name,
        })),
      }),
    },
  };
}

// ========== Page Component ==========
export default async function MoviePage({ params }) {
  const { slug } = params;
  const tmdbId = getIdFromSlug(slug);

  if (!tmdbId) return notFound();

  const movie = await getMovieDetail(tmdbId);
  if (!movie) return notFound();

  // JSON-LD Schema for this movie
  const schema = {
    '@context': 'https://schema.org',
    '@type': movie.type === 'series' ? 'TVSeries' : 'Movie',
    name: movie.title,
    datePublished: movie.year,
    description: movie.overview,
    image: movie.poster,
    url: `${SITE_URL}/movie/${slug}`,
    genre: movie.genres?.map(g => g.name),
    actor: movie.cast?.slice(0, 5).map(c => ({
      '@type': 'Person',
      name: c.name,
    })),
    ...(movie.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: movie.rating,
        bestRating: '10',
        ratingCount: '1000',
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Static HTML for Google Bot */}
      <noscript>
        <div style={{ padding: 20, color: '#fff', background: '#0f0f0f' }}>
          <h1>{movie.title} ({movie.year})</h1>
          <p>{movie.overview}</p>
          <p>Genre: {movie.genres?.map(g => g.name).join(', ')}</p>
          {movie.rating && <p>Rating: ⭐ {movie.rating}/10</p>}
          <h2>Cast</h2>
          <ul>{movie.cast?.map(c => <li key={c.id}>{c.name} as {c.character}</li>)}</ul>
        </div>
      </noscript>

      {/* Interactive Player */}
      <MovieClient movie={movie} slug={slug} />
    </>
  );
}
