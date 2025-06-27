import React from 'react';
import { motion } from 'framer-motion';
import { Playlist } from '../hooks/usePlaylists';
import { PlaylistCard } from './PlaylistCard';
import { LoadingCard } from './ui/LoadingSpinner';

interface PlaylistGridProps {
  playlists: Playlist[];
  loading?: boolean;
  title?: string;
  className?: string;
}

export const PlaylistGrid: React.FC<PlaylistGridProps> = ({
  playlists,
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-400 text-lg">No playlists found</p>
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
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        {playlists.map((playlist, index) => (
          <PlaylistCard key={playlist.id} playlist={playlist} index={index} />
        ))}
      </motion.div>
    </div>
  );
};