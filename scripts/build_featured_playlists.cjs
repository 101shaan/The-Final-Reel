/*
  Build a fresh featured playlists migration with VERIFIED TMDB data.

  Requirements:
  - Set TMDB bearer token in environment as either TMDB_BEARER or VITE_TMDB_API_KEY (v4 auth token)
  - Run: npm run generate:playlists

  Output:
  - Creates supabase/migrations/<timestamp>_featured_playlists_seed.sql
  - Deletes existing featured playlists with IDs 000...001 through 000...009
  - Inserts curated playlists and 10 movies each with correct TMDB IDs and image paths
*/

const fs = require('fs');
const path = require('path');
const axios = require('axios');
let dotenvLoaded = false;
try {
  const dotenv = require('dotenv');
  dotenv.config();
  // Also try .env.local if present (common with Vite projects)
  const localEnvPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(localEnvPath)) {
    dotenv.config({ path: localEnvPath });
  }
  dotenvLoaded = true;
} catch (_) {}

// Accept both v4 bearer and v3 api key
const RAW_TOKEN = process.env.TMDB_BEARER || process.env.VITE_TMDB_API_KEY || process.env.TMDB_V3_API_KEY || process.env.TMDB_API_KEY;
if (!RAW_TOKEN) {
  console.error('Missing TMDB credentials. Provide either a v4 bearer token (TMDB_BEARER or VITE_TMDB_API_KEY) or a v3 API key (TMDB_V3_API_KEY or TMDB_API_KEY).');
  if (!dotenvLoaded) {
    console.error('Tip: Add a .env or .env.local file at project root.');
  }
  process.exit(1);
}

const isLikelyBearer = typeof RAW_TOKEN === 'string' && (RAW_TOKEN.startsWith('eyJ') || RAW_TOKEN.includes('.'));

const tmdb = axios.create({
  baseURL: process.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  headers: isLikelyBearer
    ? { Authorization: `Bearer ${RAW_TOKEN}`, 'Content-Type': 'application/json;charset=utf-8' }
    : { 'Content-Type': 'application/json;charset=utf-8' },
  timeout: 20000,
});

// For v3 API keys, ensure api_key is appended to every request
if (!isLikelyBearer) {
  tmdb.interceptors.request.use((config) => {
    config.params = config.params || {};
    config.params.api_key = RAW_TOKEN;
    return config;
  });
}

