import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Plus, Check } from 'lucide-react';
import { Movie, TVShow, tmdbApi } from '../api/tmdb';
import { useWatchlist } from '../context/WatchlistContext';

interface HeroProps {
  items: (Movie | TVShow)[];
  mediaType: 'movie' | 'tv';
}

const Hero: React.FC<HeroProps> = ({ items, mediaType }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  const currentItem = items[currentIndex];

  useEffect(() => {
    if (items.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [items.length]);

  if (!currentItem) {
    return (
      <div className="relative h-screen bg-gray-900 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
      </div>
    );
  }

  const title = mediaType === 'movie' ? (currentItem as Movie).title : (currentItem as TVShow).name;
  const releaseDate = mediaType === 'movie' ? (currentItem as Movie).release_date : (currentItem as TVShow).first_air_date;
  const inWatchlist = isInWatchlist(currentItem.id, mediaType);

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(currentItem.id, mediaType);
    } else {
      addToWatchlist(currentItem, mediaType);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{
          backgroundImage: `url(${tmdbApi.getBackdropUrl(currentItem.backdrop_path, 'original')})`
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-6">
          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            {title}
          </h1>

          {/* Metadata */}
          <div className="flex items-center space-x-4 text-sm md:text-base">
            {releaseDate && (
              <span className="text-gray-300">
                {new Date(releaseDate).getFullYear()}
              </span>
            )}
            {currentItem.vote_average > 0 && (
              <>
                <span className="text-gray-400">•</span>
                <div className="flex items-center space-x-1 text-yellow-400">
                  <span>★</span>
                  <span>{currentItem.vote_average.toFixed(1)}</span>
                </div>
              </>
            )}
            <span className="text-gray-400">•</span>
            <span className="bg-red-600 text-white px-2 py-1 rounded text-xs uppercase font-bold">
              {mediaType}
            </span>
          </div>

          {/* Overview */}
          {currentItem.overview && (
            <p className="text-gray-300 text-lg leading-relaxed max-w-xl line-clamp-3">
              {currentItem.overview}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to={`/${mediaType}/${currentItem.id}`}
              className="flex items-center justify-center space-x-2 bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Play</span>
            </Link>

            <Link
              to={`/${mediaType}/${currentItem.id}`}
              className="flex items-center justify-center space-x-2 bg-gray-800/80 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700/80 transition-colors backdrop-blur-sm"
            >
              <Info className="w-5 h-5" />
              <span>More Info</span>
            </Link>

            <button
              onClick={handleWatchlistToggle}
              className={`flex items-center justify-center space-x-2 px-8 py-3 rounded-lg font-semibold transition-colors backdrop-blur-sm ${
                inWatchlist
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-800/80 text-white hover:bg-gray-700/80'
              }`}
            >
              {inWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              <span>{inWatchlist ? 'In My List' : 'Add to List'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {items.slice(0, 5).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;