import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie, TVShow } from '../api/tmdb';
import MediaCard from './MediaCard';

interface MediaRowProps {
  title: string;
  items: (Movie | TVShow)[];
  mediaType: 'movie' | 'tv';
  loading?: boolean;
}

const MediaRow: React.FC<MediaRowProps> = ({ title, items, mediaType, loading = false }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="mb-8">
        <div className="mb-4">
          <div className="h-6 bg-gray-800 rounded w-48 animate-pulse"></div>
        </div>
        <div className="flex space-x-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex-shrink-0 w-48">
              <div className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"></div>
              <div className="mt-2 space-y-2">
                <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-800 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 group">
      {/* Section Title */}
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 px-4 md:px-0">
        {title}
      </h2>
      
      {/* Scrollable Container */}
      <div className="relative">
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 hover:translate-x-0"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 hover:translate-x-0"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Items Container */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4 px-4 md:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <MediaCard
              key={`${mediaType}-${item.id}`}
              item={item}
              mediaType={mediaType}
              size="medium"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaRow;