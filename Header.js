'use client';
// ============================================================
// src/components/Header.js — Navigation Header
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = () => router.push('/search');

  return (
    <>
      {/* Overlay */}
      <div
        className={`overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-top"><h2>🎬 Movie App</h2></div>
        {[
          { href: '/viral',               label: '🔥 ভাইরাল ভিডিও' },
          { href: '/',                    label: '🏠 Home' },
          { href: '/category/popular',    label: '🎬 Popular Movies' },
          { href: '/category/top-rated',  label: '⭐ Top Rated' },
          { href: '/category/web-series', label: '📺 Web Series' },
          { href: '/category/kolkata',    label: '🎬 Kolkata Bengali' },
          { href: '/category/hindi',      label: '🎭 Bollywood Hindi' },
          { href: '/category/indian',     label: '🇮🇳 South Indian' },
          { href: '/category/anime',      label: '🎌 Anime' },
          { href: '/category/hollywood',  label: '🌐 Hollywood' },
          { href: '/category/18plus',     label: '🔞 18+ Section' },
        ].map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="s-item"
            onClick={() => setSidebarOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Header */}
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <button className="menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Menu">
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>
        <Link href="/" className="logo-text">Movie App</Link>
        <div className="search-wrap">
          <button className="search-icon-btn" onClick={handleSearch} aria-label="Search">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
        </div>
      </header>
    </>
  );
}
