import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Plus, Check, X } from 'lucide-react';
import { usePlaylists } from '../hooks/usePlaylists';
import { useAuth } from '../hooks/useAuth';
import { movieService, Movie } from '../lib/tmdb';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { MovieCard } from '../components/MovieCard';
import toast from 'react-hot-toast';

export const AddMoviesToPlaylistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playlists, featuredPlaylists, addMovieToPlaylist, getPlaylistMovies, isAdmin } = usePlaylists();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [playlistMovies, setPlaylistMovies] = useState<number[]>([]);
  const [addingMovies, setAddingMovies] = useState<Set<number>>(new Set());

  const playlist = [...playlists, ...featuredPlaylists].find(p => p.id === id);

  useEffect(() => {
    loadPlaylistMovies();
  }, [id]);

  const loadPlaylistMovies = async () => {
    if (!id) return;
    
    try {
      const movies = await getPlaylistMovies(id);
      setPlaylistMovies(movies.map(m => m.movie_id));
    } catch (error) {
      console.error('Error loading playlist movies:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const results = await movieService.searchMovies(searchQuery);
      setSearchResults(results.results || []);
    } catch (error) {
      console.error('Error searching movies:', error);
      toast.error('Failed to search movies');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovie = async (movie: Movie) => {
    if (!id || addingMovies.has(movie.id)) return;

    setAddingMovies(prev => new Set(prev).add(movie.id));
    
    try {
      const { error } = await addMovieToPlaylist(id, movie);
      
      if (error) {
        toast.error('Failed to add movie to playlist');
        console.error('Error adding movie:', error);
        return;
      }

      setPlaylistMovies(prev => [...prev, movie.id]);
      toast.success(`Added "${movie.title}" to playlist`);
    } catch (error) {
      toast.error('Failed to add movie to playlist');
      console.error('Error adding movie:', error);
    } finally {
      setAddingMovies(prev => {
        const newSet = new Set(prev);
        newSet.delete(movie.id);
        return newSet;
      });
    }
  };

  // Guard UI after all hooks are declared (avoid hooks order mismatch)
  if (!user || !isAdmin || !playlist) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          {!playlist ? 'Playlist Not Found' : 'Access Denied'}
        </h1>
        <p className="text-gray-400 mb-8">
          {!playlist ? 'The playlist you are looking for does not exist.' : 'Only admin users can add movies to playlists.'}
        </p>
        <Button onClick={() => navigate('/playlists')}>Back to Playlists</Button>
      </div>
    );
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const isMovieInPlaylist = (movieId: number) => playlistMovies.includes(movieId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-900"
    >
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate(`/playlist/${id}`)}
              variant="secondary"
              size="sm"
              icon={ArrowLeft}
            >
              Back to Playlist
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Add Movies</h1>
              <p className="text-gray-400">Add movies to "{playlist.title}"</p>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for movies to add..."
                className="w-full px-4 py-3 pl-12 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <Button
              onClick={handleSearch}
              icon={Search}
              loading={loading}
              disabled={!searchQuery.trim()}
            >
              Search
            </Button>
          </div>
        </motion.div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Search Results</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {searchResults.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative group"
                >
                  <MovieCard movie={movie} />
                  
                  {/* Add/Added Button Overlay */}
                  <div className="absolute top-2 right-2">
                    {isMovieInPlaylist(movie.id) ? (
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddMovie(movie)}
                        disabled={addingMovies.has(movie.id)}
                        className="w-10 h-10 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                      >
                        {addingMovies.has(movie.id) ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Plus className="w-5 h-5 text-white" />
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Empty State */}
        {!loading && searchResults.length === 0 && searchQuery && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">No movies found</h2>
            <p className="text-gray-400 mb-8">
              Try searching with different keywords
            </p>
          </div>
        )}

        {/* Initial State */}
        {!loading && searchResults.length === 0 && !searchQuery && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">Search for Movies</h2>
            <p className="text-gray-400 mb-8">
              Use the search bar above to find movies to add to your playlist
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}; 