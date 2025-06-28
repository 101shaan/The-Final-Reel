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
          append_to_response: 'videos,external_ids'
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
    'vote_average.gte'?: number;
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
};