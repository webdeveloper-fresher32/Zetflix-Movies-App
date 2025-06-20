import React from 'react';
import { Genre } from '../api/tmdb';

interface GenreFilterProps {
  genres: Genre[];
  selectedGenre: number | null;
  onGenreSelect: (genreId: number | null) => void;
  loading?: boolean;
}

const GenreFilter: React.FC<GenreFilterProps> = ({ 
  genres, 
  selectedGenre, 
  onGenreSelect, 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="flex space-x-3 overflow-x-auto pb-4 px-4 md:px-0">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex-shrink-0 h-10 w-20 bg-gray-800 rounded-full animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex space-x-3 overflow-x-auto pb-4 px-4 md:px-0 scrollbar-hide">
        <button
          onClick={() => onGenreSelect(null)}
          className={`
            flex-shrink-0 px-6 py-2 rounded-full font-medium transition-all duration-200
            ${selectedGenre === null
              ? 'bg-red-600 text-white shadow-lg'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
            }
          `}
        >
          All Genres
        </button>
        
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => onGenreSelect(genre.id)}
            className={`
              flex-shrink-0 px-6 py-2 rounded-full font-medium transition-all duration-200 whitespace-nowrap
              ${selectedGenre === genre.id
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }
            `}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreFilter;