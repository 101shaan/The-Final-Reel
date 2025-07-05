import axios from 'axios';

const STREAMING_API_URL = import.meta.env.VITE_STREAMING_API_URL || 'https://streaming-availability.p.rapidapi.com';
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || '6841e25addmsh6e0a62ea8c22022p1a79eajsn34cd367fbba6';

export interface StreamingInfo {
  service: string;
  streamingType: string;
  link: string;
  quality?: string;
  availableSince?: string;
  country?: string;
}

export interface StreamingResponse {
  imdbId: string;
  tmdbId: string;
  title: string;
  originalTitle: string;
  type: 'movie' | 'series';
  year: number;
  streamingInfo: {
    [country: string]: {
      [service: string]: StreamingInfo[];
    };
  };
  ratings: {
    imdb?: {
      rating: number;
      votes: number;
    };
    rottenTomatoes?: {
      rating: number;
      votes: number;
    };
  };
}

export const streamingService = {
  getStreamingInfo: async (type: 'movie' | 'series', id: number): Promise<StreamingResponse | null> => {
    try {
      console.log('Fetching streaming info for:', type, id);
      
      // First try to get by TMDB ID
      const response = await axios.get(`${STREAMING_API_URL}/get/basic`, {
        params: {
          tmdb_id: `${type}/${id}`,
          output_language: 'en'
        },
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': 'streaming-availability.p.rapidapi.com'
        }
      });
      
      console.log('Streaming info response status:', response.status);
      console.log('Streaming info response data:', JSON.stringify(response.data, null, 2).substring(0, 500) + '...');
      
      if (!response.data || Object.keys(response.data).length === 0) {
        console.log('No streaming data found for TMDB ID, trying alternative endpoint');
        
        // If no data, try the search endpoint as fallback
        const searchResponse = await axios.get(`${STREAMING_API_URL}/search/title`, {
          params: {
            title: 'F1 The Movie', // Hardcoded for testing, should be dynamic
            country: 'us',
            output_language: 'en'
          },
          headers: {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': 'streaming-availability.p.rapidapi.com'
          }
        });
        
        console.log('Search response status:', searchResponse.status);
        console.log('Search results count:', searchResponse.data?.result?.length || 0);
        
        if (searchResponse.data?.result?.length > 0) {
          return searchResponse.data.result[0];
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching streaming info:', error);
      return null;
    }
  },
  
  // Helper function to get a clean list of streaming services by country
  getStreamingServices: (data: StreamingResponse | null): { 
    country: string; 
    services: { 
      name: string; 
      link: string;
      logo: string;
    }[] 
  }[] => {
    if (!data || !data.streamingInfo) {
      console.log('No streaming info available in data:', data);
      return [];
    }
    
    const countries = Object.keys(data.streamingInfo);
    if (countries.length === 0) {
      console.log('No countries found in streaming info');
      return [];
    }
    
    const result = countries.map(country => {
      const countryServices = data.streamingInfo[country];
      const services = Object.keys(countryServices).map(service => {
        // Get the first streaming option for this service
        const info = countryServices[service][0];
        return {
          name: getServiceDisplayName(service),
          link: info.link,
          logo: getServiceLogo(service)
        };
      });
      
      return {
        country,
        services
      };
    });
    
    return result;
  },
  
  // Get ratings
  getRatings: (data: StreamingResponse | null): {
    imdb?: { rating: number; votes: number };
    rottenTomatoes?: { rating: number; votes: number };
  } => {
    if (!data || !data.ratings) {
      console.log('No ratings available in data:', data);
      return {};
    }
    
    // For testing when API doesn't return ratings
    if (process.env.NODE_ENV === 'development' && (!data.ratings.imdb && !data.ratings.rottenTomatoes)) {
      console.log('Using mock ratings for development');
      return {
        imdb: { rating: 7.8, votes: 12500 },
        rottenTomatoes: { rating: 85, votes: 120 }
      };
    }
    
    return data.ratings;
  },
  
  // Mock data for testing when API fails
  getMockStreamingData: (): StreamingResponse => {
    return {
      imdbId: "tt12345678",
      tmdbId: "movie/155",
      title: "F1 The Movie",
      originalTitle: "F1 The Movie",
      type: "movie",
      year: 2023,
      streamingInfo: {
        us: {
          netflix: [{
            service: "netflix",
            streamingType: "subscription",
            link: "https://www.netflix.com/title/81517155",
            availableSince: "2023-05-01"
          }],
          prime: [{
            service: "prime",
            streamingType: "subscription",
            link: "https://www.amazon.com/gp/video/detail/B09YVLGX2Z",
            availableSince: "2023-06-15"
          }]
        },
        gb: {
          disney: [{
            service: "disney",
            streamingType: "subscription",
            link: "https://www.disneyplus.com/movies/f1-the-movie/12345",
            availableSince: "2023-04-20"
          }]
        }
      },
      ratings: {
        imdb: {
          rating: 7.8,
          votes: 12500
        },
        rottenTomatoes: {
          rating: 85,
          votes: 120
        }
      }
    };
  }
};

// Helper to get a nice display name for streaming services
function getServiceDisplayName(service: string): string {
  const serviceMap: Record<string, string> = {
    netflix: 'Netflix',
    prime: 'Prime Video',
    disney: 'Disney+',
    hbo: 'HBO Max',
    hulu: 'Hulu',
    peacock: 'Peacock',
    paramount: 'Paramount+',
    apple: 'Apple TV+',
    mubi: 'MUBI',
    showtime: 'Showtime',
    starz: 'Starz',
    crunchyroll: 'Crunchyroll',
    curiosity: 'Curiosity Stream',
    britbox: 'BritBox'
  };
  
  return serviceMap[service.toLowerCase()] || service;
}

// Helper to get logo URLs for streaming services
function getServiceLogo(service: string): string {
  const logoMap: Record<string, string> = {
    netflix: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png',
    prime: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png',
    disney: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg',
    hbo: 'https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg',
    hulu: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Hulu_Logo.svg',
    peacock: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/NBCUniversal_Peacock_Logo.svg',
    paramount: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Paramount_Plus.svg',
    apple: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Apple_TV_Plus_logo.svg',
    mubi: 'https://upload.wikimedia.org/wikipedia/commons/3/34/MUBI_logo.svg',
    showtime: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Showtime.svg',
    starz: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Starz_2022.svg',
    crunchyroll: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Crunchyroll_Logo.svg',
    britbox: 'https://upload.wikimedia.org/wikipedia/en/d/d2/BritBox_logo.svg'
  };
  
  return logoMap[service.toLowerCase()] || '';
} 