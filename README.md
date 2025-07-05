# The Final Reel 🎬

A modern, full-stack movie discovery web application built with **React + TypeScript**, **Vite**, **Tailwind CSS**, **Supabase**, and **TMDB**.  
Browse popular and trending titles, dive into beautiful, information-rich detail pages, keep personalised watchlists & playlists, write reviews, and explore similar recommendations – all wrapped in a sleek neon-noir UI.

---

## ✨ Features

1. **Home / Trending / Popular** – swipeable hero banner & infinite-scroll grids.  
2. **Powerful Search** – fuzzy search across the entire TMDB catalogue.
3. **Movie Detail Page**  
   • Gorgeous hero with trailer modal and age-rating badge.  
   • Cast & Crew spotlight and key-crew cards.  
   • "If you liked this…" similar-movie carousel.  
   • Streaming availability – see where to watch across multiple platforms.
   • IMDb and Rotten Tomatoes ratings integration.
   • Community Reviews with rating, profanity filter & RLS-secured CRUD.  
4. **Watchlist** – private collection synced to Supabase.  
5. **Playlists** – shareable, publicly viewable lists.  
6. **Auth** – magic-link + OAuth via Supabase.  
7. **Responsive & Accessible** – dark-mode native, keyboard-navigable, motion-reduced friendly.

Upcoming: Advanced filters, i18n, PWA support.

---

## 🏗️ Tech Stack

| Layer | Tech |
|-------|------|
| Front-end | React 18, TypeScript, Vite, React-Router 6, TanStack Query, Framer-Motion |
| Styling | Tailwind CSS, PostCSS, Lucide-React icons |
| Back-end | Supabase (Postgres + Auth + Edge), Row-Level-Security |
| Data | TMDB REST API, Streaming Availability API (RapidAPI) |
| Tooling | ESLint, Prettier, react-hot-toast, Vitest (coming soon) |

---

## 🚀 Quick Start

```bash
# 1. Clone
$ git clone https://github.com/yourusername/the-final-reel.git
$ cd the-final-reel

# 2. Install
$ npm install

# 3. Configure environment variables
$ cp .env.example .env
#   – fill in your Supabase + TMDB + RapidAPI credentials

# 4. Run dev server
$ npm run dev
# → http://localhost:5173
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon public key |
| `VITE_TMDB_BASE_URL` | `https://api.themoviedb.org/3` |
| `VITE_TMDB_API_KEY` | TMDB Bearer token |
| `VITE_TMDB_IMAGE_BASE_URL` | `https://image.tmdb.org/t/p` |
| `VITE_RAPIDAPI_KEY` | RapidAPI key for streaming availability |
| `VITE_STREAMING_API_URL` | `https://streaming-availability.p.rapidapi.com` |

> **Note:** you can generate a TMDB v4 read access token in your TMDB account settings.

---

## 🗄️ Database

All database resources live in the `supabase/` folder. Apply with **Supabase Migrations** or run manually in the SQL editor.

### Tables

* `profiles` – auth.user ↔︎ display name, avatar.
* `watchlist`
* `playlists` / `playlist_items`
* `reviews` – see [`create_reviews_table.sql`](create_reviews_table.sql)

### Row-Level Security

* Public (`anon`) can **read** approved reviews.  
* Authenticated users can **insert / update / delete** their own rows.

See `create_reviews_table.sql` for full policy definitions.

---

## 📂 Project Structure

```
The Final Reel/
├─ src/
│  ├─ components/          # Reusable UI pieces & feature widgets
│  ├─ hooks/               # React hooks (Supabase, queries, etc.)
│  ├─ lib/                 # API clients, util functions
│  ├─ pages/               # Route-level components
│  ├─ index.css            # Tailwind layer config + custom animations
│  └─ main.tsx            # React entry
├─ supabase/               # SQL migrations & seeders
├─ releases/               # Changelogs (see below)
├─ README.md
└─ ...
```

---

## 📦 NPM Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server + HMR |
| `npm run build` | Production bundle |
| `npm run preview` | Preview built app |
| `npm run lint` | ESLint + TypeScript checks |

---

## 📝 Contributing

1. Fork & branch from `main`.  
2. Follow the existing ESLint/Prettier rules (`npm run lint`).  
3. Submit a clear, descriptive pull request – screenshots welcome!

All contributions are welcome, from code to documentation and design feedback.

---

## 🗒️ Releases

Release notes live under [`/releases`](./releases).  
Current stable: **[v0.1](releases/v0.1.md)**.

---

## 🛡️ License

MIT © 2025 The Final Reel 