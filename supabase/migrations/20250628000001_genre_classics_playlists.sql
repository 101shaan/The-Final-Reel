/*
  # Genre Classics Playlists Migration

  1. Remove existing featured playlists
  2. Create new genre-based classic playlists
  3. Add movies to each playlist
*/

-- Delete existing featured playlists and their movies
DELETE FROM playlist_movies WHERE playlist_id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000005'
);

DELETE FROM playlists WHERE id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000005'
);

-- Insert new genre-based classic playlists
INSERT INTO playlists (id, user_id, title, description, cover_image, is_public, is_featured, created_at) VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    NULL,
    'Animated Classics',
    'The very best animated films from around the world',
    'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    true,
    true,
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    NULL,
    'Horror Essentials',
    'Must-watch horror films that defined the genre',
    'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    true,
    true,
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    NULL,
    'Romance Classics',
    'Timeless love stories that capture the heart',
    'https://image.tmdb.org/t/p/w500/kEl2t3OhXc3Zb9FBh1AuYzRTgZp.jpg',
    true,
    true,
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    NULL,
    'Comedy Classics',
    'The funniest films ever made',
    'https://image.tmdb.org/t/p/w500/uO2yU3QiGHvVp0L5e5IatTVRkYk.jpg',
    true,
    true,
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000005',
    NULL,
    'Adventure Epics',
    'Epic adventures that take you on incredible journeys',
    'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
    true,
    true,
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000006',
    NULL,
    'Crime Masterpieces',
    'The greatest crime films ever crafted',
    'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    true,
    true,
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000007',
    NULL,
    'Family Favorites',
    'Perfect films for the whole family to enjoy',
    'https://image.tmdb.org/t/p/w500/5Jgp5VeNNGZuNW4ZNNvhbKnNfXP.jpg',
    true,
    true,
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000008',
    NULL,
    'Fantasy Epics',
    'Magical worlds and extraordinary adventures',
    'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
    true,
    true,
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000009',
    NULL,
    'Sci-Fi Classics',
    'Visionary science fiction that shaped the future',
    'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    true,
    true,
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- Animated Classics movies
INSERT INTO playlist_movies (playlist_id, movie_id, movie_title, movie_poster, movie_backdrop, movie_rating, movie_year, order_index) VALUES
  ('00000000-0000-0000-0000-000000000001', 129, 'Spirited Away', '/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg', '/bSXfU4dwZyBA05FHgWGdW3IzDpw.jpg', 8.5, 2001, 1),
  ('00000000-0000-0000-0000-000000000001', 8587, 'The Lion King', '/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg', '/hKadecGEOTUxHZNvtB39KHKHb6O.jpg', 8.5, 1994, 2),
  ('00000000-0000-0000-0000-000000000001', 10020, 'Beauty and the Beast', '/tWqifoYuwLETmmasnGHO7xBjEtt.jpg', '/9bbflgZXz2Uw9wbJGhyj8LgZxK0.jpg', 8.0, 1991, 3),
  ('00000000-0000-0000-0000-000000000001', 862, 'Toy Story', '/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg', '/4w7IHMFcuFNY7nCjJmm1jKQdMjR.jpg', 8.3, 1995, 4),
  ('00000000-0000-0000-0000-000000000001', 128, 'Princess Mononoke', '/jHWmNr7m544fJ8eItsfNk8fs2Ed.jpg', '/gzlJkVfWV5VEG5xK25cvFGJgWAc.jpg', 8.4, 1997, 5),
  ('00000000-0000-0000-0000-000000000001', 10681, 'WALL-E', '/c2SQMd00CCGTiDxGXVqA2J9lmzF.jpg', '/2nFaq32TQTmBz0BxyOfTmgAzTac.jpg', 8.4, 2008, 6),
  ('00000000-0000-0000-0000-000000000001', 10515, 'My Neighbor Totoro', '/rtGDOeG9LzoerkDGZF9dnVeLppL.jpg', '/etqr6fOOCXQOgwrQXaKwenTSuzx.jpg', 8.2, 1988, 7),
  ('00000000-0000-0000-0000-000000000001', 10386, 'The Iron Giant', '/d4hWHyguDjiL7nn8zzKGaAr6f3j.jpg', '/1Jm3wbRSVqJ7HgNNTpKFJfXsODN.jpg', 8.0, 1999, 8),
  ('00000000-0000-0000-0000-000000000001', 408, 'Snow White and the Seven Dwarfs', '/gzrVLHn7BsHV6EaCtTw5zXmQiZW.jpg', '/fVLHrJrDQRyMmkFVP3nHCNKWcRg.jpg', 7.6, 1937, 9),
  ('00000000-0000-0000-0000-000000000001', 10895, 'Pinocchio', '/wP3hxhJ9H7j3aMEtBrPr2gzCLCw.jpg', '/5qJTyVBNNdP1m3qHQdGqjWOOgDz.jpg', 7.5, 1940, 10)
