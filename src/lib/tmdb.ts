import axios from 'axios';

const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

console.log('TMDB Config:', {
  baseUrl: TMDB_BASE_URL,
  hasApiKey: !!TMDB_API_KEY,
  imageBaseUrl: TMDB_IMAGE_BASE_URL
});

if (!TMDB_API_KEY) {
  throw new Error('TMDB API key is required');
}

export const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    'Authorization': `Bearer ${TMDB_API_KEY}`,
    'Content-Type': 'application/json;charset=utf-8'
  }
});

// Add request interceptor for debugging
tmdbApi.interceptors.request.use(
  (config) => {
    console.log('TMDB Request:', config.url, config.params);
    return config;
  },
  (error) => {
    console.error('TMDB Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
tmdbApi.interceptors.response.use(
  (response) => {
    console.log('TMDB Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('TMDB Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const getImageUrl = (path: string, size: string = 'w500') => {
  if (!path) return '';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path: string, size: string = 'w1280') => {
  if (!path) return '';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

// Function to get the IMDB parents guide URL
export const getIMDBParentsGuideUrl = (imdbId: string) => {
  if (!imdbId) return '';
  return `https://www.imdb.com/title/${imdbId}/parentalguide`;
};

// UK film ratings (BBFC)
export type BBFCRating = 'U' | 'PG' | '12A' | '12' | '15' | '18' | 'R18' | 'TBC';

// Map to convert standard certification names to UK BBFC ratings
export const mapToBBFCRating = (certification: string): BBFCRating => {
  const rating = certification.toUpperCase();
  
  // Direct mappings for UK ratings
  if (['U', 'PG', '12A', '12', '15', '18', 'R18'].includes(rating)) {
    return rating as BBFCRating;
  }
  
  // Map US ratings to UK equivalents (approximate)
  switch (rating) {
    case 'G': return 'U';
    case 'PG': return 'PG';
    case 'PG-13': return '12A';
    case 'R': return '15';
    case 'NC-17': return '18';
    default: return 'TBC';
  }
};

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface MovieDetails extends Movie {
  budget: number;
  genres: Array<{ id: number; name: string }>;
  homepage: string;
  imdb_id: string;
  production_companies: Array<{
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }>;
  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;
  revenue: number;
  runtime: number;
  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
  status: string;
  tagline: string;
}

export interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  official: boolean;
  published_at: string;
  site: string;
  size: number;
  type: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  cast: Cast[];
  crew: Crew[];
}

export const movieService = {
  getTrending: async (timeWindow: 'day' | 'week' = 'week') => {
    try {
      const response = await tmdbApi.get(`/trending/movie/${timeWindow}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error;
    }
  },

  getPopular: async (page: number = 1) => {
    try {
      const response = await tmdbApi.get('/movie/popular', { params: { page } });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}`, {
        params: {
          append_to_response: 'videos,external_ids,credits,similar'
        }
      });
      return {
        ...response.data,
        imdb_id: response.data.external_ids?.imdb_id
      };
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  getMovieVideos: async (movieId: number) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/videos`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie videos:', error);
      throw error;
    }
  },

  getMovieReleaseDates: async (movieId: number) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/release_dates`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie release dates:', error);
      throw error;
    }
  },

  getUKCertification: async (movieId: number): Promise<BBFCRating> => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/release_dates`);
      const releases = response.data.results || [];
      
      // First try to find UK certification (GB)
      const ukRelease = releases.find((r: any) => r.iso_3166_1 === 'GB');
      if (ukRelease && ukRelease.release_dates && ukRelease.release_dates.length > 0) {
        const cert = ukRelease.release_dates[0].certification;
        if (cert) return mapToBBFCRating(cert);
      }
      
      // If no UK certification, try US
      const usRelease = releases.find((r: any) => r.iso_3166_1 === 'US');
      if (usRelease && usRelease.release_dates && usRelease.release_dates.length > 0) {
        const cert = usRelease.release_dates[0].certification;
        if (cert) return mapToBBFCRating(cert);
      }
      
      return 'TBC';
    } catch (error) {
      console.error('Error fetching movie certifications:', error);
      return 'TBC';
    }
  },

  searchMovies: async (query: string, page: number = 1) => {
    try {
      const response = await tmdbApi.get('/search/movie', {
        params: { query, page },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  discoverMovies: async (params: {
    with_genres?: string;
    primary_release_year?: number;
    primary_release_date_gte?: string;
    primary_release_date_lte?: string;
    'vote_average.gte'?: number;
    'vote_count.gte'?: number;
    sort_by?: string;
    page?: number;
  }) => {
    try {
      const response = await tmdbApi.get('/discover/movie', { params });
      return response.data;
    } catch (error) {
      console.error('Error discovering movies:', error);
      throw error;
    }
  },

  getGenres: async () => {
    try {
      const response = await tmdbApi.get('/genre/movie/list');
      return response.data;
    } catch (error) {
      console.error('Error fetching genres:', error);
      throw error;
    }
  },

  async getMovie(id: number) {
    console.log('TMDB Request:', `/movie/${id}`, undefined);
    const response = await fetch(
      `${import.meta.env.VITE_TMDB_BASE_URL}/movie/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&append_to_response=videos,external_ids`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch movie');
    }
    
    const data = await response.json();
    console.log('TMDB Response:', `/movie/${id}`, response.status);
    
    return {
      ...data,
      imdb_id: data.external_ids?.imdb_id
    };
  },

  getMovieCredits: async (movieId: number): Promise<Credits> => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/credits`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie credits:', error);
      throw error;
    }
  },

  getSimilarMovies: async (movieId: number): Promise<any> => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/similar`);
      return response.data;
    } catch (error) {
      console.error('Error fetching similar movies:', error);
      throw error;
    }
  },
  
  // New function to get better recommendations
  getEnhancedSimilarMovies: async (movie: MovieDetails): Promise<any> => {
    try {
      // Get director(s) for this movie
      const directors = movie.credits?.crew?.filter(person => person.job === 'Director') || [];
      const directorIds = directors.map(director => director.id);
      
      // Get movie details including age rating
      const rating = await movieService.getUKCertification(movie.id);
      const isAdult = ['15', '18', 'R18'].includes(rating);
      
      // Get similar movies by TMDB's algorithm first
      const similarResponse = await tmdbApi.get(`/movie/${movie.id}/similar`, {
        params: { page: 1 }
      });
      let recommendedMovies = similarResponse.data.results || [];
      
      // If we have directors, try to find more movies by the same director(s)
      if (directorIds.length > 0) {
        const directorMoviesPromises = directorIds.map(async (directorId) => {
          try {
            const response = await tmdbApi.get(`/person/${directorId}/movie_credits`);
            return response.data?.crew?.filter((m: any) => 
              // Only include movies where they were director
              m.job === 'Director' && 
              // Don't include the current movie
              m.id !== movie.id &&
              // Don't include movies with very low ratings
              m.vote_average >= 5.0 && 
              // Ensure some minimum vote count for reliability
              m.vote_count >= 20
            ) || [];
          } catch (error) {
            console.error(`Error fetching director's movies:`, error);
            return [];
          }
        });
        
        const directorMoviesResults = await Promise.all(directorMoviesPromises);
        const directorMovies = directorMoviesResults.flat();
        
        // Add up to 2-3 movies by the same director if quality is good
        const qualityDirectorMovies = directorMovies
          .filter(m => m.vote_average >= 6.0)
          .sort((a, b) => b.vote_average - a.vote_average)
          .slice(0, 3);
        
        // Add these to our recommendations, avoiding duplicates
        const existingIds = new Set(recommendedMovies.map((m: any) => m.id));
        qualityDirectorMovies.forEach((movie: any) => {
          if (!existingIds.has(movie.id)) {
            existingIds.add(movie.id);
            recommendedMovies.push(movie);
          }
        });
      }
      
      // Now fetch movies with similar genres, if we don't have enough recommendations yet
      if (recommendedMovies.length < 8 && movie.genres && movie.genres.length > 0) {
        const genreIds = movie.genres.map(g => g.id).join(',');
        const genreResponse = await tmdbApi.get('/discover/movie', {
          params: {
            with_genres: genreIds,
            'vote_average.gte': 6.0,
            'vote_count.gte': 50,
            without_keywords: movie.adult ? '' : '311', // 311 is TMDB's keyword for "erotic"
            page: 1
          }
        });
        
        // Add these to our recommendations, avoiding duplicates
        const existingIds = new Set(recommendedMovies.map((m: any) => m.id));
        const genreMovies = genreResponse.data.results || [];
        genreMovies.forEach((movie: any) => {
          if (!existingIds.has(movie.id)) {
            existingIds.add(movie.id);
            recommendedMovies.push(movie);
          }
        });
      }
      
      // Filter out adult content if the current movie is for younger audiences
      if (!isAdult) {
        recommendedMovies = recommendedMovies.filter((m: any) => !m.adult);
      }
      
      // Filter out low-quality movies
      recommendedMovies = recommendedMovies.filter((m: any) => {
        return m.vote_average >= 5.0 && m.vote_count >= 20;
      });
      
      // Sort by relevance and rating
      recommendedMovies.sort((a: any, b: any) => b.vote_average - a.vote_average);
      
      // Return in the expected format
      return {
        results: recommendedMovies.slice(0, 12) // Return up to 12 movies
      };
    } catch (error) {
      console.error('Error fetching enhanced similar movies:', error);
      // Fallback to regular similar movies
      return movieService.getSimilarMovies(movie.id);
    }
  },

  // Get person details
  getPersonDetails: async (personId: number): Promise<any> => {
    try {
      const response = await tmdbApi.get(`/person/${personId}`, {
        params: {
          append_to_response: 'movie_credits,tv_credits,external_ids'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching person details:', error);
      throw error;
    }
  },

  // Get person's movies
  getPersonMovies: async (personId: number): Promise<any> => {
    try {
      const response = await tmdbApi.get(`/person/${personId}/movie_credits`);
      return response.data;
    } catch (error) {
      console.error('Error fetching person movies:', error);
      throw error;
    }
  },
};