import React, { useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Movie } from '../lib/tmdb';
import { MovieCard } from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  className?: string;
}

export const MovieRow: React.FC<MovieRowProps> = ({ title, movies, className = '' }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByAmount = (amount: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className={`${className} relative`}>
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative"
      >
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto no-scrollbar snap-x snap-mandatory px-1 pr-16"
        >
          {movies.map((movie, index) => (
            <div key={movie.id} className="snap-start shrink-0 w-40 sm:w-44 md:w-48 lg:w-52">
              <MovieCard movie={movie} index={index} />
            </div>
          ))}
        </div>

        {/* Right glassmorphism scroll button */}
        <button
          onClick={() => scrollByAmount(700)}
          className="hidden md:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition-all"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </motion.div>
    </div>
  );
};