ON CONFLICT (playlist_id, movie_id) DO NOTHING;

-- Horror Essentials movies  
INSERT INTO playlist_movies (playlist_id, movie_id, movie_title, movie_poster, movie_backdrop, movie_rating, movie_year, order_index) VALUES
  ('00000000-0000-0000-0000-000000000002', 9552, 'The Exorcist', '/4ucLGcXVVSVnsfkGtbBqNyuHKLq.jpg', '/4ucLGcXVVSVnsfkGtbBqNyuHKLq.jpg', 8.0, 1973, 1),
  ('00000000-0000-0000-0000-000000000002', 948, 'Halloween', '/wijlZ3HaYMvlDTPqJoTCWKFkCjN.jpg', '/wijlZ3HaYMvlDTPqJoTCWKFkCjN.jpg', 7.7, 1978, 2),
  ('00000000-0000-0000-0000-000000000002', 694, 'The Shining', '/b6ko0IKC8MdYBBPkkA1aBPLe2yz.jpg', '/3wdWVBg2wcS0xSn6iP2csmSNcSc.jpg', 8.4, 1980, 3),
  ('00000000-0000-0000-0000-000000000002', 539, 'Psycho', '/81d8oyEFgj7FlxJqSDXWr8JH8kV.jpg', '/3md49VBeeaAia9hMZDvv4pjBqmH.jpg', 8.5, 1960, 4),
  ('00000000-0000-0000-0000-000000000002', 348, 'Alien', '/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg', '/AmR3JG1VQVxU8TfAvljUhfSFUOx.jpg', 8.4, 1979, 5),
  ('00000000-0000-0000-0000-000000000002', 593, 'The Silence of the Lambs', '/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg', '/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg', 8.6, 1991, 6),
  ('00000000-0000-0000-0000-000000000002', 4232, 'Scream', '/dA7LBVS7FI2DlnzJ0cN5zJtdVb4.jpg', '/dA7LBVS7FI2DlnzJ0cN5zJtdVb4.jpg', 7.4, 1996, 7),
  ('00000000-0000-0000-0000-000000000002', 424, 'Jaws', '/l5esapDdkslaNQOzTUJxP4OpMQm.jpg', '/l5esapDdkslaNQOzTUJxP4OpMQm.jpg', 8.1, 1975, 8),
  ('00000000-0000-0000-0000-000000000002', 758, 'The Birds', '/gzVpFQZfU5OlHApCFLtNEJJKDpZ.jpg', '/gzVpFQZfU5OlHApCFLtNEJJKDpZ.jpg', 7.7, 1963, 9),
  ('00000000-0000-0000-0000-000000000002', 346, 'Seven', '/6yoghtyTpznpBik8EngEmJskVUO.jpg', '/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', 8.6, 1995, 10)
ON CONFLICT (playlist_id, movie_id) DO NOTHING;

