/*
  # Insert Featured Playlists

  1. Featured Playlists
    - Creates system-level featured playlists
    - Includes popular movie collections
    - Sets up initial content for the app

  2. Movies Data
    - Adds popular movies to featured playlists
    - Includes movie metadata for offline access
*/

-- Insert featured playlists (system playlists)
INSERT INTO playlists (id, user_id, title, description, cover_image, is_public, is_featured, created_at) VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    NULL,
    'Marvel Cinematic Universe',
    'The complete MCU journey from Iron Man to the latest releases',
    'https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg',
    true,
    true,
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    NULL,
    'Christopher Nolan Collection',
    'Mind-bending masterpieces from the visionary director',
    'https://image.tmdb.org/t/p/w500/f7DImXDebOs148U4uPjI61iDvaK.jpg',
    true,
    true,
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    NULL,
    'Oscar Winners 2020s',
    'Academy Award winning films from the current decade',
    'https://image.tmdb.org/t/p/w500/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg',
    true,
    true,
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    NULL,
    'Sci-Fi Classics',
    'Timeless science fiction films that shaped the genre',
    'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    true,
    true,
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000005',
    NULL,
    'Horror Essentials',
    'Must-watch horror films for every fan of the genre',
    'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    true,
    true,
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- Marvel Cinematic Universe movies
INSERT INTO playlist_movies (playlist_id, movie_id, movie_title, movie_poster, movie_backdrop, movie_rating, movie_year, order_index) VALUES
  ('00000000-0000-0000-0000-000000000001', 1726, 'Iron Man', '/78lPtwv72eTNqFW9COBYI0dWDJa.jpg', '/9BBTo63ANSmhC4e6r62OJFuK2GL.jpg', 7.6, 2008, 1),
  ('00000000-0000-0000-0000-000000000001', 299536, 'Avengers: Infinity War', '/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg', '/lmZFxXgJE3vgrciwuDib0N8CfQo.jpg', 8.3, 2018, 2),
  ('00000000-0000-0000-0000-000000000001', 299534, 'Avengers: Endgame', '/or06FN3Dka5tukK1e9sl16pB3iy.jpg', '/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg', 8.3, 2019, 3),
  ('00000000-0000-0000-0000-000000000001', 9376, 'Thor', '/bIuOWTtyFPjsFDevqvF3QrD1aun.jpg', '/cDJ61O1STtbWNBwefuqVrRe3d7l.jpg', 7.0, 2011, 4),
  ('00000000-0000-0000-0000-000000000001', 1771, 'Captain America: The First Avenger', '/vSNxAJTlD0r02V9sPYpOjqDZXUK.jpg', '/6bbZ6XyvgfjhQwbplnUh1LSj1ky.jpg', 6.9, 2011, 5)
ON CONFLICT (playlist_id, movie_id) DO NOTHING;

-- Christopher Nolan Collection
INSERT INTO playlist_movies (playlist_id, movie_id, movie_title, movie_poster, movie_backdrop, movie_rating, movie_year, order_index) VALUES
  ('00000000-0000-0000-0000-000000000002', 27205, 'Inception', '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg', 8.8, 2010, 1),
  ('00000000-0000-0000-0000-000000000002', 155, 'The Dark Knight', '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', '/hqkIcbrOHL86UncnHIsHVcVmzue.jpg', 9.0, 2008, 2),
  ('00000000-0000-0000-0000-000000000002', 157336, 'Interstellar', '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', '/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg', 8.6, 2014, 3),
  ('00000000-0000-0000-0000-000000000002', 414906, 'The Batman', '/74xTEgt7R36Fpooo50r9T25onhq.jpg', '/f7DImXDebOs148U4uPjI61iDvaK.jpg', 7.8, 2022, 4),
  ('00000000-0000-0000-0000-000000000002', 120, 'The Lord of the Rings: The Fellowship of the Ring', '/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg', '/56zTpe2xvaA4alU51sRWPoKPYZy.jpg', 8.8, 2001, 5)
ON CONFLICT (playlist_id, movie_id) DO NOTHING;

