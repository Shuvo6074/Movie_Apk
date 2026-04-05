# 🎬 Movie App — Next.js Version

বাংলা, হিন্দি, হলিউড, সাউথ ইন্ডিয়ান সব মুভি ও ওয়েব সিরিজ — Next.js দিয়ে বানানো।

## ✅ Features
- প্রতিটা মুভির আলাদা URL ও SEO meta
- Auto Sitemap.xml ও robots.txt
- Server switcher (3টা server)
- Season & Episode player
- Actor search
- Watch History
- ভাইরাল ভিডিও page
- Google Sheet + TMDB দুটো source
- PWA support

---

## 🚀 GitHub + Vercel দিয়ে Deploy (সহজ পদ্ধতি)

### Step 1: GitHub Repository বানাও
1. GitHub.com এ login করো
2. New Repository বানাও — নাম দাও: `movie-app`
3. Public রাখো

### Step 2: এই folder টা GitHub এ upload করো
```bash
# তোমার PC তে terminal/cmd খোলো এই folder এ:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOURUSERNAME/movie-app.git
git push -u origin main
```

### Step 3: Vercel এ Deploy (Free!)
1. vercel.com এ login করো (GitHub দিয়ে)
2. "New Project" → তোমার `movie-app` repo select করো
3. Deploy চাপো — ব্যস!

### Step 4: Environment Variables (Vercel Dashboard এ)
Vercel এ গিয়ে Settings → Environment Variables:
```
NEXT_PUBLIC_TMDB_KEY = 1f667f0c8113793e25b6c58845de7d79
NEXT_PUBLIC_SHEET_ID = 1UeXeBdxtOdZmU2_BLYqP_ar3_zMCGuH5zNUDveEK9AI
NEXT_PUBLIC_SITE_URL = https://তোমার-domain.vercel.app
```

### Step 5: GitHub এ কোড push করলে Auto Deploy!
```bash
git add .
git commit -m "Update"
git push
```
Vercel automatically নতুন version deploy করবে।

---

## 📁 Project Structure
```
src/
├── app/
│   ├── page.js              ← Home
│   ├── layout.js            ← Root layout + SEO
│   ├── globals.css          ← সব CSS
│   ├── sitemap.js           ← Auto sitemap
│   ├── robots.js            ← robots.txt
│   ├── movie/[slug]/        ← Movie detail + player
│   ├── category/[slug]/     ← Category pages
│   ├── search/              ← Search page
│   ├── viral/               ← ভাইরাল ভিডিও
│   ├── history/             ← Watch history
│   └── play/                ← Sheet movie player
├── components/
│   ├── Header.js            ← Navigation + Sidebar
│   ├── BottomNav.js         ← Bottom navigation
│   ├── HomeClient.js        ← Home page (interactive)
│   ├── MovieClient.js       ← Movie player
│   ├── CategoryClient.js    ← Category grid
│   ├── SearchClient.js      ← Search
│   ├── ViralClient.js       ← Viral page
│   └── MovieCard.js         ← Reusable cards
└── lib/
    ├── tmdb.js              ← TMDB API
    ├── sheet.js             ← Google Sheet
    └── constants.js         ← Config
```

---

## 🔧 Local এ Run করতে চাইলে
```bash
# Node.js install থাকতে হবে (nodejs.org)
npm install
npm run dev
# Browser এ যাও: http://localhost:3000
```

---

## ❓ Google Rank করতে কী করতে হবে?
1. ✅ এই project deploy করো
2. ✅ Google Search Console এ site add করো
3. ✅ Sitemap submit করো: `https://তোমার-site.com/sitemap.xml`
4. ✅ প্রতিটা মুভির আলাদা URL এখন আছে — Google index করবে
5. ✅ Original content লেখো — মুভির review, description বাংলায়
