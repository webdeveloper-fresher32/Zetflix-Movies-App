import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, Plus, Check } from 'lucide-react';
import { Movie, TVShow, tmdbApi } from '../api/tmdb';
import { useWatchlist } from '../context/WatchlistContext';

interface MediaCardProps {
  item: Movie | TVShow;
  mediaType: 'movie' | 'tv';
  size?: 'small' | 'medium' | 'large';
  showOverview?: boolean;
}

const MediaCard: React.FC<MediaCardProps> = ({ 
  item, 
  mediaType, 
  size = 'medium', 
  showOverview = false 
}) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(item.id, mediaType);

  const title = mediaType === 'movie' ? (item as Movie).title : (item as TVShow).name;
  const releaseDate = mediaType === 'movie' ? (item as Movie).release_date : (item as TVShow).first_air_date;
  const detailsPath = `/${mediaType}/${item.id}`;

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWatchlist) {
      removeFromWatchlist(item.id, mediaType);
    } else {
      addToWatchlist(item, mediaType);
    }
  };

  const sizeClasses = {
    small: 'w-32 sm:w-40',
    medium: 'w-40 sm:w-48 md:w-52',
    large: 'w-48 sm:w-56 md:w-64'
  };

  const cardClasses = `
    group relative ${sizeClasses[size]} flex-shrink-0 cursor-pointer
    transform transition-all duration-300 hover:scale-105 hover:z-10
  `;

  return (
    <Link to={detailsPath} className={cardClasses}>
      <div className="relative overflow-hidden rounded-lg bg-gray-900 shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
        {/* Poster Image */}
        <div className="aspect-[2/3] relative">
          <img
            src={tmdbApi.getPosterUrl(item.poster_path, 'w500')}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Rating Badge */}
          {item.vote_average > 0 && (
            <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm text-yellow-400 px-2 py-1 rounded-lg text-xs font-bold flex items-center space-x-1">
              <Star className="w-3 h-3 fill-current" />
              <span>{item.vote_average.toFixed(1)}</span>
            </div>
          )}

          {/* Watchlist Button */}
          <button
            onClick={handleWatchlistToggle}
            className={`
              absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-all duration-200
              ${inWatchlist 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-black/60 text-white hover:bg-black/80'
              }
            `}
            title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>

          {/* Hover Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="font-bold text-sm mb-1 line-clamp-2">{title}</h3>
            
            {releaseDate && (
              <div className="flex items-center space-x-1 text-xs text-gray-300 mb-2">
                <Calendar className="w-3 h-3" />
                <span>{new Date(releaseDate).getFullYear()}</span>
              </div>
            )}

            {showOverview && item.overview && (
              <p className="text-xs text-gray-300 line-clamp-3 mb-2">{item.overview}</p>
            )}

            {/* Media Type Badge */}
            <span className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded-full uppercase font-bold">
              {mediaType}
            </span>
          </div>
        </div>
      </div>

      {/* Title below poster (always visible) */}
      <div className="mt-3 px-1">
        <h3 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-red-400 transition-colors">
          {title}
        </h3>
        {releaseDate && (
          <p className="text-gray-400 text-xs mt-1">
            {new Date(releaseDate).getFullYear()}
          </p>
        )}
      </div>
    </Link>
  );
};

export default MediaCard;