/** Curated playlists with canonical titles and years to disambiguate */
const curated = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    title: 'Animated Classics',
    description: 'The very best animated films from around the world',
    movies: [
      { title: 'Spirited Away', year: 2001 },
      { title: 'The Lion King', year: 1994 },
      { title: 'Beauty and the Beast', year: 1991 },
      { title: 'Toy Story', year: 1995 },
      { title: 'Princess Mononoke', year: 1997 },
      { title: 'WALL·E', year: 2008 },
      { title: 'My Neighbor Totoro', year: 1988 },
      { title: 'The Iron Giant', year: 1999 },
      { title: 'Snow White and the Seven Dwarfs', year: 1937 },
      { title: 'Pinocchio', year: 1940 },
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    title: 'Horror Essentials',
    description: 'Must-watch horror films that defined the genre',
    movies: [
      { title: 'The Exorcist', year: 1973 },
      { title: 'Halloween', year: 1978 },
      { title: 'The Shining', year: 1980 },
      { title: 'Psycho', year: 1960 },
      { title: 'Alien', year: 1979 },
      { title: 'The Silence of the Lambs', year: 1991 },
      { title: 'Scream', year: 1996 },
      { title: 'Jaws', year: 1975 },
      { title: 'The Birds', year: 1963 },
      { title: 'The Thing', year: 1982 },
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    title: 'Romance Classics',
    description: 'Timeless love stories that capture the heart',
    movies: [
      { title: 'Casablanca', year: 1942 },
      { title: 'The Princess Bride', year: 1987 },
      { title: 'Titanic', year: 1997 },
      { title: 'The Notebook', year: 2004 },
      { title: 'Pretty Woman', year: 1990 },
      { title: 'Ghost', year: 1990 },
      { title: 'When Harry Met Sally...', year: 1989 },
      { title: 'Roman Holiday', year: 1953 },
      { title: 'Dirty Dancing', year: 1987 },
      { title: 'Gone with the Wind', year: 1939 },
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    title: 'Comedy Classics',
    description: 'The funniest films ever made',
    movies: [
      { title: 'Some Like It Hot', year: 1959 },
      { title: 'Airplane!', year: 1980 },
      { title: 'The Big Lebowski', year: 1998 },
      { title: 'Groundhog Day', year: 1993 },
      { title: 'Young Frankenstein', year: 1974 },
      { title: 'Blazing Saddles', year: 1974 },
      { title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb', year: 1964 },
      { title: 'Annie Hall', year: 1977 },
      { title: 'Ghostbusters', year: 1984 },
      { title: 'Monty Python and the Holy Grail', year: 1975 },
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    title: 'Adventure Epics',
    description: 'Epic adventures that take you on incredible journeys',
    movies: [
      { title: 'Raiders of the Lost Ark', year: 1981 },
      { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
      { title: 'The Lord of the Rings: The Two Towers', year: 2002 },
      { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
      { title: 'Lawrence of Arabia', year: 1962 },
      { title: 'The Adventures of Robin Hood', year: 1938 },
      { title: 'North by Northwest', year: 1959 },
      { title: 'The Bridge on the River Kwai', year: 1957 },
      { title: 'The Treasure of the Sierra Madre', year: 1948 },
      { title: 'The African Queen', year: 1951 },
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000006',
    title: 'Crime Masterpieces',
    description: 'The greatest crime films ever crafted',
    movies: [
      { title: 'The Godfather', year: 1972 },
      { title: 'The Godfather Part II', year: 1974 },
      { title: 'Goodfellas', year: 1990 },
      { title: 'Pulp Fiction', year: 1994 },
      { title: 'Scarface', year: 1983 },
      { title: 'The Departed', year: 2006 },
      { title: 'Casino', year: 1995 },
      { title: 'Heat', year: 1995 },
      { title: 'Chinatown', year: 1974 },
      { title: 'The Maltese Falcon', year: 1941 },
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000007',
    title: 'Family Favorites',
    description: 'Perfect films for the whole family to enjoy',
    movies: [
      { title: 'E.T. the Extra-Terrestrial', year: 1982 },
      { title: 'The Wizard of Oz', year: 1939 },
      { title: 'Mary Poppins', year: 1964 },
      { title: 'The Sound of Music', year: 1965 },
      { title: 'Home Alone', year: 1990 },
      { title: 'The NeverEnding Story', year: 1984 },
      { title: 'Big', year: 1988 },
      { title: 'The Karate Kid', year: 1984 },
      { title: 'Back to the Future', year: 1985 },
      { title: 'The Sandlot', year: 1993 },
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000008',
    title: 'Fantasy Epics',
    description: 'Magical worlds and extraordinary adventures',
    movies: [
      { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
      { title: 'The Lord of the Rings: The Two Towers', year: 2002 },
      { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
      { title: 'The Wizard of Oz', year: 1939 },
      { title: "Pan's Labyrinth", year: 2006 },
      { title: 'The Princess Bride', year: 1987 },
      { title: 'The NeverEnding Story', year: 1984 },
      { title: 'Edward Scissorhands', year: 1990 },
      { title: 'Spirited Away', year: 2001 },
      { title: 'Harry Potter and the Goblet of Fire', year: 2005 },
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000009',
    title: 'Sci-Fi Classics',
    description: 'Visionary science fiction that shaped the future',
    movies: [
      { title: '2001: A Space Odyssey', year: 1968 },
      { title: 'Blade Runner', year: 1982 },
      { title: 'Star Wars', year: 1977 },
      { title: 'The Matrix', year: 1999 },
      { title: 'Alien', year: 1979 },
      { title: 'E.T. the Extra-Terrestrial', year: 1982 },
      { title: 'Terminator 2: Judgment Day', year: 1991 },
      { title: 'Back to the Future', year: 1985 },
      { title: 'Close Encounters of the Third Kind', year: 1977 },
      { title: 'Interstellar', year: 2014 },
    ],
  },
];

function normalize(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[:'’!.,()\-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function searchMovie(title, year) {
  const params = { query: title, include_adult: false };
  if (year) params.year = year;
  const res = await tmdb.get('/search/movie', { params });
  const results = res.data?.results || [];
  if (results.length === 0) return null;

  const nTitle = normalize(title);
  const exactYear = year;

  const exactMatches = results.filter((r) => normalize(r.title) === nTitle);
  const yearMatches = exactYear
    ? results.filter((r) => (r.release_date || '').startsWith(String(exactYear)))
    : [];

  const pickFrom = exactMatches.length > 0 ? exactMatches
                : yearMatches.length > 0 ? yearMatches
                : results;

  return pickFrom.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))[0];
}

async function getMovieDetails(id) {
  const res = await tmdb.get(`/movie/${id}`);
  return res.data;
}

function nowTimestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return (
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

async function buildMigration() {
  console.log('Building featured playlists migration...');
  const lines = [];
  lines.push('/*');
  lines.push('  # Featured Playlists (Reseed)');
  lines.push('  - Generated by scripts/build_featured_playlists.cjs');
  lines.push('  - Uses TMDB data to ensure correct IDs and images');
  lines.push('*/');
  lines.push('');
  lines.push('-- Remove existing featured playlists');
  lines.push('DELETE FROM playlist_movies WHERE playlist_id IN (' + curated.map((p) => `'${p.id}'`).join(', ') + ');');
  lines.push('DELETE FROM playlists WHERE id IN (' + curated.map((p) => `'${p.id}'`).join(', ') + ');');
  lines.push('');

  lines.push('-- Insert curated featured playlists');
  lines.push('INSERT INTO playlists (id, user_id, title, description, cover_image, is_public, is_featured, created_at) VALUES');
  curated.forEach((pl, idx) => {
    const cover = 'https://image.tmdb.org/t/p/w780';
    lines.push(
      `  ('${pl.id}', NULL, '${pl.title.replace(/'/g, "''")}', '${pl.description.replace(/'/g, "''")}', '${cover}', true, true, now())${idx === curated.length - 1 ? '' : ','}`
    );
  });
  lines.push('ON CONFLICT (id) DO NOTHING;');
  lines.push('');

  for (const playlist of curated) {
    console.log(`Fetching movies for: ${playlist.title}`);
    const items = [];
    let order = 1;
    for (const m of playlist.movies) {
      try {
        const found = await searchMovie(m.title, m.year);
        if (!found) {
          console.warn(`  Not found: ${m.title} (${m.year || ''})`);
          continue;
        }
        const details = await getMovieDetails(found.id);
        items.push({
          id: found.id,
          title: details.title,
          poster_path: details.poster_path || '',
          backdrop_path: details.backdrop_path || '',
          vote_average: details.vote_average || 0,
          year: (details.release_date || '').slice(0, 4) || '0',
          order,
        });
        order += 1;
      } catch (err) {
        console.warn(`  Error fetching ${m.title}:`, err.response?.status || err.message);
      }
    }

    if (items.length === 0) continue;

    const coverFull = items[0].poster_path ? `https://image.tmdb.org/t/p/w780${items[0].poster_path}` : '';
    lines.push(`-- ${playlist.title}`);
    lines.push(`UPDATE playlists SET cover_image = '${coverFull}' WHERE id = '${playlist.id}';`);
    lines.push('INSERT INTO playlist_movies (playlist_id, movie_id, movie_title, movie_poster, movie_backdrop, movie_rating, movie_year, order_index) VALUES');
    items.forEach((it, idx) => {
      const row = `  ('${playlist.id}', ${it.id}, '${it.title.replace(/'/g, "''")}', '${it.poster_path}', '${it.backdrop_path}', ${Number(it.vote_average).toFixed(1)}, ${parseInt(it.year || '0', 10) || 0}, ${it.order})${idx === items.length - 1 ? '' : ','}`;
      lines.push(row);
    });
    lines.push('ON CONFLICT (playlist_id, movie_id) DO NOTHING;');
    lines.push('');
  }

  const dir = path.join(process.cwd(), 'supabase', 'migrations');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filename = `${nowTimestamp()}_featured_playlists_seed.sql`;
  const filepath = path.join(dir, filename);
  fs.writeFileSync(filepath, lines.join('\n'), 'utf8');
  console.log('Wrote migration:', filepath);
}

buildMigration().catch((e) => {
  console.error('Failed to build migration:', e);
  process.exit(1);
});


