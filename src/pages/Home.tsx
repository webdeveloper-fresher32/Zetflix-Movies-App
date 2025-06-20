import React, { useState, useEffect } from 'react';
import { tmdbApi, Movie, TVShow } from '../api/tmdb';
import Hero from '../components/Hero';
import MediaRow from '../components/MediaRow';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Home: React.FC = () => {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<TVShow[]>([]);
  const [topRatedTVShows, setTopRatedTVShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        trendingMoviesRes,
        popularMoviesRes,
        topRatedMoviesRes,
        upcomingMoviesRes,
        popularTVRes,
        topRatedTVRes
      ] = await Promise.all([
        tmdbApi.getTrendingMovies(),
        tmdbApi.getPopularMovies(),
        tmdbApi.getTopRatedMovies(),
        tmdbApi.getUpcomingMovies(),
        tmdbApi.getPopularTVShows(),
        tmdbApi.getTopRatedTVShows()
      ]);

      setTrendingMovies(trendingMoviesRes.results);
      setPopularMovies(popularMoviesRes.results);
      setTopRatedMovies(topRatedMoviesRes.results);
      setUpcomingMovies(upcomingMoviesRes.results);
      setPopularTVShows(popularTVRes.results);
      setTopRatedTVShows(topRatedTVRes.results);
    } catch (err) {
      console.error('Error fetching home data:', err);
      setError('Failed to load content. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="pt-16">
          <LoadingSpinner size="large" text="Loading ZetFlix..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <div className="pt-16">
          <ErrorMessage
            title="Unable to load content"
            message={error}
            onRetry={fetchData}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      {trendingMovies.length > 0 && (
        <Hero items={trendingMovies.slice(0, 5)} mediaType="movie" />
      )}

      {/* Content Sections */}
      <div className="relative z-10 -mt-32 space-y-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <MediaRow
            title="Trending Movies"
            items={trendingMovies}
            mediaType="movie"
          />
          
          <MediaRow
            title="Popular Movies"
            items={popularMovies}
            mediaType="movie"
          />

          <MediaRow
            title="Popular TV Shows"
            items={popularTVShows}
            mediaType="tv"
          />
          
          <MediaRow
            title="Top Rated Movies"
            items={topRatedMovies}
            mediaType="movie"
          />

          <MediaRow
            title="Top Rated TV Shows"
            items={topRatedTVShows}
            mediaType="tv"
          />
          
          <MediaRow
            title="Upcoming Movies"
            items={upcomingMovies}
            mediaType="movie"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;