-- Romance Classics movies
INSERT INTO playlist_movies (playlist_id, movie_id, movie_title, movie_poster, movie_backdrop, movie_rating, movie_year, order_index) VALUES
  ('00000000-0000-0000-0000-000000000003', 289, 'Casablanca', '/5K7cOHoay2mZusSLezBOY0Qxh8a.jpg', '/5K7cOHoay2mZusSLezBOY0Qxh8a.jpg', 8.5, 1942, 1),
  ('00000000-0000-0000-0000-000000000003', 2493, 'The Princess Bride', '/dvjqlp2sAhUeFjUOfQDgNNBb4AR.jpg', '/dvjqlp2sAhUeFjUOfQDgNNBb4AR.jpg', 8.0, 1987, 2),
  ('00000000-0000-0000-0000-000000000003', 597, 'Titanic', '/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg', '/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg', 7.9, 1997, 3),
  ('00000000-0000-0000-0000-000000000003', 11036, 'The Notebook', '/qom1SZSENdmHFNZBXbtJAU0WTlC.jpg', '/qom1SZSENdmHFNZBXbtJAU0WTlC.jpg', 7.8, 2004, 4),
  ('00000000-0000-0000-0000-000000000003', 639, 'Pretty Woman', '/7YQvvLu49WIsJJvbdj9E5iq3FRg.jpg', '/7YQvvLu49WIsJJvbdj9E5iq3FRg.jpg', 7.1, 1990, 5),
  ('00000000-0000-0000-0000-000000000003', 194, 'Ghost', '/kHjLJJWNPOKvOK5uDKrBdZlJwZY.jpg', '/kHjLJJWNPOKvOK5uDKrBdZlJwZY.jpg', 7.1, 1990, 6),
  ('00000000-0000-0000-0000-000000000003', 1422, 'When Harry Met Sally', '/3wkbKeowUp1Zpkw1KkBqMWbt1gb.jpg', '/3wkbKeowUp1Zpkw1KkBqMWbt1gb.jpg', 7.6, 1989, 7),
  ('00000000-0000-0000-0000-000000000003', 1927, 'Roman Holiday', '/8lI9dmz6Rj0XuFfh7ULKETFDxGg.jpg', '/8lI9dmz6Rj0XuFfh7ULKETFDxGg.jpg', 8.0, 1953, 8),
  ('00000000-0000-0000-0000-000000000003', 114, 'Dirty Dancing', '/qNVjm5c6UGPZNUOqKsHYPNWVcqY.jpg', '/qNVjm5c6UGPZNUOqKsHYPNWVcqY.jpg', 7.0, 1987, 9),
  ('00000000-0000-0000-0000-000000000003', 274, 'Gone with the Wind', '/lNz2Ow0oBdFsYdjdUmeu7oHPKPk.jpg', '/lNz2Ow0oBdFsYdjdUmeu7oHPKPk.jpg', 8.2, 1939, 10)
ON CONFLICT (playlist_id, movie_id) DO NOTHING;

-- Comedy Classics movies
INSERT INTO playlist_movies (playlist_id, movie_id, movie_title, movie_poster, movie_backdrop, movie_rating, movie_year, order_index) VALUES
  ('00000000-0000-0000-0000-000000000004', 62, 'Some Like It Hot', '/hV3gNKE7W6NMmhVZgNGOS2UBQXA.jpg', '/hV3gNKE7W6NMmhVZgNGOS2UBQXA.jpg', 8.3, 1959, 1),
  ('00000000-0000-0000-0000-000000000004', 816, 'Airplane!', '/6QWgvlDlRgXQnGlhVWyKVeRuaLl.jpg', '/6QWgvlDlRgXQnGlhVWyKVeRuaLl.jpg', 7.7, 1980, 2),
  ('00000000-0000-0000-0000-000000000004', 115, 'The Big Lebowski', '/d4ftZKzTpBOVKqzlbdJw8kuGfSU.jpg', '/d4ftZKzTpBOVKqzlbdJw8kuGfSU.jpg', 8.1, 1998, 3),
  ('00000000-0000-0000-0000-000000000004', 137, 'Groundhog Day', '/gb3TVVZNNxVGNtR2Z3ASQD1rqJm.jpg', '/gb3TVVZNNxVGNtR2Z3ASQD1rqJm.jpg', 8.0, 1993, 4),
  ('00000000-0000-0000-0000-000000000004', 1422, 'Young Frankenstein', '/8pBDNOzYFJTgRvRuJKdGCNKkGGn.jpg', '/8pBDNOzYFJTgRvRuJKdGCNKkGGn.jpg', 8.0, 1974, 5),
  ('00000000-0000-0000-0000-000000000004', 1422, 'Blazing Saddles', '/2RifKBXIhZWGAGUyYlLIaJJtEKN.jpg', '/2RifKBXIhZWGAGUyYlLIaJJtEKN.jpg', 7.7, 1974, 6),
  ('00000000-0000-0000-0000-000000000004', 1422, 'Dr. Strangelove', '/7SixLzxcqOcWihNQ9F8MYL7TBDL.jpg', '/7SixLzxcqOcWihNQ9F8MYL7TBDL.jpg', 8.4, 1964, 7),
  ('00000000-0000-0000-0000-000000000004', 1422, 'Annie Hall', '/cBZfGJnLyJzNTlLw2lSzFpjUTVg.jpg', '/cBZfGJnLyJzNTlLw2lSzFpjUTVg.jpg', 8.0, 1977, 8),
  ('00000000-0000-0000-0000-000000000004', 1422, 'Ghostbusters', '/3FS2V0s9I8QJFLNKg7fDJkUo4Zt.jpg', '/3FS2V0s9I8QJFLNKg7fDJkUo4Zt.jpg', 7.8, 1984, 9),
  ('00000000-0000-0000-0000-000000000004', 1422, 'Monty Python and the Holy Grail', '/8AVb7tyxZRsbKJqzn6jRC4ys0LT.jpg', '/8AVb7tyxZRsbKJqzn6jRC4ys0LT.jpg', 8.2, 1975, 10)
