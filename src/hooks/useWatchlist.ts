import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { Movie } from '../lib/tmdb';

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchWatchlist = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWatchlist(data || []);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, [user]);

  const addToWatchlist = async (movie: Movie) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('watchlist')
        .insert({
          user_id: user.id,
          movie_id: movie.id,
          movie_title: movie.title,
          movie_poster: movie.poster_path,
        })
        .select()
        .single();

      if (error) throw error;

      setWatchlist(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      return { error };
    }
  };

  const removeFromWatchlist = async (movieId: number) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', movieId);

      if (error) throw error;

      setWatchlist(prev => prev.filter(item => item.movie_id !== movieId));
      return { error: null };
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      return { error };
    }
  };

  const isInWatchlist = (movieId: number) => {
    return watchlist.some(item => item.movie_id === movieId);
  };

  return {
    watchlist,
    loading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    refetch: fetchWatchlist,
  };
};