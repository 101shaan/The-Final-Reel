import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, X, Check } from 'lucide-react';
import { Button } from './ui/Button';

interface FilterOptions {
  genres: number[];
  yearRange: [number, number];
  rating: number;
  sortBy: string;
}

interface FilterPanelProps {
  onFiltersChange: (filters: FilterOptions) => void;
  className?: string;
}

const GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'release_date.asc', label: 'Oldest First' },
  { value: 'title.asc', label: 'A-Z' },
  { value: 'title.desc', label: 'Z-A' },
];

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1900;

export const FilterPanel: React.FC<FilterPanelProps> = ({
  onFiltersChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<'sort' | 'year' | 'rating' | 'genres'>('sort');
  const [filters, setFilters] = useState<FilterOptions>({
    genres: [],
    yearRange: [MIN_YEAR, CURRENT_YEAR],
    rating: 0,
    sortBy: 'popularity.desc',
  });
  const filterRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleGenreToggle = (genreId: number) => {
    const newGenres = filters.genres.includes(genreId)
      ? filters.genres.filter(id => id !== genreId)
      : [...filters.genres, genreId];
    
    const newFilters = { ...filters, genres: newGenres };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleYearRangeChange = (type: 'min' | 'max', value: number) => {
    // Ensure min year doesn't exceed max year and max year doesn't go below min year
    const newYearRange: [number, number] = type === 'min' 
      ? [Math.min(value, filters.yearRange[1]), filters.yearRange[1]]
      : [filters.yearRange[0], Math.max(value, filters.yearRange[0])];
    
    const newFilters = { ...filters, yearRange: newYearRange };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleYearInput = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || (type === 'min' ? MIN_YEAR : CURRENT_YEAR);
    const boundedValue = Math.max(MIN_YEAR, Math.min(numValue, CURRENT_YEAR));
    handleYearRangeChange(type, boundedValue);
  };

  const handleRatingChange = (rating: number) => {
    const newFilters = { ...filters, rating };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSortChange = (sortBy: string) => {
    const newFilters = { ...filters, sortBy };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: FilterOptions = {
      genres: [],
      yearRange: [MIN_YEAR, CURRENT_YEAR],
      rating: 0,
      sortBy: 'popularity.desc',
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const hasActiveFilters = filters.genres.length > 0 || 
    filters.yearRange[0] > MIN_YEAR || 
    filters.yearRange[1] < CURRENT_YEAR ||
    filters.rating > 0 ||
    filters.sortBy !== 'popularity.desc';

  // Find the current sort option label
  const currentSortLabel = SORT_OPTIONS.find(option => option.value === filters.sortBy)?.label || 'Sort By';

  return (
    <div className={`relative ${className}`} ref={filterRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="secondary"
        className="relative flex items-center gap-1 px-4 py-2"
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full" />
        )}
        <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-xl shadow-xl z-50 w-72 overflow-hidden"
          >
            <div className="p-3 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">Filters</h3>
              <div className="flex items-center space-x-2">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-purple-400 hover:text-purple-300 text-xs px-2 py-1 bg-purple-900/30 rounded-md transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-700/50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex border-b border-gray-700">
              <button 
                className={`flex-1 py-2 text-center text-sm font-medium transition-colors ${currentTab === 'sort' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:text-gray-200'}`}
                onClick={() => setCurrentTab('sort')}
              >
                Sort
              </button>
              <button 
                className={`flex-1 py-2 text-center text-sm font-medium transition-colors ${currentTab === 'year' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:text-gray-200'}`}
                onClick={() => setCurrentTab('year')}
              >
                Year
              </button>
              <button 
                className={`flex-1 py-2 text-center text-sm font-medium transition-colors ${currentTab === 'rating' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:text-gray-200'}`}
                onClick={() => setCurrentTab('rating')}
              >
                Rating
              </button>
              <button 
                className={`flex-1 py-2 text-center text-sm font-medium transition-colors ${currentTab === 'genres' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:text-gray-200'}`}
                onClick={() => setCurrentTab('genres')}
              >
                Genres
              </button>
            </div>

            <AnimatePresence mode="wait">
              {currentTab === 'sort' && (
                <motion.div
                  key="sort-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-3"
                >
                  <div className="space-y-1">
                  {SORT_OPTIONS.map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleSortChange(option.value)}
                        className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-sm ${
                          filters.sortBy === option.value
                            ? 'bg-purple-600/20 text-purple-300'
                            : 'hover:bg-gray-700/50 text-gray-300'
                        }`}
                      >
                        <span>{option.label}</span>
                        {filters.sortBy === option.value && <Check className="w-4 h-4" />}
                      </button>
                  ))}
              </div>
                </motion.div>
              )}

              {currentTab === 'year' && (
                <motion.div
                  key="year-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-3"
                >
                  <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                        From Year: {filters.yearRange[0]}
                </label>
                      <div className="flex items-center gap-2">
                  <input
                          type="range"
                          min={MIN_YEAR}
                          max={CURRENT_YEAR}
                    value={filters.yearRange[0]}
                    onChange={(e) => handleYearRangeChange('min', parseInt(e.target.value))}
                          className="w-full accent-purple-500"
                  />
                  <input
                    type="number"
                          min={MIN_YEAR}
                          max={filters.yearRange[1]}
                          value={filters.yearRange[0]}
                          onChange={(e) => handleYearInput('min', e.target.value)}
                          className="w-16 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        To Year: {filters.yearRange[1]}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={MIN_YEAR}
                          max={CURRENT_YEAR}
                          value={filters.yearRange[1]}
                          onChange={(e) => handleYearRangeChange('max', parseInt(e.target.value))}
                          className="w-full accent-purple-500"
                        />
                        <input
                          type="number"
                          min={filters.yearRange[0]}
                          max={CURRENT_YEAR}
                          value={filters.yearRange[1]}
                          onChange={(e) => handleYearInput('max', e.target.value)}
                          className="w-16 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentTab === 'rating' && (
                <motion.div
                  key="rating-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-3"
                >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Minimum Rating
                </label>
                  <input
                    type="range"
                    min="0"
                    max="9"
                    step="1"
                    value={filters.rating}
                    onChange={(e) => handleRatingChange(parseInt(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                  <div className="flex justify-between mt-2">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(rating => (
                    <button
                      key={rating}
                      onClick={() => handleRatingChange(rating)}
                        className={`w-6 h-6 rounded-full text-xs flex items-center justify-center ${
                        filters.rating === rating
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                        {rating}
                    </button>
                  ))}
                </div>
                </motion.div>
              )}

              {currentTab === 'genres' && (
                <motion.div
                  key="genres-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-3 max-h-60 overflow-y-auto custom-scrollbar"
                >
                <div className="flex flex-wrap gap-2">
                  {GENRES.map(genre => (
                    <button
                      key={genre.id}
                      onClick={() => handleGenreToggle(genre.id)}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        filters.genres.includes(genre.id)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};