ON CONFLICT (playlist_id, movie_id) DO NOTHING;

-- Adventure Epics movies
INSERT INTO playlist_movies (playlist_id, movie_id, movie_title, movie_poster, movie_backdrop, movie_rating, movie_year, order_index) VALUES
  ('00000000-0000-0000-0000-000000000005', 85, 'Raiders of the Lost Ark', '/ceG9VzoRAVGwivFU403Wc3AHRys.jpg', '/ceG9VzoRAVGwivFU403Wc3AHRys.jpg', 8.5, 1981, 1),
  ('00000000-0000-0000-0000-000000000005', 120, 'The Lord of the Rings: The Fellowship of the Ring', '/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg', '/56zTpe2xvaA4alU51sRWPoKPYZy.jpg', 8.8, 2001, 2),
  ('00000000-0000-0000-0000-000000000005', 121, 'The Lord of the Rings: The Two Towers', '/5VTN0E9xjuvfrbDfEEDe0rAHDID.jpg', '/kiX7UYfOpYrMFSAGbI6j1pFkLzQ.jpg', 8.7, 2002, 3),
  ('00000000-0000-0000-0000-000000000005', 122, 'The Lord of the Rings: The Return of the King', '/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg', '/2u7zbn8EudG6kLlBzUYqP8RyFU4.jpg', 8.9, 2003, 4),
  ('00000000-0000-0000-0000-000000000005', 2268, 'Lawrence of Arabia', '/ktOKTzKKTxjvxKBKJTjXMXhpgFg.jpg', '/ktOKTzKKTxjvxKBKJTjXMXhpgFg.jpg', 8.3, 1962, 5),
  ('00000000-0000-0000-0000-000000000005', 1422, 'The Adventures of Robin Hood', '/aTJBanW8fVjUJJHUNFbmLBKOeUm.jpg', '/aTJBanW8fVjUJJHUNFbmLBKOeUm.jpg', 7.9, 1938, 6),
  ('00000000-0000-0000-0000-000000000005', 1422, 'North by Northwest', '/yVnh5hPdJRs2dUfTaKHJb0d9Aal.jpg', '/yVnh5hPdJRs2dUfTaKHJb0d9Aal.jpg', 8.3, 1959, 7),
  ('00000000-0000-0000-0000-000000000005', 1422, 'The Bridge on the River Kwai', '/8VXuJhGlJhXt0HHdNBe2ELULGx1.jpg', '/8VXuJhGlJhXt0HHdNBe2ELULGx1.jpg', 8.1, 1957, 8),
  ('00000000-0000-0000-0000-000000000005', 1422, 'The Treasure of the Sierra Madre', '/rWNq7oZYFCZvMxHYjrqSJVqFODR.jpg', '/rWNq7oZYFCZvMxHYjrqSJVqFODR.jpg', 8.2, 1948, 9),
  ('00000000-0000-0000-0000-000000000005', 1422, 'The African Queen', '/6hOCzBJoQFWBcRKSgPGnVHWvIxA.jpg', '/6hOCzBJoQFWBcRKSgPGnVHWvIxA.jpg', 7.7, 1951, 10)
ON CONFLICT (playlist_id, movie_id) DO NOTHING; 