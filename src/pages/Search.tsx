import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Film, Tv, ArrowLeft } from 'lucide-react';
import { tmdbApi, Movie, TVShow } from '../api/tmdb';
import MediaCard from '../components/MediaCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

type SearchResult = (Movie | TVShow) & { media_type?: string };

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchType, setSearchType] = useState<'multi' | 'movie' | 'tv'>('multi');

  const searchContent = useCallback(async (searchQuery: string, page = 1, reset = true) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let response;
      switch (searchType) {
        case 'movie':
          response = await tmdbApi.searchMovies(searchQuery, page);
          break;
        case 'tv':
          response = await tmdbApi.searchTVShows(searchQuery, page);
          break;
        default:
          response = await tmdbApi.searchMulti(searchQuery, page);
      }

      const newResults = response.results.filter((item: any) => 
        item.media_type !== 'person' && (item.poster_path || item.backdrop_path)
      );

      if (reset) {
        setResults(newResults);
      } else {
        setResults(prev => [...prev, ...newResults]);
      }

      setTotalPages(response.total_pages);
      setCurrentPage(page);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchType]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      searchContent(query.trim(), 1, true);
    }
  };

  const loadMore = () => {
    if (currentPage < totalPages && !loading) {
      searchContent(query, currentPage + 1, false);
    }
  };

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      searchContent(q, 1, true);
    }
  }, [searchParams, searchContent]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim() && query !== searchParams.get('q')) {
        setSearchParams({ q: query.trim() });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, setSearchParams, searchParams]);

  const getMediaType = (item: SearchResult): 'movie' | 'tv' => {
    if (item.media_type === 'movie' || 'title' in item) return 'movie';
    if (item.media_type === 'tv' || 'name' in item) return 'tv';
    return 'movie';
  };

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <h1 className="text-3xl font-bold text-white mb-6">Search</h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for movies, TV shows..."
                  className="w-full bg-gray-800 text-white placeholder-gray-400 pl-12 pr-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
              
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Search Type Filter */}
          <div className="flex space-x-2">
            <button
              onClick={() => setSearchType('multi')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                searchType === 'multi'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span>All</span>
            </button>
            <button
              onClick={() => setSearchType('movie')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                searchType === 'movie'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Movies</span>
            </button>
            <button
              onClick={() => setSearchType('tv')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                searchType === 'tv'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>TV Shows</span>
            </button>
          </div>
        </div>

        {/* Results */}
        {loading && results.length === 0 && (
          <LoadingSpinner size="large" text="Searching..." />
        )}

        {error && (
          <ErrorMessage
            title="Search failed"
            message={error}
            onRetry={() => searchContent(query, 1, true)}
          />
        )}

        {!loading && !error && query && results.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-800 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SearchIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
            <p className="text-gray-400">
              Try adjusting your search terms or browse our popular content
            </p>
          </div>
        )}

        {results.length > 0 && (
          <>
            <div className="mb-6">
              <p className="text-gray-400">
                {results.length} results for "{query}"
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-8">
              {results.map((item) => (
                <MediaCard
                  key={`${getMediaType(item)}-${item.id}`}
                  item={item}
                  mediaType={getMediaType(item)}
                  size="medium"
                  showOverview
                />
              ))}
            </div>

            {/* Load More */}
            {currentPage < totalPages && (
              <div className="text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}

        {!query && !loading && (
          <div className="text-center py-12">
            <div className="bg-gray-800 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SearchIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Start searching</h3>
            <p className="text-gray-400">
              Discover millions of movies and TV shows
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;