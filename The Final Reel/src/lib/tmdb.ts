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
      const response = await tmdbApi.get(`/movie/${movieId}`);
      return response.data;
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
};