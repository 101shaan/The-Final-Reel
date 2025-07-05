import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { movieService } from '../lib/tmdb';
import { SearchBar } from '../components/SearchBar';
import { MovieGrid } from '../components/MovieGrid';
import { FilterPanel } from '../components/FilterPanel';

interface FilterOptions {
  genres: number[];
  yearRange: [number, number];
  rating: number;
  sortBy: string;
  // Minimum vote count to ensure quality
  minVoteCount: number;
}

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    genres: [],
    yearRange: [1900, new Date().getFullYear()],
    rating: 0,
    sortBy: 'popularity.desc',
    minVoteCount: 20, // Default minimum vote count
  });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => movieService.searchMovies(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

  const { data: discoverResults, isLoading: discoverLoading } = useQuery({
    queryKey: ['discover', filters],
    queryFn: () => movieService.discoverMovies({
      with_genres: filters.genres.length > 0 ? filters.genres.join(',') : undefined,
      primary_release_date_gte: filters.yearRange[0] !== 1900 ? `${filters.yearRange[0]}-01-01` : undefined,
      primary_release_date_lte: filters.yearRange[1] !== new Date().getFullYear() ? `${filters.yearRange[1]}-12-31` : undefined,
      'vote_average.gte': filters.rating > 0 ? filters.rating : undefined,
      'vote_count.gte': filters.rating > 0 ? filters.minVoteCount : undefined, // Apply min vote count when filtering by rating
      sort_by: filters.sortBy,
    }),
    enabled: debouncedQuery.length === 0,
  });

  const movies = debouncedQuery ? searchResults?.results || [] : discoverResults?.results || [];
  const loading = debouncedQuery ? searchLoading : discoverLoading;

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-6 py-8 space-y-8"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold text-white mb-8">
          {debouncedQuery ? 'Search Results' : 'Discover Movies'}
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <SearchBar
            onSearch={setQuery}
            placeholder="Search for movies..."
            className="flex-1 max-w-2xl"
          />
          
          <div className="relative">
            <FilterPanel onFiltersChange={handleFiltersChange} />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <MovieGrid
          movies={movies}
          loading={loading}
          title={debouncedQuery ? `Results for "${debouncedQuery}"` : 'Popular Movies'}
        />
        
        {!loading && movies.length === 0 && debouncedQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-lg">
              No movies found for "{debouncedQuery}"
            </p>
            <p className="text-gray-500 mt-2">
              Try searching with different keywords or adjust your filters
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};