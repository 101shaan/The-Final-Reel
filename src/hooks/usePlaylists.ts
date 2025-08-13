import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { Movie } from '../lib/tmdb';

export interface Playlist {
  id: string;
  user_id: string | null;
  title: string;
  description: string;
  cover_image: string;
  is_public: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  movie_count?: number;
}

export interface PlaylistMovie {
  id: string;
  playlist_id: string;
  movie_id: number;
  movie_title: string;
  movie_poster: string;
  movie_backdrop: string;
  movie_rating: number;
  movie_year: number;
  order_index: number;
  created_at: string;
}

const ADMIN_EMAIL = 'shaansisodia3@gmail.com';

export const usePlaylists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Check if current user is admin
  const isAdmin = user?.email === ADMIN_EMAIL;

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      // Only fetch user's playlists if they're the admin
      if (user && isAdmin) {
        const { data: userPlaylists, error: userError } = await supabase
          .from('playlists')
          .select(`
            *,
            playlist_movies(count)
          `)
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (userError) throw userError;
        
        const playlistsWithCount = userPlaylists?.map(playlist => ({
          ...playlist,
          movie_count: playlist.playlist_movies?.[0]?.count || 0
        })) || [];
        
        setPlaylists(playlistsWithCount);
      } else {
        // Non-admin users have no personal playlists
        setPlaylists([]);
      }

      // Fetch featured playlists (everyone can see these)
      const { data: featured, error: featuredError } = await supabase
        .from('playlists')
        .select(`
          *,
          playlist_movies(count)
        `)
        .eq('is_featured', true)
        .order('created_at', { ascending: true });

      if (featuredError) throw featuredError;
      
      const featuredWithCount = featured?.map(playlist => ({
        ...playlist,
        movie_count: playlist.playlist_movies?.[0]?.count || 0
      })) || [];
      
      setFeaturedPlaylists(featuredWithCount);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [user]);

  const createPlaylist = async (title: string, description: string = '', coverImage: string = '', isFeatured: boolean = false) => {
    if (!user || !isAdmin) {
      return { error: 'Only admin can create playlists' };
    }

    try {
      const { data, error } = await supabase
        .from('playlists')
        .insert({
          user_id: user.id,
          title,
          description,
          cover_image: coverImage,
          is_public: isFeatured, // Featured playlists are public
          is_featured: isFeatured,
        })
        .select()
        .single();

      if (error) throw error;

      const newPlaylist = { ...data, movie_count: 0 };
      
      if (isFeatured) {
        setFeaturedPlaylists(prev => [...prev, newPlaylist]);
      } else {
        setPlaylists(prev => [newPlaylist, ...prev]);
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error creating playlist:', error);
      return { error };
    }
  };

  const updatePlaylist = async (playlistId: string, updates: Partial<Playlist>) => {
    if (!user || !isAdmin) {
      return { error: 'Only admin can update playlists' };
    }

    try {
      const { data, error } = await supabase
        .from('playlists')
        .update(updates)
        .eq('id', playlistId)
        .select()
        .single();

      if (error) throw error;

      // Update in the appropriate state array
      const playlist = [...playlists, ...featuredPlaylists].find(p => p.id === playlistId);
      if (playlist?.is_featured || updates.is_featured) {
        setFeaturedPlaylists(prev => prev.map(p => p.id === playlistId ? { ...p, ...data } : p));
      } else {
        setPlaylists(prev => prev.map(p => p.id === playlistId ? { ...p, ...data } : p));
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error updating playlist:', error);
      return { error };
    }
  };

  const deletePlaylist = async (playlistId: string) => {
    if (!user || !isAdmin) {
      return { error: 'Only admin can delete playlists' };
    }

    try {
      const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', playlistId);

      if (error) throw error;

      // Remove from both state arrays
      setPlaylists(prev => prev.filter(p => p.id !== playlistId));
      setFeaturedPlaylists(prev => prev.filter(p => p.id !== playlistId));
      
      return { error: null };
    } catch (error) {
      console.error('Error deleting playlist:', error);
      return { error };
    }
  };

  const addMovieToPlaylist = async (playlistId: string, movie: Movie) => {
    if (!user || !isAdmin) {
      return { error: 'Only admin can add movies to playlists' };
    }

    try {
      // Get the current max order index
      const { data: maxOrder } = await supabase
        .from('playlist_movies')
        .select('order_index')
        .eq('playlist_id', playlistId)
        .order('order_index', { ascending: false })
        .limit(1);

      const nextOrderIndex = (maxOrder?.[0]?.order_index || 0) + 1;

      const { data, error } = await supabase
        .from('playlist_movies')
        .insert({
          playlist_id: playlistId,
          movie_id: movie.id,
          movie_title: movie.title,
          movie_poster: movie.poster_path || '',
          movie_backdrop: movie.backdrop_path || '',
          movie_rating: typeof movie.vote_average === 'number' ? movie.vote_average : 0,
          movie_year: movie.release_date && movie.release_date.length >= 4 ? new Date(movie.release_date).getFullYear() : 0,
          order_index: nextOrderIndex,
        })
        .select()
        .single();

      if (error) throw error;

      // Update playlist movie count in both state arrays
      setPlaylists(prev => prev.map(p => 
        p.id === playlistId 
          ? { ...p, movie_count: (p.movie_count || 0) + 1 }
          : p
      ));
      setFeaturedPlaylists(prev => prev.map(p => 
        p.id === playlistId 
          ? { ...p, movie_count: (p.movie_count || 0) + 1 }
          : p
      ));

      return { data, error: null };
    } catch (error) {
      console.error('Error adding movie to playlist:', error);
      return { error };
    }
  };

  const removeMovieFromPlaylist = async (playlistId: string, movieId: number) => {
    if (!user || !isAdmin) {
      return { error: 'Only admin can remove movies from playlists' };
    }

    try {
      const { error } = await supabase
        .from('playlist_movies')
        .delete()
        .eq('playlist_id', playlistId)
        .eq('movie_id', movieId);

      if (error) throw error;

      // Update playlist movie count in both state arrays
      setPlaylists(prev => prev.map(p => 
        p.id === playlistId 
          ? { ...p, movie_count: Math.max((p.movie_count || 1) - 1, 0) }
          : p
      ));
      setFeaturedPlaylists(prev => prev.map(p => 
        p.id === playlistId 
          ? { ...p, movie_count: Math.max((p.movie_count || 1) - 1, 0) }
          : p
      ));

      return { error: null };
    } catch (error) {
      console.error('Error removing movie from playlist:', error);
      return { error };
    }
  };

  const getPlaylistMovies = async (playlistId: string): Promise<PlaylistMovie[]> => {
    try {
      const { data, error } = await supabase
        .from('playlist_movies')
        .select('*')
        .eq('playlist_id', playlistId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching playlist movies:', error);
      return [];
    }
  };

  const reorderPlaylistMovies = async (playlistId: string, movieIds: string[]) => {
    if (!user || !isAdmin) {
      return { error: 'Only admin can reorder playlist movies' };
    }

    try {
      const updates = movieIds.map((movieId, index) => ({
        id: movieId,
        order_index: index + 1,
      }));

      for (const update of updates) {
        await supabase
          .from('playlist_movies')
          .update({ order_index: update.order_index })
          .eq('id', update.id);
      }

      return { error: null };
    } catch (error) {
      console.error('Error reordering playlist movies:', error);
      return { error };
    }
  };

  return {
    playlists,
    featuredPlaylists,
    loading,
    isAdmin,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addMovieToPlaylist,
    removeMovieFromPlaylist,
    getPlaylistMovies,
    reorderPlaylistMovies,
    refetch: fetchPlaylists,
  };
};