-- Oscar Winners 2020s
INSERT INTO playlist_movies (playlist_id, movie_id, movie_title, movie_poster, movie_backdrop, movie_rating, movie_year, order_index) VALUES
  ('00000000-0000-0000-0000-000000000003', 508442, 'Soul', '/hm58Jw4Lw8OIeECIq5qyPYhAeRJ.jpg', '/kf456ZqeC45XTvo6W9pW5clyCy2.jpg', 8.1, 2020, 1),
  ('00000000-0000-0000-0000-000000000003', 581389, 'Nomadland', '/6cKERYysOrlaTYuJ5sEQpKNtixu.jpg', '/2Tj2Kh8lWGpAYHa3ZOP7wLOuNUi.jpg', 7.3, 2020, 2),
  ('00000000-0000-0000-0000-000000000003', 840326, 'CODA', '/BzVjmm8l23rPsijLiNLUzuQtyd.jpg', '/2MSGZEE6XZd2r4ODNziwAw7Hpw0.jpg', 8.1, 2021, 3),
  ('00000000-0000-0000-0000-000000000003', 634649, 'Spider-Man: No Way Home', '/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', '/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg', 8.4, 2021, 4)
ON CONFLICT (playlist_id, movie_id) DO NOTHING;

-- Sci-Fi Classics
INSERT INTO playlist_movies (playlist_id, movie_id, movie_title, movie_poster, movie_backdrop, movie_rating, movie_year, order_index) VALUES
  ('00000000-0000-0000-0000-000000000004', 78, 'Blade Runner', '/63N9uy8nd9j7Eog2axPQ8lbr3Wj.jpg', '/eIi3klFf7mp3oL5EEF4mLIDs26r.jpg', 8.1, 1982, 1),
  ('00000000-0000-0000-0000-000000000004', 603, 'The Matrix', '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', '/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg', 8.7, 1999, 2),
  ('00000000-0000-0000-0000-000000000004', 11, 'Star Wars', '/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg', '/4iJfYYoQzZcONB9hNzg0J0wWyPH.jpg', 8.6, 1977, 3),
  ('00000000-0000-0000-0000-000000000004', 62, 'E.T. the Extra-Terrestrial', '/5Jgp5VeNNGZuNW4ZNNvhbKnNfXP.jpg', '/8BPZO0Bf8TeAy8znF43z8soK3ys.jpg', 7.9, 1982, 4),
  ('00000000-0000-0000-0000-000000000004', 424, 'Schindler''s List', '/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg', '/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg', 9.0, 1993, 5)
ON CONFLICT (playlist_id, movie_id) DO NOTHING;

-- Horror Essentials
INSERT INTO playlist_movies (playlist_id, movie_id, movie_title, movie_poster, movie_backdrop, movie_rating, movie_year, order_index) VALUES
  ('00000000-0000-0000-0000-000000000005', 694, 'The Shining', '/b6ko0IKC8MdYBBPkkA1aBPLe2yz.jpg', '/3wdWVBg2wcS0xSn6iP2csmSNcSc.jpg', 8.4, 1980, 1),
  ('00000000-0000-0000-0000-000000000005', 539, 'Psycho', '/81d8oyEFgj7FlxJqSDXWr8JH8kV.jpg', '/3md49VBeeaAia9hMZDvv4pjBqmH.jpg', 8.5, 1960, 2),
  ('00000000-0000-0000-0000-000000000005', 346, 'Seven', '/6yoghtyTpznpBik8EngEmJskVUO.jpg', '/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', 8.6, 1995, 3),
  ('00000000-0000-0000-0000-000000000005', 1422, 'The Departed', '/nT97ifVT2J1yMQmeq20Qblg61T.jpg', '/tGLO9zw5ZtCeyyEWgbYGgsFxC6i.jpg', 8.5, 2006, 4),
  ('00000000-0000-0000-0000-000000000005', 807, 'Se7en', '/6yoghtyTpznpBik8EngEmJskVUO.jpg', '/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', 8.6, 1995, 5)
ON CONFLICT (playlist_id, movie_id) DO NOTHING;