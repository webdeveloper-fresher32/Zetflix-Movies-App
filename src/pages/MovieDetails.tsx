import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Play, Star, Calendar, Clock, Plus, Check, ArrowLeft, 
  Users, Globe, DollarSign, Award 
} from 'lucide-react';
import { tmdbApi, MovieDetails as MovieDetailsType, Video, Cast, Movie } from '../api/tmdb';
import { useWatchlist } from '../context/WatchlistContext';
import MediaRow from '../components/MediaRow';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [cast, setCast] = useState<Cast[]>([]);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  const movieId = parseInt(id || '0');
  const inWatchlist = movie ? isInWatchlist(movie.id, 'movie') : false;

  const fetchMovieDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const [movieRes, videosRes, creditsRes, similarRes] = await Promise.all([
        tmdbApi.getMovieDetails(movieId),
        tmdbApi.getMovieVideos(movieId),
        tmdbApi.getMovieCredits(movieId),
        tmdbApi.getSimilarMovies(movieId)
      ]);

      setMovie(movieRes);
      setVideos(videosRes.results.filter(video => video.site === 'YouTube'));
      setCast(creditsRes.cast.slice(0, 10));
      setSimilarMovies(similarRes.results);
    } catch (err) {
      console.error('Error fetching movie details:', err);
      setError('Failed to load movie details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const handleWatchlistToggle = () => {
    if (!movie) return;
    
    if (inWatchlist) {
      removeFromWatchlist(movie.id, 'movie');
    } else {
      addToWatchlist(movie, 'movie');
    }
  };

  const trailer = videos.find(video => 
    video.type === 'Trailer' && video.official
  ) || videos[0];

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-16">
        <LoadingSpinner size="large" text="Loading movie details..." />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black pt-16">
        <ErrorMessage
          title="Movie not found"
          message={error || "The movie you're looking for doesn't exist."}
          onRetry={fetchMovieDetails}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${tmdbApi.getBackdropUrl(movie.backdrop_path, 'original')})`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>

        {/* Back Button */}
        <Link
          to="/"
          className="absolute top-20 left-4 md:left-8 z-20 flex items-center space-x-2 bg-black/50 hover:bg-black/80 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>

        {/* Content */}
        <div className="relative z-10 flex items-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-end space-y-8 lg:space-y-0 lg:space-x-8 w-full">
            {/* Poster */}
            <div className="flex-shrink-0">
              <img
                src={tmdbApi.getPosterUrl(movie.poster_path, 'w780')}
                alt={movie.title}
                className="w-64 md:w-80 rounded-lg shadow-2xl"
              />
            </div>

            {/* Details */}
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="text-xl text-gray-300 italic">
                  "{movie.tagline}"
                </p>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
                <div className="flex items-center space-x-1 text-yellow-400">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-bold">{movie.vote_average.toFixed(1)}</span>
                  <span className="text-gray-400">({movie.vote_count.toLocaleString()} votes)</span>
                </div>
                
                <span className="text-gray-400">•</span>
                
                <div className="flex items-center space-x-1 text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>

                <span className="text-gray-400">•</span>

                <div className="flex items-center space-x-1 text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* Overview */}
              <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
                {movie.overview}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {trailer && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="flex items-center justify-center space-x-2 bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>Watch Trailer</span>
                  </button>
                )}

                <button
                  onClick={handleWatchlistToggle}
                  className={`flex items-center justify-center space-x-2 px-8 py-3 rounded-lg font-semibold transition-colors ${
                    inWatchlist
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-800/80 text-white hover:bg-gray-700/80 backdrop-blur-sm'
                  }`}
                >
                  {inWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  <span>{inWatchlist ? 'In My List' : 'Add to My List'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Cast */}
        {cast.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Users className="w-6 h-6 mr-2" />
              Cast
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {cast.map((actor) => (
                <div key={actor.id} className="text-center">
                  <img
                    src={tmdbApi.getProfileUrl(actor.profile_path)}
                    alt={actor.name}
                    className="w-full aspect-[2/3] object-cover rounded-lg mb-2"
                  />
                  <h3 className="text-white font-medium text-sm">{actor.name}</h3>
                  <p className="text-gray-400 text-xs">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Production Info */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-2 flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              Budget
            </h3>
            <p className="text-gray-400">
              {movie.budget > 0 ? formatMoney(movie.budget) : 'N/A'}
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2 flex items-center">
              <Award className="w-4 h-4 mr-1" />
              Revenue
            </h3>
            <p className="text-gray-400">
              {movie.revenue > 0 ? formatMoney(movie.revenue) : 'N/A'}
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2 flex items-center">
              <Globe className="w-4 h-4 mr-1" />
              Original Language
            </h3>
            <p className="text-gray-400 capitalize">
              {movie.original_language}
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Status</h3>
            <p className="text-gray-400">{movie.status}</p>
          </div>
        </div>

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <MediaRow
            title="Similar Movies"
            items={similarMovies}
            mediaType="movie"
          />
        )}
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="relative w-full max-w-6xl mx-4">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-4xl font-light"
            >
              ×
            </button>
            <div className="relative aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                title={trailer.name}
                className="w-full h-full rounded-lg"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;