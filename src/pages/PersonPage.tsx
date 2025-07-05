import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Film, Award, User, Star, Calendar } from 'lucide-react';
import { movieService, getImageUrl } from '../lib/tmdb';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { MovieCard } from '../components/MovieCard';

export const PersonPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'cast' | 'crew'>('cast');
  
  const personId = parseInt(id || '0');
  
  const { data: person, isLoading: personLoading } = useQuery({
    queryKey: ['person', personId],
    queryFn: () => movieService.getPersonDetails(personId),
    enabled: !!personId
  });
  
  if (personLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (!person) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Person not found</h1>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }
  
  // Format birthday/deathday
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Calculate age
  const getAge = () => {
    if (!person.birthday) return null;
    
    const birthDate = new Date(person.birthday);
    const endDate = person.deathday ? new Date(person.deathday) : new Date();
    let age = endDate.getFullYear() - birthDate.getFullYear();
    
    const m = endDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && endDate.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };
  
  // Format age display
  const ageDisplay = () => {
    const age = getAge();
    if (age === null) return '';
    
    if (person.deathday) {
      return ` (Died at age ${age})`;
    }
    return ` (Age ${age})`;
  };
  
  // Get relevant movies
  const getMovies = () => {
    const credits = person.movie_credits || { cast: [], crew: [] };
    
    const movies = viewMode === 'cast' 
      ? credits.cast || []
      : credits.crew || [];
    
    // Sort by popularity and filter out movies with no poster
    return movies
      .filter(movie => movie.poster_path)
      .sort((a, b) => b.popularity - a.popularity);
  };
  
  const movies = getMovies();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pb-12"
    >
      {/* Back button */}
      <motion.button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="w-6 h-6" />
      </motion.button>
      
      {/* Person Header */}
      <div className="bg-gradient-to-b from-purple-900/20 to-transparent pt-24 pb-12 mb-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Profile Image */}
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-purple-500/30 shadow-xl">
              {person.profile_path ? (
                <img 
                  src={getImageUrl(person.profile_path, 'h632')} 
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <User className="w-24 h-24 text-gray-600" />
                </div>
              )}
            </div>
            
            {/* Person Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {person.name}
              </h1>
              
              {person.known_for_department && (
                <div className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm mb-6">
                  {person.known_for_department}
                </div>
              )}
              
              {/* Bio */}
              {person.biography && (
                <div className="mb-6 max-w-3xl">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {person.biography.length > 400
                      ? `${person.biography.substring(0, 400)}...`
                      : person.biography}
                  </p>
                </div>
              )}
              
              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                <div>
                  <h3 className="text-gray-400 text-sm">Born</h3>
                  <p className="text-white">
                    {formatDate(person.birthday)}
                    {ageDisplay()}
                  </p>
                </div>
                
                {person.deathday && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Died</h3>
                    <p className="text-white">{formatDate(person.deathday)}</p>
                  </div>
                )}
                
                {person.place_of_birth && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Place of Birth</h3>
                    <p className="text-white">{person.place_of_birth}</p>
                  </div>
                )}
                
                {person.imdb_id && (
                  <div>
                    <h3 className="text-gray-400 text-sm">IMDB Profile</h3>
                    <a 
                      href={`https://www.imdb.com/name/${person.imdb_id}`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      View on IMDB
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filmography Section */}
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Film className="w-5 h-5 mr-2" />
            Filmography
          </h2>
          
          <div className="flex bg-gray-800 rounded-lg overflow-hidden">
            <button 
              className={`px-4 py-2 text-sm ${viewMode === 'cast' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setViewMode('cast')}
            >
              Acting
            </button>
            <button 
              className={`px-4 py-2 text-sm ${viewMode === 'crew' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setViewMode('crew')}
            >
              {person.known_for_department === 'Acting' ? 'Other Work' : 'Crew'}
            </button>
          </div>
        </div>
        
        {movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie, index) => (
              <div key={`${movie.id}-${movie.credit_id || index}`} className="flex flex-col h-full">
                <MovieCard movie={movie} index={index} />
                
                {/* Add character or job info */}
                <div className="mt-2 px-1">
                  {viewMode === 'cast' && movie.character && (
                    <p className="text-sm text-gray-400 text-center">as {movie.character}</p>
                  )}
                  
                  {viewMode === 'crew' && movie.job && (
                    <p className="text-sm text-gray-400 text-center">{movie.job}</p>
                  )}
                  
                  {movie.release_date && (
                    <p className="text-xs text-gray-500 text-center mt-1">
                      {new Date(movie.release_date).getFullYear()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">
              {viewMode === 'cast' 
                ? 'No acting credits found' 
                : 'No crew credits found'}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}; 