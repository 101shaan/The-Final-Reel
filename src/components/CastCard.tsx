import React from 'react';
import { User } from 'lucide-react';
import { Cast, Crew, getImageUrl } from '../lib/tmdb';
import { useNavigate } from 'react-router-dom';

interface CastCardProps {
  person: Cast | Crew;
  role: string; // Character name for cast, job title for crew
  index?: number;
}

export const CastCard: React.FC<CastCardProps> = ({ person, role, index = 0 }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/person/${person.id}`);
  };
  
  return (
    <div 
      className="flex flex-col items-center text-center group cursor-pointer"
      onClick={handleClick}
      style={{ 
        animationDelay: `${index * 100}ms`,
        animation: 'fadeIn 0.5s ease-in-out forwards'
      }}
    >
      <div className="w-24 h-24 md:w-32 md:h-32 mb-3 rounded-full overflow-hidden border-2 border-purple-500/30 group-hover:border-purple-500 transition-all duration-300">
        {person.profile_path ? (
          <img 
            src={getImageUrl(person.profile_path, 'w185')} 
            alt={person.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <User className="w-12 h-12 text-gray-600" />
          </div>
        )}
      </div>
      <h4 className="font-medium text-white text-sm group-hover:text-purple-400 transition-colors">{person.name}</h4>
      <p className="text-gray-400 text-xs mt-1">{role}</p>
    </div>
  );
};

export default CastCard; 