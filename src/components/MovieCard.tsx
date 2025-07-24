import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Play, Star } from 'lucide-react';
import { Movie, getImageUrl } from '../lib/tmdb';
import { useWatchlist } from '../hooks/useWatchlist';
import { useNavigate } from 'react-router-dom';

interface MovieCardProps {
  movie: Movie;
  index?: number;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, index = 0 }) => {
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.id);

  const handleWatchlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWatchlist) {
      await removeFromWatchlist(movie.id);
    } else {
      await addToWatchlist(movie);
    }
  };

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative group cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 shadow-lg group-hover:shadow-2xl transition-all duration-300">
        {movie.poster_path ? (
          <img
            src={getImageUrl(movie.poster_path, 'w500')}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <Play className="w-12 h-12" />
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Hover actions */}
        <motion.div
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100"
          initial={{ scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <button
            onClick={handleWatchlistToggle}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              inWatchlist
                ? 'bg-red-500/80 text-white'
                : 'bg-black/40 text-gray-300 hover:text-red-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${inWatchlist ? 'fill-current' : ''}`} />
          </button>
        </motion.div>

        {/* Rating */}
        {movie.vote_average > 0 && (
          <div className="absolute top-3 left-3 flex items-center space-x-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs font-medium">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        )}

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
            {movie.title}
          </h3>
          {movie.release_date && (
            <p className="text-gray-300 text-xs">
              {new Date(movie.release_date).getFullYear()}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};