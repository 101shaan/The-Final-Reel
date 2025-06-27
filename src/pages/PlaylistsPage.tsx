import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Play } from 'lucide-react';
import { usePlaylists } from '../hooks/usePlaylists';
import { useAuth } from '../hooks/useAuth';
import { PlaylistGrid } from '../components/PlaylistGrid';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const PlaylistsPage: React.FC = () => {
  const { user } = useAuth();
  const { playlists, featuredPlaylists, loading } = usePlaylists();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Sign In Required</h1>
        <p className="text-gray-400 mb-8">
          You need to sign in to view and create playlists
        </p>
        <Button onClick={() => navigate('/auth')}>Sign In</Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-6 py-8 space-y-12"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Your Playlists</h1>
          <p className="text-gray-400">
            Create and manage your movie collections
          </p>
        </div>
        
        <Button
          onClick={() => navigate('/playlist/create')}
          icon={Plus}
          size="lg"
        >
          Create Playlist
        </Button>
      </motion.div>

      {/* Featured Playlists */}
      {featuredPlaylists.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PlaylistGrid
            playlists={featuredPlaylists}
            loading={loading}
            title="Featured Playlists"
          />
        </motion.section>
      )}

      {/* User Playlists */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {playlists.length === 0 && !loading ? (
          <div className="text-center py-20">
            <Play className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">
              No playlists yet
            </h2>
            <p className="text-gray-400 mb-8">
              Create your first playlist to organize your favorite movies
            </p>
            <Button
              onClick={() => navigate('/playlist/create')}
              icon={Plus}
            >
              Create Your First Playlist
            </Button>
          </div>
        ) : (
          <PlaylistGrid
            playlists={playlists}
            loading={loading}
            title="My Playlists"
          />
        )}
      </motion.section>
    </motion.div>
  );
};