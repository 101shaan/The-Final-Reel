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
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 premium-card">
        {movie.poster_path ? (
          <img
            src={getImageUrl(movie.poster_path, 'w500')}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ color: '#666666' }}>
            <Play className="w-12 h-12" />
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Hover actions */}
        <motion.div
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100"
          initial={{ scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <button
            onClick={handleWatchlistToggle}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
              inWatchlist
                ? 'text-white'
                : 'hover:text-red-400'
            }`}
            style={{
              backgroundColor: inWatchlist ? '#D4AF37' : 'rgba(0, 0, 0, 0.4)',
              color: inWatchlist ? '#0E0E0E' : '#AFAFAF'
            }}
          >
            <Heart className={`w-4 h-4 ${inWatchlist ? 'fill-current' : ''}`} />
          </button>
        </motion.div>

        {/* Rating */}
        {movie.vote_average > 0 && (
          <div className="absolute top-3 left-3 rating-badge">
            <Star className="w-3 h-3 fill-current inline mr-1" style={{ color: '#0E0E0E' }} />
            <span className="text-xs font-medium">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        )}

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="font-light text-sm mb-1 line-clamp-2" style={{ color: '#F0EDE3' }}>
            {movie.title}
          </h3>
          {movie.release_date && (
            <p className="text-xs" style={{ color: '#AFAFAF' }}>
              {new Date(movie.release_date).getFullYear()}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};