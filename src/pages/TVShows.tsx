import React, { useState, useEffect } from 'react';
import { tmdbApi, TVShow, Genre } from '../api/tmdb';
import MediaCard from '../components/MediaCard';
import GenreFilter from '../components/GenreFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const TVShows: React.FC = () => {
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchTVShows = async (page = 1, genreId: number | null = null, reset = true) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const [tvShowsRes, genresRes] = await Promise.all([
        tmdbApi.getPopularTVShows(), // Note: TMDB doesn't have discover for TV with genres in the basic API
        page === 1 ? tmdbApi.getTVGenres() : Promise.resolve({ genres: [] })
      ]);

      // Filter by genre client-side if selected
      let filteredResults = tvShowsRes.results;
      if (genreId) {
        filteredResults = tvShowsRes.results.filter(show => 
          show.genre_ids.includes(genreId)
        );
      }

      if (reset) {
        setTVShows(filteredResults);
      } else {
        setTVShows(prev => [...prev, ...filteredResults]);
      }

      if (page === 1 && genresRes.genres.length > 0) {
        setGenres(genresRes.genres);
      }

      setCurrentPage(page);
      setTotalPages(tvShowsRes.total_pages);
    } catch (err) {
      console.error('Error fetching TV shows:', err);
      setError('Failed to load TV shows. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchTVShows(1, selectedGenre, true);
  }, [selectedGenre]);

  const handleGenreSelect = (genreId: number | null) => {
    setSelectedGenre(genreId);
    setCurrentPage(1);
  };

  const loadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      fetchTVShows(currentPage + 1, selectedGenre, false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-16">
        <LoadingSpinner size="large" text="Loading TV shows..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black pt-16">
        <ErrorMessage
          title="Failed to load TV shows"
          message={error}
          onRetry={() => fetchTVShows(1, selectedGenre, true)}
        />
      </div>
    );
  }

  const selectedGenreName = selectedGenre 
    ? genres.find(g => g.id === selectedGenre)?.name 
    : null;

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {selectedGenreName ? `${selectedGenreName} TV Shows` : 'Popular TV Shows'}
          </h1>
          <p className="text-gray-400">
            Discover the {selectedGenreName ? selectedGenreName.toLowerCase() : 'most popular'} TV shows
          </p>
        </div>

        {/* Genre Filter */}
        <GenreFilter
          genres={genres}
          selectedGenre={selectedGenre}
          onGenreSelect={handleGenreSelect}
        />

        {/* TV Shows Grid */}
        {tvShows.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 mb-8">
              {tvShows.map((show) => (
                <MediaCard
                  key={show.id}
                  item={show}
                  mediaType="tv"
                  size="medium"
                />
              ))}
            </div>

            {/* Load More */}
            {currentPage < totalPages && (
              <div className="text-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    'Load More Shows'
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {tvShows.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-white mb-2">No TV shows found</h3>
            <p className="text-gray-400">
              Try selecting a different genre or check back later
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TVShows;