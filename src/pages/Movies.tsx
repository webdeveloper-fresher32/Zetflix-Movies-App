import React, { useState, useEffect } from 'react';
import { tmdbApi, Movie, Genre } from '../api/tmdb';
import MediaCard from '../components/MediaCard';
import GenreFilter from '../components/GenreFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchMovies = async (page = 1, genreId: number | null = null, reset = true) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const [moviesRes, genresRes] = await Promise.all([
        genreId 
          ? tmdbApi.discoverMovies({ page, with_genres: genreId })
          : tmdbApi.getPopularMovies(),
        page === 1 ? tmdbApi.getMovieGenres() : Promise.resolve({ genres: [] })
      ]);

      if (reset) {
        setMovies(moviesRes.results);
      } else {
        setMovies(prev => [...prev, ...moviesRes.results]);
      }

      if (page === 1 && genresRes.genres.length > 0) {
        setGenres(genresRes.genres);
      }

      setCurrentPage(page);
      setTotalPages(moviesRes.total_pages);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to load movies. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchMovies(1, selectedGenre, true);
  }, [selectedGenre]);

  const handleGenreSelect = (genreId: number | null) => {
    setSelectedGenre(genreId);
    setCurrentPage(1);
  };

  const loadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      fetchMovies(currentPage + 1, selectedGenre, false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-16">
        <LoadingSpinner size="large" text="Loading movies..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black pt-16">
        <ErrorMessage
          title="Failed to load movies"
          message={error}
          onRetry={() => fetchMovies(1, selectedGenre, true)}
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
            {selectedGenreName ? `${selectedGenreName} Movies` : 'Popular Movies'}
          </h1>
          <p className="text-gray-400">
            Discover the {selectedGenreName ? selectedGenreName.toLowerCase() : 'most popular'} movies
          </p>
        </div>

        {/* Genre Filter */}
        <GenreFilter
          genres={genres}
          selectedGenre={selectedGenre}
          onGenreSelect={handleGenreSelect}
        />

        {/* Movies Grid */}
        {movies.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-8">
              {movies.map((movie) => (
                <MediaCard
                  key={movie.id}
                  item={movie}
                  mediaType="movie"
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
                    'Load More Movies'
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {movies.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-white mb-2">No movies found</h3>
            <p className="text-gray-400">
              Try selecting a different genre or check back later
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;