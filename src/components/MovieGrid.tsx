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
          <h2 className="text-title mb-8" style={{ color: '#F0EDE3' }}>{title}</h2>
        )}
        <div className="movie-grid">
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
        <p className="text-lg" style={{ color: '#AFAFAF' }}>No movies found</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {title && (
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-title mb-8"
          style={{ color: '#F0EDE3' }}
        >
          {title}
        </motion.h2>
      )}
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="movie-grid"
      >
        {movies.map((movie, index) => (
          <MovieCard key={movie.id} movie={movie} index={index} />
        ))}
      </motion.div>
    </div>
  );
};