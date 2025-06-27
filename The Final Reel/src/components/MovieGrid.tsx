import React from 'react';
import { motion } from 'framer-motion';
import { Movie } from '../lib/tmdb';
import { MovieCard } from './MovieCard';
import { LoadingCard } from './ui/LoadingSpinner';

interface MovieGridProps {
  movies: Movie[];
  loading?: boolean;
  title?: string;
  className?: string;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  loading = false,
  title,
  className = '',
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (loading) {
    return (
      <div className={className}>
        {title && (
          <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-400 text-lg">No movies found</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {title && (
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-white mb-6"
        >
          {title}
        </motion.h2>
      )}
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
      >
        {movies.map((movie, index) => (
          <MovieCard key={movie.id} movie={movie} index={index} />
        ))}
      </motion.div>
    </div>
  );
};