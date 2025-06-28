import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Play, 
  Star, 
  Calendar, 
  Clock, 
  Globe,
  ArrowLeft,
  Plus,
  Check,
  Award,
  DollarSign,
  Users,
  Film,
  Sparkles,
  Info,
  User,
  ChevronRight
} from 'lucide-react';
import { 
  movieService, 
  getImageUrl, 
  getBackdropUrl, 
  Video, 
  BBFCRating,
  getIMDBParentsGuideUrl,
  Cast,
  Crew
} from '../lib/tmdb';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { TrailerModal } from '../components/TrailerModal';
import { useWatchlist } from '../hooks/useWatchlist';
import { useAuth } from '../hooks/useAuth';
import { ReviewsSection } from '../components/ReviewsSection';
import { MovieCard } from '../components/MovieCard';
import { CastCard } from '../components/CastCard';

interface Movie {
  id: number;
  imdb_id: string;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  runtime: number;
  genres: { id: number; name: string }[];
  videos: { results: { key: string; type: string }[] };
  credits?: {
    cast: Cast[];
    crew: Crew[];
  };
  similar?: {
    results: {
      id: number;
      title: string;
      poster_path: string;
      vote_average: number;
    }[];
  };
}

// UK rating badge component
const RatingBadge: React.FC<{ rating: BBFCRating, imdbId?: string }> = ({ rating, imdbId }) => {
  const getBadgeColor = () => {
    switch(rating) {
      case 'U': return 'bg-green-600 border-green-500';
      case 'PG': return 'bg-yellow-500 border-yellow-400';
      case '12': 
      case '12A': return 'bg-orange-500 border-orange-400';
      case '15': return 'bg-red-500 border-red-400';
      case '18': 
      case 'R18': return 'bg-red-700 border-red-600';
      default: return 'bg-gray-600 border-gray-500';
    }
  };
  
  const handleClick = () => {
    if (imdbId) {
      window.open(getIMDBParentsGuideUrl(imdbId), '_blank');
    }
  };
  
  return (
    <div 
      onClick={handleClick}
      className={`flex items-center justify-center h-6 min-w-[26px] px-1 rounded font-bold text-white text-xs ${getBadgeColor()} border cursor-pointer`}
      title="Click to view IMDB Parents Guide"
    >
      {rating}
    </div>
  );
};

export const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const [showTrailer, setShowTrailer] = useState(false);
  const [ukRating, setUkRating] = useState<BBFCRating>('TBC');

  const movieId = parseInt(id || '0');

  const { data: movie, isLoading: movieLoading } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => movieService.getMovieDetails(movieId),
    enabled: !!movieId,
  });

  const { data: videosData } = useQuery({
    queryKey: ['movie-videos', movieId],
    queryFn: () => movieService.getMovieVideos(movieId),
    enabled: !!movieId,
  });

  // Fetch UK certification
  useEffect(() => {
    if (movieId) {
      movieService.getUKCertification(movieId)
        .then(rating => setUkRating(rating))
        .catch(error => console.error('Failed to fetch UK rating:', error));
    }
  }, [movieId]);

  const trailer = videosData?.results?.find(
    (video: Video) => video.type === 'Trailer' && video.site === 'YouTube'
  );

  const inWatchlist = movie ? isInWatchlist(movie.id) : false;

  const handleWatchlistToggle = async () => {
    if (!movie || !user) return;
    
    if (inWatchlist) {
      await removeFromWatchlist(movie.id);
    } else {
      await addToWatchlist(movie);
    }
  };

  if (movieLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Movie not found</h1>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Get key crew members
  const getKeyCrewMembers = () => {
    if (!movie.credits?.crew) return [];
    
    const keyRoles = ['Director', 'Producer', 'Screenplay', 'Writer', 'Director of Photography', 'Music'];
    const keyMembers = movie.credits.crew
      .filter(person => keyRoles.includes(person.job))
      .slice(0, 4);
    
    return keyMembers;
  };

  // Get cast members
  const getCastMembers = () => {
    if (!movie.credits?.cast) return [];
    return movie.credits.cast.slice(0, 6);
  };

  // Get similar movies
  const getSimilarMovies = () => {
    if (!movie.similar?.results) return [];
    return movie.similar.results.slice(0, 6);
  };

  const castMembers = getCastMembers();
  const crewMembers = getKeyCrewMembers();
  const similarMovies = getSimilarMovies();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <div className="relative h-[80vh] overflow-hidden">
        {movie.backdrop_path && (
          <div className="absolute inset-0">
            <img
              src={getBackdropUrl(movie.backdrop_path, 'w1280')}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
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

        {/* Content */}
        <div className="absolute inset-0 flex items-end pb-12">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center lg:items-end space-y-8 lg:space-y-0 lg:space-x-12">
              {/* Poster */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex-shrink-0"
              >
                <div className="w-80 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                  {movie.poster_path ? (
                    <img
                      src={getImageUrl(movie.poster_path, 'w500')}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <Play className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Info */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex-1 text-center lg:text-left"
              >
                <div className="max-w-3xl">
                  <a 
                    href={`https://www.imdb.com/title/${movie.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-purple-400 transition-colors inline-block"
                  >
                    <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
                  </a>
                </div>

                {movie.tagline && (
                  <p className="text-xl text-gray-300 italic mb-6">
                    "{movie.tagline}"
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-6 text-gray-300">
                  {movie.vote_average > 0 && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-medium">
                        {movie.vote_average.toFixed(1)}
                      </span>
                    </div>
                  )}

                  {movie.release_date && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-5 h-5" />
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                    </div>
                  )}

                  {movie.runtime && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-5 h-5" />
                      <span>{formatRuntime(movie.runtime)}</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5" />
                    <span className="uppercase">{movie.original_language}</span>
                  </div>

                  {/* UK Age Rating Badge */}
                  <div className="flex items-center space-x-1">
                    <RatingBadge rating={ukRating} imdbId={movie.imdb_id} />
                  </div>
                </div>

                {/* Genres */}
                {movie.genres && movie.genres.length > 0 && (
                  <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                  {trailer && (
                    <Button
                      onClick={() => setShowTrailer(true)}
                      icon={Play}
                      size="lg"
                      className="bg-white text-black hover:bg-gray-200"
                    >
                      Watch Trailer
                    </Button>
                  )}

                  {user && (
                    <Button
                      onClick={handleWatchlistToggle}
                      icon={inWatchlist ? Check : Plus}
                      variant="secondary"
                      size="lg"
                    >
                      {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                    </Button>
                  )}

                  {movie.imdb_id && (
                    <Button
                      onClick={() => window.open(getIMDBParentsGuideUrl(movie.imdb_id), '_blank')}
                      icon={Info}
                      variant="ghost"
                      size="lg"
                    >
                      Parents Guide
                    </Button>
                  )}
                </div>

                {/* Overview */}
                {movie.overview && (
                  <p className="text-gray-200 text-lg leading-relaxed max-w-3xl">
                    {movie.overview}
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast & Crew Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Cast & Crew Spotlight</h2>
          </div>
          
          {castMembers.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {castMembers.map((person, index) => (
                <CastCard 
                  key={person.id} 
                  person={person} 
                  role={person.character} 
                  index={index} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400">
              No cast information available
            </div>
          )}

          {crewMembers.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">Key Crew</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {crewMembers.map((person) => (
                  <div key={`${person.id}-${person.job}`} className="flex items-center space-x-3 bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg">
                    {person.profile_path ? (
                      <img 
                        src={getImageUrl(person.profile_path, 'w92')} 
                        alt={person.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">{person.name}</p>
                      <p className="text-xs text-gray-400">{person.job}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Similar Movies Section */}
        {similarMovies.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Similar Movies</h2>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => navigate(`/search?similar=${movie.id}`)}
              >
                View All <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similarMovies.map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div className="container mx-auto px-6 py-12 border-t border-gray-800 mt-8">
        <ReviewsSection movieId={movieId} />
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <TrailerModal
          videoKey={trailer.key}
          isOpen={showTrailer}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </motion.div>
  );
};