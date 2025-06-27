import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { movieService } from '../lib/tmdb';
import { usePlaylists } from '../hooks/usePlaylists';
import { HeroCarousel } from '../components/HeroCarousel';
import { MovieGrid } from '../components/MovieGrid';
import { PlaylistGrid } from '../components/PlaylistGrid';

export const HomePage: React.FC = () => {
  const { featuredPlaylists, loading: playlistsLoading } = usePlaylists();

  const { data: trendingData, isLoading: trendingLoading, error: trendingError } = useQuery({
    queryKey: ['trending'],
    queryFn: () => movieService.getTrending('week'),
    retry: 3,
    retryDelay: 1000,
  });

  const { data: popularData, isLoading: popularLoading, error: popularError } = useQuery({
    queryKey: ['popular'],
    queryFn: () => movieService.getPopular(),
    retry: 3,
    retryDelay: 1000,
  });

  // Debug logging
  React.useEffect(() => {
    console.log('HomePage - Trending Data:', trendingData);
    console.log('HomePage - Popular Data:', popularData);
    console.log('HomePage - Trending Error:', trendingError);
    console.log('HomePage - Popular Error:', popularError);
  }, [trendingData, popularData, trendingError, popularError]);

  const trendingMovies = trendingData?.results || [];
  const popularMovies = popularData?.results || [];
  const heroMovies = trendingMovies.slice(0, 5);

  // Show error state if API calls fail
  if (trendingError || popularError) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Unable to load movies</h2>
          <p className="text-gray-400 mb-4">
            There seems to be an issue with the movie database connection.
          </p>
          <div className="text-sm text-gray-500">
            <p>Trending Error: {trendingError?.message}</p>
            <p>Popular Error: {popularError?.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      {/* Hero Section */}
      {!trendingLoading && heroMovies.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="container mx-auto px-6"
        >
          <HeroCarousel movies={heroMovies} />
        </motion.section>
      )}

      {/* Featured Playlists */}
      {featuredPlaylists.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <PlaylistGrid
            playlists={featuredPlaylists.slice(0, 5)}
            loading={playlistsLoading}
            title="Featured Playlists"
            className="container mx-auto px-6"
          />
        </motion.section>
      )}

      {/* Trending Movies */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <MovieGrid
          movies={trendingMovies}
          loading={trendingLoading}
          title="Trending This Week"
          className="container mx-auto px-6"
        />
      </motion.section>

      {/* Popular Movies */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <MovieGrid
          movies={popularMovies}
          loading={popularLoading}
          title="Popular Movies"
          className="container mx-auto px-6"
        />
      </motion.section>
    </motion.div>
  );
};