// ============================================================
// src/app/viral/page.js — ভাইরাল ভিডিও Page
// ============================================================

import { getSheetData } from '@/lib/sheet';
import ViralClient from '@/components/ViralClient';
import { SITE_URL } from '@/lib/constants';

export const metadata = {
  title: 'ভাইরাল ভিডিও — Movie App',
  description: 'সেরা ভাইরাল ভিডিও দেখুন Movie App এ।',
  alternates: { canonical: `${SITE_URL}/viral` },
};

export default async function ViralPage() {
  const sheetData = await getSheetData();
  const viralVideos = sheetData.filter(d => {
    const cats = (d.category || '').split(',').map(c => c.trim().toLowerCase());
    return d.type === 'viral' || cats.includes('ভাইরাল ভিডিও') || cats.includes('viral');
  });

  return <ViralClient videos={viralVideos} />;
}
