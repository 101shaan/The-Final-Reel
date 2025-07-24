import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie, getBackdropUrl } from '../lib/tmdb';
import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';

interface HeroCarouselProps {
  movies: Movie[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const currentMovie = movies[currentIndex];

  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [movies.length]);

  if (!currentMovie) return null;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const handleWatchNow = () => {
    navigate(`/movie/${currentMovie.id}`);
  };

  return (
    <div className="relative h-[70vh] overflow-hidden rounded-2xl shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {currentMovie.backdrop_path && (
            <img
              src={getBackdropUrl(currentMovie.backdrop_path, 'w1280')}
              alt={currentMovie.title}
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-8">
          <div className="max-w-3xl">
            <motion.h1
              key={`title-${currentIndex}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-hero mb-6"
              style={{ color: '#F0EDE3' }}
            >
              {currentMovie.title}
            </motion.h1>
            
            <motion.p
              key={`overview-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-body mb-8 line-clamp-3 max-w-2xl"
              style={{ color: 'rgba(240, 237, 227, 0.9)' }}
            >
              {currentMovie.overview}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex space-x-6"
            >
              <Button
                onClick={handleWatchNow}
                icon={Play}
                size="lg"
                variant="primary"
              >
                Watch Now
              </Button>
              
              <Button
                onClick={handleWatchNow}
                icon={Info}
                variant="secondary"
                size="lg"
              >
                More Info
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation - only keep the right button */}
      <button
        onClick={handleNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        style={{ 
          background: 'rgba(0, 0, 0, 0.5)', 
          color: '#F0EDE3',
          border: '1px solid rgba(212, 175, 55, 0.2)'
        }}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-8'
                : 'w-2 hover:opacity-75'
            }`}
            style={{
              backgroundColor: index === currentIndex ? '#D4AF37' : 'rgba(240, 237, 227, 0.5)'
            }}
          />
        ))}
      </div>
    </div>
  );
};