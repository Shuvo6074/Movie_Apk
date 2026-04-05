'use client';
// ============================================================
// src/components/ViralClient.js — ভাইরাল ভিডিও Page
// ============================================================

import { useRouter } from 'next/navigation';
import Header from './Header';
import BottomNav from './BottomNav';

export default function ViralClient({ videos }) {
  const router = useRouter();

  function handleClick(video) {
    // Sheet viral video — play page এ পাঠাই
    router.push(`/play?sheet=${encodeURIComponent(JSON.stringify(video))}`);
  }

  return (
    <div>
      <Header />
      <div style={{ paddingTop: 55, paddingBottom: 80 }}>
        <div style={{ padding: '12px 15px 8px', fontSize: 18, fontWeight: 'bold' }}>
          🔥 ভাইরাল ভিডিও
        </div>

        {videos.length === 0 && (
          <div className="loading">কোনো ভিডিও নেই</div>
        )}

        <div className="viral-page-grid">
          {videos.map((v, i) => (
            <div key={i} className="vp-card" onClick={() => handleClick(v)}>
              <div className="vp-thumb-wrap">
                <img
                  className="vp-thumb"
                  src={v.poster || ''}
                  alt={v.title}
                  loading="lazy"
                  onError={e => { e.target.style.background = '#333'; e.target.src = ''; }}
                />
              </div>
              <div className="vp-info">
                <div className="vp-avatar">🔥</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="vp-title">{v.title}</div>
                  <div className="vp-meta">ভাইরাল ভিডিও</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
