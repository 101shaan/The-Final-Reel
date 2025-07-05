import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Tv, AlertCircle } from 'lucide-react';
import { streamingService, StreamingResponse } from '../lib/streaming';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface StreamingAvailabilityProps {
  movieId: number;
  imdbId?: string;
  movieTitle?: string;
}

export const StreamingAvailability: React.FC<StreamingAvailabilityProps> = ({ 
  movieId, 
  imdbId,
  movieTitle = 'F1 The Movie' // Default title for search fallback
}) => {
  const [useMockData, setUseMockData] = useState(false);
  
  const { data: streamingData, isLoading, error } = useQuery({
    queryKey: ['streaming', movieId],
    queryFn: () => streamingService.getStreamingInfo('movie', movieId),
    enabled: !!movieId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Use mock data if API returns empty or fails
  useEffect(() => {
    if (!isLoading && (!streamingData || Object.keys(streamingData).length === 0)) {
      console.log('Using mock data for streaming availability');
      setUseMockData(true);
    }
  }, [streamingData, isLoading]);

  const effectiveData = useMockData ? streamingService.getMockStreamingData() : streamingData;
  const streamingServices = streamingService.getStreamingServices(effectiveData);
  const ratings = streamingService.getRatings(effectiveData);

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 text-red-400 py-2">
        <AlertCircle className="w-5 h-5" />
        <span>Error loading streaming data. Please try again later.</span>
      </div>
    );
  }

  if (!streamingServices.length) {
    return (
      <div className="text-gray-400 text-sm py-2">
        No streaming information available for this title.
      </div>
    );
  }

  return (
    <div>
      {useMockData && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4">
          <p className="text-yellow-400 text-sm">
            <span className="font-medium">Note:</span> Using sample data for demonstration. Actual streaming data not available for this title.
          </p>
        </div>
      )}
      
      {/* Streaming Services */}
      <div className="space-y-4">
        {streamingServices.map((countryInfo, idx) => (
          <div key={idx} className="space-y-2">
            <h4 className="text-sm font-medium text-gray-300 uppercase">
              Available in {countryInfo.country}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {countryInfo.services.map((service, serviceIdx) => (
                <a
                  key={serviceIdx}
                  href={service.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors group"
                >
                  {service.logo ? (
                    <img
                      src={service.logo}
                      alt={service.name}
                      className="w-6 h-6 object-contain"
                    />
                  ) : (
                    <Tv className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-200">{service.name}</span>
                  <ExternalLink className="w-3 h-3 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component for displaying IMDb and Rotten Tomatoes ratings
export const ExternalRatings: React.FC<{ 
  imdbId?: string;
  imdbRating?: number;
  imdbVotes?: number;
  rtRating?: number;
  rtVotes?: number;
}> = ({ 
  imdbId, 
  imdbRating, 
  imdbVotes,
  rtRating,
  rtVotes
}) => {
  return (
    <div className="flex items-center space-x-4">
      {/* IMDb Rating */}
      {imdbRating && imdbId && (
        <a
          href={`https://www.imdb.com/title/${imdbId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-3 py-1.5 bg-[#F5C518]/10 hover:bg-[#F5C518]/20 rounded-lg transition-colors group"
        >
          <div className="flex items-center justify-center w-8 h-5 bg-[#F5C518] rounded text-black font-bold text-xs">
            IMDb
          </div>
          <div className="flex items-center">
            <span className="text-[#F5C518] font-medium">{imdbRating.toFixed(1)}</span>
            {imdbVotes && (
              <span className="text-gray-400 text-xs ml-1">
                ({(imdbVotes > 1000 ? `${(imdbVotes / 1000).toFixed(1)}k` : imdbVotes)})
              </span>
            )}
          </div>
          <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      )}

      {/* Rotten Tomatoes Rating */}
      {rtRating && (
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#FA320A]/10 rounded-lg">
          <div className="flex items-center justify-center w-5 h-5">
            <img 
              src="https://www.rottentomatoes.com/assets/pizza-pie/images/icons/tomatometer/tomatometer-fresh.149b5e8adc3.svg" 
              alt="Rotten Tomatoes" 
              className="w-5 h-5"
            />
          </div>
          <div className="flex items-center">
            <span className="text-[#FA320A] font-medium">{rtRating}%</span>
            {rtVotes && (
              <span className="text-gray-400 text-xs ml-1">
                ({(rtVotes > 1000 ? `${(rtVotes / 1000).toFixed(1)}k` : rtVotes)})
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Compact version of the ratings component to fit in the genre tags area
export const CompactExternalRatings: React.FC<{ 
  imdbId?: string;
  imdbRating?: number;
  rtRating?: number;
}> = ({ 
  imdbId, 
  imdbRating,
  rtRating
}) => {
  return (
    <>
      {/* IMDb Rating */}
      {imdbRating && imdbId && (
        <a
          href={`https://www.imdb.com/title/${imdbId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm flex items-center space-x-1 hover:bg-white/20 transition-colors"
        >
          <div className="flex items-center justify-center w-7 h-4 bg-[#F5C518] rounded-sm text-black font-bold text-[10px]">
            IMDb
          </div>
          <span className="text-[#F5C518] font-medium text-sm">{imdbRating.toFixed(1)}</span>
        </a>
      )}

      {/* Rotten Tomatoes Rating */}
      {rtRating && (
        <a
          href={`https://www.rottentomatoes.com/search?search=${encodeURIComponent("F1 The Movie")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm flex items-center space-x-1 hover:bg-white/20 transition-colors"
        >
          <img 
            src="https://www.rottentomatoes.com/assets/pizza-pie/images/icons/tomatometer/tomatometer-fresh.149b5e8adc3.svg" 
            alt="RT" 
            className="w-4 h-4"
          />
          <span className="text-[#FA320A] font-medium text-sm">{rtRating}%</span>
        </a>
      )}
    </>
  );
}; 