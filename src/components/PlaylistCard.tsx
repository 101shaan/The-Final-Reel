import React from 'react';
import { motion } from 'framer-motion';
import { Play, Users, Lock } from 'lucide-react';
import { Playlist } from '../hooks/usePlaylists';
import { useNavigate } from 'react-router-dom';

interface PlaylistCardProps {
  playlist: Playlist;
  index?: number;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, index = 0 }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/playlist/${playlist.id}`);
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
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 shadow-lg group-hover:shadow-2xl transition-all duration-300">
        {playlist.cover_image ? (
          <img
            src={playlist.cover_image}
            alt={playlist.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play className="w-16 h-16 text-white/60" />
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Featured badge */}
        {playlist.is_featured && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
            <span className="text-white text-xs font-medium">Featured</span>
          </div>
        )}

        {/* Privacy indicator */}
        <div className="absolute top-3 right-3">
          {playlist.is_public ? (
            <Users className="w-4 h-4 text-white/80" />
          ) : (
            <Lock className="w-4 h-4 text-white/80" />
          )}
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-lg mb-1 line-clamp-2">
            {playlist.title}
          </h3>
          
          {playlist.description && (
            <p className="text-gray-300 text-sm mb-2 line-clamp-2">
              {playlist.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">
              {playlist.movie_count || 0} movies
            </span>
            
            {playlist.is_featured && (
              <span className="text-purple-400 text-xs font-medium">
                Curated
              </span>
            )}
          </div>
        </div>

        {/* Hover play button */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
          initial={{ scale: 0.8 }}
          whileHover={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};