import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, Calendar } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import MediaCard from '../components/MediaCard';

const Watchlist: React.FC = () => {
  const { watchlist, clearWatchlist } = useWatchlist();

  const sortedWatchlist = [...watchlist].sort((a, b) => 
    new Date(b.added_date).getTime() - new Date(a.added_date).getTime()
  );

  const movieCount = watchlist.filter(item => item.media_type === 'movie').length;
  const tvCount = watchlist.filter(item => item.media_type === 'tv').length;

  if (watchlist.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="bg-gray-800 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Bookmark className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Your watchlist is empty</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Start adding movies and TV shows to your watchlist to keep track of what you want to watch
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <span>Browse Content</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              My Watchlist
            </h1>
            <div className="flex items-center space-x-4 text-gray-400">
              <span>{watchlist.length} total items</span>
              <span>•</span>
              <span>{movieCount} movies</span>
              <span>•</span>
              <span>{tvCount} TV shows</span>
            </div>
          </div>

          {watchlist.length > 0 && (
            <button
              onClick={clearWatchlist}
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors mt-4 sm:mt-0"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* Watchlist Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {sortedWatchlist.map((item) => (
            <div key={`${item.media_type}-${item.id}`} className="relative">
              <MediaCard
                item={item}
                mediaType={item.media_type}
                size="medium"
              />
              
              {/* Added Date */}
              <div className="mt-2 flex items-center space-x-1 text-xs text-gray-400 px-1">
                <Calendar className="w-3 h-3" />
                <span>Added {new Date(item.added_date).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Browsing */}
        <div className="text-center mt-16 pt-8 border-t border-gray-800">
          <h3 className="text-xl font-semibold text-white mb-4">
            Looking for more content?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/movies"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Movies
            </Link>
            <Link
              to="/tv"
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse TV Shows
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watchlist;