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
  Info
} from 'lucide-react';
import { 
  movieService, 
  getImageUrl, 
  getBackdropUrl, 
  Video, 
  BBFCRating,
  getIMDBParentsGuideUrl
} from '../lib/tmdb';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { TrailerModal } from '../components/TrailerModal';
import { useWatchlist } from '../hooks/useWatchlist';
import { useAuth } from '../hooks/useAuth';
import { ReviewsSection } from '../components/ReviewsSection';

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
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                  {movie.title}
                </h1>

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

      {/* Enhanced Info Cards */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Box Office Performance */}
          {(movie.budget > 0 || movie.revenue > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/20 backdrop-blur-sm"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
              <div className="relative p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Box Office</h3>
                </div>
                <div className="space-y-3">
                  {movie.budget > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Budget</span>
                      <span className="text-white font-medium">
                        {formatCurrency(movie.budget)}
                      </span>
                    </div>
                  )}
                  {movie.revenue > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Revenue</span>
                      <span className="text-green-400 font-medium">
                        {formatCurrency(movie.revenue)}
                      </span>
                    </div>
                  )}
                  {movie.budget > 0 && movie.revenue > 0 && (
                    <div className="pt-2 border-t border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Profit</span>
                        <span className={`font-medium ${movie.revenue > movie.budget ? 'text-green-400' : 'text-red-400'}`}>
                          {formatCurrency(movie.revenue - movie.budget)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Production Info */}
          {movie.production_companies && movie.production_companies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/20 backdrop-blur-sm"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
              <div className="relative p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Film className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Production</h3>
                </div>
                <div className="space-y-2">
                  {movie.production_companies.slice(0, 3).map((company) => (
                    <div key={company.id} className="flex items-center space-x-3">
                      {company.logo_path ? (
                        <img
                          src={getImageUrl(company.logo_path, 'w92')}
                          alt={company.name}
                          className="w-8 h-8 object-contain bg-white rounded p-1"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                          <Film className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                      <span className="text-gray-300 text-sm">{company.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Movie Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-500/20 backdrop-blur-sm"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
            <div className="relative p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Award className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Details</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status</span>
                  <span className="text-white font-medium">{movie.status}</span>
                </div>
                {movie.vote_count > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Votes</span>
                    <span className="text-white font-medium">
                      {movie.vote_count.toLocaleString()}
                    </span>
                  </div>
                )}
                {movie.popularity && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Popularity</span>
                    <span className="text-orange-400 font-medium">
                      {Math.round(movie.popularity)}
                    </span>
                  </div>
                )}
                {movie.homepage && (
                  <div className="pt-2 border-t border-gray-700">
                    <a
                      href={movie.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Official Website</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Languages & Countries */}
          {(movie.spoken_languages?.length > 0 || movie.production_countries?.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/20 backdrop-blur-sm"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
              <div className="relative p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">International</h3>
                </div>
                <div className="space-y-3">
                  {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                    <div>
                      <span className="text-gray-400 text-sm block mb-1">Languages</span>
                      <div className="flex flex-wrap gap-1">
                        {movie.spoken_languages.slice(0, 3).map((lang, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-500/20 rounded text-xs text-blue-300">
                            {lang.english_name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {movie.production_countries && movie.production_countries.length > 0 && (
                    <div>
                      <span className="text-gray-400 text-sm block mb-1">Countries</span>
                      <div className="flex flex-wrap gap-1">
                        {movie.production_countries.slice(0, 3).map((country, index) => (
                          <span key={index} className="px-2 py-1 bg-cyan-500/20 rounded text-xs text-cyan-300">
                            {country.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* IMDB Link */}
          {movie.imdb_id && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-900/20 to-amber-900/20 border border-yellow-500/20 backdrop-blur-sm"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
              <div className="relative p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">External Links</h3>
                </div>
                <a
                  href={`https://www.imdb.com/title/${movie.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg text-yellow-400 hover:text-yellow-300 transition-all duration-200"
                >
                  <span className="font-medium">View on IMDb</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </a>
              </div>
            </motion.div>
          )}
        </div>
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