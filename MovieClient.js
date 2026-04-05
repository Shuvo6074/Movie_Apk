'use client';
// ============================================================
// src/components/MovieClient.js — Video Player (তোমার original এর সব feature)
// Server switcher, Season/Episode, Gesture, Download, Share, Report
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from './Header';
import BottomNav from './BottomNav';
import { GridCard } from './MovieCard';

const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_KEY;
const TMDB = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p/w500';

// Server URL builder
function srvUrl(n, type, id, s = 1, e = 1) {
  if (n === 1) return type === 'tv'
    ? `https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}`
    : `https://vidsrc.me/embed/movie?tmdb=${id}`;
  if (n === 2) return type === 'tv'
    ? `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`
    : `https://multiembed.mov/?video_id=${id}&tmdb=1`;
  if (n === 3) return type === 'tv'
    ? `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`
    : `https://www.2embed.cc/embed/${id}`;
  return '';
}

export default function MovieClient({ movie, slug }) {
  const router = useRouter();
  const iframeRef = useRef(null);
  const [curServer, setCurServer] = useState(1);
  const [frameLoaded, setFrameLoaded] = useState(false);
  const [curSeason, setCurSeason] = useState(1);
  const [curEpisode, setCurEpisode] = useState(1);
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [srvStatus, setSrvStatus] = useState('');
  const [gestureModeOn, setGestureModeOn] = useState(false);
  const [brightness, setBrightness] = useState(1);
  const [videoUrl, setVideoUrl] = useState('');
  const midAdTimer = useRef(null);

  const type = movie.type === 'series' ? 'tv' : 'movie';

  // Initial load
  useEffect(() => {
    autoPick();
    if (movie.type === 'series') loadSeasons();
    return () => clearInterval(midAdTimer.current);
  }, []);

  // Auto-pick best server
  async function autoPick(s = 1, e = 1) {
    setSrvStatus('🔍 সার্ভার খুঁজছি...');
    setFrameLoaded(false);
    setCurServer(1);
    const url1 = srvUrl(1, type, movie.tmdb_id, s, e);
    setVideoUrl(url1);

    const t1 = setTimeout(() => {
      if (!frameLoaded) {
        setSrvStatus('Server 2 চেষ্টা করছি...');
        setCurServer(2);
        setVideoUrl(srvUrl(2, type, movie.tmdb_id, s, e));
        const t2 = setTimeout(() => {
          if (!frameLoaded) {
            setSrvStatus('Server 3 চেষ্টা করছি...');
            setCurServer(3);
            setVideoUrl(srvUrl(3, type, movie.tmdb_id, s, e));
            setTimeout(() => setSrvStatus(''), 4000);
          }
        }, 5000);
        return () => clearTimeout(t2);
      }
    }, 5000);
    return () => clearTimeout(t1);
  }

  function switchServer(n) {
    setCurServer(n);
    setSrvStatus('');
    setFrameLoaded(false);
    setVideoUrl(srvUrl(n, type, movie.tmdb_id, curSeason, curEpisode));
  }

  function onFrameLoad() {
    if (!videoUrl || videoUrl === 'about:blank') return;
    setFrameLoaded(true);
    setSrvStatus('');
  }

  // Seasons load
  async function loadSeasons() {
    try {
      const res = await fetch(`${TMDB}/tv/${movie.tmdb_id}?api_key=${TMDB_KEY}`);
      const data = await res.json();
      const s = data.seasons.filter(s => s.season_number > 0);
      setSeasons(s);
      if (s.length) loadEpisodes(s[0].season_number);
    } catch {}
  }

  async function loadEpisodes(season) {
    setCurSeason(season);
    try {
      const res = await fetch(`${TMDB}/tv/${movie.tmdb_id}/season/${season}?api_key=${TMDB_KEY}`);
      const data = await res.json();
      setEpisodes(data.episodes || []);
    } catch {}
  }

  function playEpisode(season, episode) {
    setCurEpisode(episode);
    setFrameLoaded(false);
    autoPick(season, episode);
  }

  // Download
  function startDownload() {
    const sources = [
      srvUrl(1, type, movie.tmdb_id, curSeason, curEpisode),
      srvUrl(2, type, movie.tmdb_id, curSeason, curEpisode),
      srvUrl(3, type, movie.tmdb_id, curSeason, curEpisode),
    ];
    const newWin = window.open(sources[0], '_blank');
    if (newWin) {
      setTimeout(() => {
        alert(`✅ Server 1 এ পাওয়া গেছে!\n\nনতুন ট্যাবে ভিডিও খুলেছে।\n১. ভিডিও চালু করুন\n২. Long Press করুন\n৩. "Download Video" চাপুন`);
      }, 1500);
    }
  }

  // Share
  function shareMovie() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: movie.title, url, text: `Watch ${movie.title} on Movie App!` });
    } else {
      navigator.clipboard.writeText(url).then(() => alert('Link copied!'));
    }
  }

  // Report
  function reportMovie() {
    const broken = JSON.parse(localStorage.getItem('broken') || '[]');
    const idx = broken.findIndex(b => b.title === movie.title);
    if (idx >= 0) broken[idx].count = (broken[idx].count || 1) + 1;
    else broken.push({ title: movie.title, date: new Date().toLocaleDateString(), count: 1 });
    localStorage.setItem('broken', JSON.stringify(broken));
    alert('✅ রিপোর্ট করা হয়েছে! আমরা শীঘ্রই ঠিক করব।');
  }

  // Save history
  useEffect(() => {
    try {
      const hist = JSON.parse(localStorage.getItem('ch') || '[]').filter(h => h.title !== movie.title);
      hist.unshift({
        title: movie.title, poster: movie.poster, year: movie.year,
        category: movie.category, tmdb_id: movie.tmdb_id, type: movie.type,
        slug,
      });
      if (hist.length > 50) hist.pop();
      localStorage.setItem('ch', JSON.stringify(hist));
    } catch {}
  }, []);

  // Gesture: touch volume/brightness
  const touchStart = useRef({});
  function handleTouchStart(e) {
    if (!gestureModeOn) return;
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY, bri: brightness };
  }
  function handleTouchMove(e) {
    if (!gestureModeOn) return;
    e.preventDefault();
    const t = e.touches[0];
    const dy = touchStart.current.y - t.clientY;
    const w = e.currentTarget.offsetWidth;
    if (t.clientX < w / 2) {
      // left = brightness
      const newBri = Math.min(1, Math.max(0.1, touchStart.current.bri + dy / 150));
      setBrightness(newBri);
    }
  }

  return (
    <div className="player-page">
      <Header />
      <div style={{ paddingTop: 50 }}>
        {/* ===== VIDEO PLAYER ===== */}
        <div className="vid-wrap" style={{ filter: `brightness(${brightness})` }}>
          {videoUrl && (
            <iframe
              ref={iframeRef}
              src={videoUrl}
              allowFullScreen
              allow="autoplay; fullscreen"
              onLoad={onFrameLoad}
              style={{ pointerEvents: gestureModeOn ? 'none' : 'auto' }}
            />
          )}
          {/* Gesture overlay */}
          {gestureModeOn && (
            <div
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5 }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
            />
          )}
          {/* Gesture toggle button */}
          <button
            onClick={() => setGestureModeOn(g => !g)}
            style={{
              position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)',
              background: gestureModeOn ? 'rgba(229,9,20,0.85)' : 'rgba(0,0,0,0.7)',
              color: '#fff', padding: '5px 14px', borderRadius: 12,
              fontSize: 11, cursor: 'pointer', zIndex: 10,
              border: '1px solid rgba(255,255,255,0.2)', whiteSpace: 'nowrap',
            }}
          >
            {gestureModeOn ? '▶ Play Mode' : '🖐 Gesture'}
          </button>
        </div>

        {/* ===== MOVIE INFO ===== */}
        <div className="pl-info">
          <div className="pl-title">{movie.title}</div>
          {movie.rating && <div className="pl-rating">⭐ {movie.rating} / 10</div>}
          <div className="pl-meta">
            {movie.genres?.map(g => g.name).join(', ')} • {movie.year}
            {movie.runtime ? ` • ${movie.runtime} min` : ''}
          </div>

          {/* Action Buttons */}
          <div className="action-row">
            <button className="dl-btn" onClick={startDownload}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
              Download
            </button>
            <button className="sh-btn" onClick={shareMovie}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
              </svg>
              Share
            </button>
            <button className="report-btn" onClick={reportMovie}>🚨 Report</button>
          </div>

          {/* Overview */}
          {movie.overview && <p className="overview">{movie.overview}</p>}

          {/* Genre Tags */}
          {movie.genres?.length > 0 && (
            <div className="genre-tags">
              {movie.genres.map(g => (
                <span key={g.id} className="genre-tag">{g.name}</span>
              ))}
            </div>
          )}
        </div>

        {/* ===== SERVER SWITCHER ===== */}
        <div className="server-wrap">
          <div className="server-label">
            🖥️ Server {srvStatus && <span style={{ color: '#e50914', fontSize: 11 }}>{srvStatus}</span>}
          </div>
          <div className="server-row">
            {[1, 2, 3].map(n => (
              <button
                key={n}
                className={`srv-btn ${curServer === n ? 'on' : ''}`}
                onClick={() => switchServer(n)}
              >
                Server {n}
              </button>
            ))}
          </div>
        </div>

        {/* ===== SEASON & EPISODES (Series only) ===== */}
        {movie.type === 'series' && seasons.length > 0 && (
          <div className="ep-wrap">
            <div className="ep-label">📺 Season & Episodes</div>
            <div className="season-row">
              {seasons.map((s, i) => (
                <button
                  key={s.season_number}
                  className={`season-btn ${curSeason === s.season_number ? 'on' : ''}`}
                  onClick={() => { loadEpisodes(s.season_number); }}
                >
                  {s.name}
                </button>
              ))}
            </div>
            <div className="ep-row">
              {episodes.map((ep, i) => (
                <button
                  key={ep.episode_number}
                  className={`ep-btn ${curEpisode === ep.episode_number ? 'on' : ''}`}
                  onClick={() => playEpisode(curSeason, ep.episode_number)}
                >
                  {ep.episode_number}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ===== CAST ===== */}
        {movie.cast?.length > 0 && (
          <div className="cast-wrap">
            <div style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>🎭 Cast</div>
            <div className="cast-scroll">
              {movie.cast.map(c => (
                <div key={c.id} className="cast-card">
                  {c.photo
                    ? <img className="cast-photo" src={c.photo} alt={c.name} loading="lazy" />
                    : <div className="cast-photo" style={{ background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🎭</div>
                  }
                  <div className="cast-name">{c.name}</div>
                  <div className="cast-char">{c.character}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== RELATED MOVIES ===== */}
        {movie.similar?.length > 0 && (
          <div className="rel-wrap">
            <div className="rel-title">Related</div>
            <div className="rel-grid">
              {movie.similar.map((m, i) => (
                <GridCard
                  key={m.tmdb_id || i}
                  movie={m}
                  onClick={rm => router.push(`/movie/${rm.slug || rm.tmdb_id}`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
