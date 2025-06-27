import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import { useWatchlist } from '../hooks/useWatchlist';
import { useAuth } from '../hooks/useAuth';
import { getImageUrl } from '../lib/tmdb';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

export const WatchlistPage: React.FC = () => {
  const { user } = useAuth();
  const { watchlist, loading, removeFromWatchlist } = useWatchlist();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Sign In Required</h1>
        <p className="text-gray-400 mb-8">
          You need to sign in to view your watchlist
        </p>
        <Button onClick={() => navigate('/auth')}>Sign In</Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-6 py-8"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-2">
          <Heart className="w-8 h-8 text-red-500 fill-current" />
          <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
        </div>
        <p className="text-gray-400">
          {watchlist.length} movie{watchlist.length !== 1 ? 's' : ''} saved
        </p>
      </motion.div>

      {watchlist.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">
            Your watchlist is empty
          </h2>
          <p className="text-gray-400 mb-8">
            Start adding movies you want to watch later
          </p>
          <Button onClick={() => navigate('/')}>Discover Movies</Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {watchlist.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors group"
            >
              <div
                onClick={() => navigate(`/movie/${item.movie_id}`)}
                className="cursor-pointer"
              >
                <div className="aspect-[2/3] relative overflow-hidden">
                  {item.movie_poster ? (
                    <img
                      src={getImageUrl(item.movie_poster, 'w500')}
                      alt={item.movie_title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <Heart className="w-12 h-12 text-gray-500" />
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                    {item.movie_title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Added {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="px-4 pb-4">
                <Button
                  onClick={() => removeFromWatchlist(item.movie_id)}
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  className="w-full"
                >
                  Remove
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};