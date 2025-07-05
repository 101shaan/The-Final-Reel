import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Play, 
  Share2, 
  Edit3, 
  Trash2, 
  Plus,
  Users,
  Lock,
  Heart,
  ArrowUpDown
} from 'lucide-react';
import { usePlaylists, PlaylistMovie } from '../hooks/usePlaylists';
import { useAuth } from '../hooks/useAuth';
import { useWatchlist } from '../hooks/useWatchlist';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { getImageUrl } from '../lib/tmdb';

export const PlaylistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playlists, featuredPlaylists, getPlaylistMovies, deletePlaylist } = usePlaylists();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  
  const [movies, setMovies] = useState<PlaylistMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'order' | 'oldest' | 'newest' | 'rating' | 'popularity'>('order');

  const playlist = [...playlists, ...featuredPlaylists].find(p => p.id === id);
  const isOwner = user && playlist?.user_id === user.id;

  useEffect(() => {
    if (id) {
      loadPlaylistMovies();
    }
  }, [id]);

  const loadPlaylistMovies = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const playlistMovies = await getPlaylistMovies(id);
      setMovies(playlistMovies);
    } catch (error) {
      console.error('Error loading playlist movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!playlist || !isOwner) return;
    
    if (confirm('Are you sure you want to delete this playlist?')) {
      await deletePlaylist(playlist.id);
      navigate('/playlists');
    }
  };

  const handleWatchlistToggle = async (movie: PlaylistMovie) => {
    if (!user) return;
    
    const movieData = {
      id: movie.movie_id,
      title: movie.movie_title,
      poster_path: movie.movie_poster,
      backdrop_path: movie.movie_backdrop,
      vote_average: movie.movie_rating,
      release_date: movie.movie_year.toString(),
      overview: '',
      genre_ids: [],
      adult: false,
      original_language: '',
      original_title: movie.movie_title,
      popularity: 0,
      video: false,
      vote_count: 0,
    };

    if (isInWatchlist(movie.movie_id)) {
      await removeFromWatchlist(movie.movie_id);
    } else {
      await addToWatchlist(movieData);
    }
  };

  // Sort movies based on selected criteria
  const sortedMovies = [...movies].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return a.movie_year - b.movie_year;
      case 'newest':
        return b.movie_year - a.movie_year;
      case 'rating':
        return b.movie_rating - a.movie_rating;
      case 'popularity':
        // For now, use rating as popularity proxy
        return b.movie_rating - a.movie_rating;
      case 'order':
      default:
        return a.order_index - b.order_index;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Playlist not found</h1>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      {/* Header */}
      <div className="relative h-80 overflow-hidden">
        {playlist.cover_image && (
          <div className="absolute inset-0">
            <img
              src={playlist.cover_image}
              alt={playlist.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>
        )}

        {/* Back button */}
        <motion.button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-6 h-6" />
        </motion.button>

        {/* Actions */}
        {isOwner && (
          <div className="absolute top-6 right-6 z-10 flex space-x-2">
            <Button
              onClick={() => navigate(`/playlist/${playlist.id}/edit`)}
              variant="secondary"
              size="sm"
              icon={Edit3}
            >
              Edit
            </Button>
            <Button
              onClick={handleDeletePlaylist}
              variant="danger"
              size="sm"
              icon={Trash2}
            >
              Delete
            </Button>
          </div>
        )}

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto">
            <div className="flex items-end space-x-6">
              {/* Playlist Cover */}
              <div className="w-48 h-48 rounded-xl overflow-hidden shadow-2xl flex-shrink-0">
                {playlist.cover_image ? (
                  <img
                    src={playlist.cover_image}
                    alt={playlist.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
                    <Play className="w-16 h-16 text-white/60" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {playlist.is_featured && (
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm font-medium">
                      Featured
                    </span>
                  )}
                  <div className="flex items-center space-x-1 text-gray-300">
                    {playlist.is_public ? (
                      <Users className="w-4 h-4" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                    <span className="text-sm">
                      {playlist.is_public ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>

                <h1 className="text-4xl font-bold text-white mb-2">
                  {playlist.title}
                </h1>

                {playlist.description && (
                  <p className="text-gray-300 text-lg mb-4 max-w-2xl">
                    {playlist.description}
                  </p>
                )}

                <div className="flex items-center space-x-6 text-gray-400">
                  <span>{movies.length} movies</span>
                  <span>Created {new Date(playlist.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center space-x-4 mt-6">
                  <Button
                    onClick={() => {/* TODO: Play all */}}
                    icon={Play}
                    size="lg"
                    className="bg-white text-black hover:bg-gray-200"
                  >
                    Play All
                  </Button>
                  
                  <Button
                    onClick={() => {/* TODO: Share playlist */}}
                    icon={Share2}
                    variant="secondary"
                    size="lg"
                  >
                    Share
                  </Button>

                  {isOwner && (
                    <Button
                      onClick={() => navigate(`/playlist/${playlist.id}/add-movies`)}
                      icon={Plus}
                      variant="secondary"
                      size="lg"
                    >
                      Add Movies
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movies List */}
      <div className="container mx-auto px-6 py-12">
        {movies.length === 0 ? (
          <div className="text-center py-20">
            <Play className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">
              No movies in this playlist
            </h2>
            <p className="text-gray-400 mb-8">
              {isOwner ? 'Start adding movies to build your collection' : 'This playlist is empty'}
            </p>
            {isOwner && (
              <Button
                onClick={() => navigate(`/playlist/${playlist.id}/add-movies`)}
                icon={Plus}
              >
                Add Movies
              </Button>
            )}
          </div>
        ) : (
          <div>
            {/* Sort Controls */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {movies.length} Movies
              </h2>
              
              <div className="flex items-center space-x-2">
                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                >
                  <option value="order">Playlist Order</option>
                  <option value="oldest">Oldest First</option>
                  <option value="newest">Newest First</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popularity">Most Popular</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {sortedMovies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group"
              >
                <div className="text-gray-400 w-8 text-center">
                  {index + 1}
                </div>

                <div
                  onClick={() => navigate(`/movie/${movie.movie_id}`)}
                  className="flex items-center space-x-4 flex-1 cursor-pointer"
                >
                  <div className="w-16 h-24 rounded overflow-hidden flex-shrink-0">
                    {movie.movie_poster ? (
                      <img
                        src={getImageUrl(movie.movie_poster, 'w200')}
                        alt={movie.movie_title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <Play className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-white font-semibold group-hover:text-purple-400 transition-colors">
                      {movie.movie_title}
                    </h3>
                    <div className="flex items-center space-x-4 text-gray-400 text-sm">
                      {movie.movie_year > 0 && <span>{movie.movie_year}</span>}
                      {movie.movie_rating > 0 && (
                        <span className="flex items-center space-x-1">
                          <span>★</span>
                          <span>{movie.movie_rating.toFixed(1)}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {user && (
                    <button
                      onClick={() => handleWatchlistToggle(movie)}
                      className={`p-2 rounded-full transition-colors ${
                        isInWatchlist(movie.movie_id)
                          ? 'text-red-500 hover:text-red-400'
                          : 'text-gray-400 hover:text-red-400'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isInWatchlist(movie.movie_id) ? 'fill-current' : ''}`} />
                    </button>
                  )}

                  {isOwner && (
                    <button
                      onClick={() => {/* TODO: Remove from playlist */}}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};