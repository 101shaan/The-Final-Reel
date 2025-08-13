/*
  # Admin Policies for Featured Playlists

  - Allow the admin (by email) to manage featured playlists and their movies
  - Keeps existing owner-based policies intact
*/

-- Adjust visibility note: existing policies already allow SELECT for authenticated users.

-- Playlists: Admin can manage featured playlists regardless of user_id
DROP POLICY IF EXISTS "Admin can manage featured playlists" ON playlists;
CREATE POLICY "Admin can manage featured playlists"
  ON playlists FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'email') = 'shaansisodia3@gmail.com' AND is_featured = true
  )
  WITH CHECK (
    (auth.jwt() ->> 'email') = 'shaansisodia3@gmail.com' AND is_featured = true
  );

-- Playlist Movies: Admin can manage movies for featured playlists
DROP POLICY IF EXISTS "Admin can manage movies in featured playlists" ON playlist_movies;
CREATE POLICY "Admin can manage movies in featured playlists"
  ON playlist_movies FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'email') = 'shaansisodia3@gmail.com' AND EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = playlist_movies.playlist_id 
      AND playlists.is_featured = true
    )
  )
  WITH CHECK (
    (auth.jwt() ->> 'email') = 'shaansisodia3@gmail.com' AND EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = playlist_movies.playlist_id 
      AND playlists.is_featured = true
    )
  );


