const API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'YOUR_TMDB_API_KEY'; // Replace with your actual API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number;
  budget: number;
  revenue: number;
  status: string;
  tagline: string;
  homepage: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_name: string;
  popularity: number;
  origin_country: string[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface ApiResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

class TMDBApi {
  private async fetchFromAPI<T>(endpoint: string): Promise<T> {
    if (API_KEY === 'YOUR_TMDB_API_KEY') {
      throw new Error('TMDB API key not configured. Please set VITE_TMDB_API_KEY in your .env file or update the API_KEY constant in src/api/tmdb.ts');
    }

    const headers: HeadersInit = {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, { headers });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // Movie endpoints
  async getTrendingMovies(): Promise<ApiResponse<Movie>> {
    return this.fetchFromAPI('/trending/movie/week');
  }

  async getPopularMovies(): Promise<ApiResponse<Movie>> {
    return this.fetchFromAPI('/movie/popular');
  }

  async getTopRatedMovies(): Promise<ApiResponse<Movie>> {
    return this.fetchFromAPI('/movie/top_rated');
  }

  async getUpcomingMovies(): Promise<ApiResponse<Movie>> {
    return this.fetchFromAPI('/movie/upcoming');
  }

  async getNowPlayingMovies(): Promise<ApiResponse<Movie>> {
    return this.fetchFromAPI('/movie/now_playing');
  }

  async getMovieDetails(id: number): Promise<MovieDetails> {
    return this.fetchFromAPI(`/movie/${id}`);
  }

  async getMovieVideos(id: number): Promise<{ results: Video[] }> {
    return this.fetchFromAPI(`/movie/${id}/videos`);
  }

  async getMovieCredits(id: number): Promise<{ cast: Cast[] }> {
    return this.fetchFromAPI(`/movie/${id}/credits`);
  }

  async getSimilarMovies(id: number): Promise<ApiResponse<Movie>> {
    return this.fetchFromAPI(`/movie/${id}/similar`);
  }

  // TV endpoints
  async getTrendingTVShows(): Promise<ApiResponse<TVShow>> {
    return this.fetchFromAPI('/trending/tv/week');
  }

  async getPopularTVShows(): Promise<ApiResponse<TVShow>> {
    return this.fetchFromAPI('/tv/popular');
  }

  async getTopRatedTVShows(): Promise<ApiResponse<TVShow>> {
    return this.fetchFromAPI('/tv/top_rated');
  }

  // Search endpoints
  async searchMovies(query: string, page = 1): Promise<ApiResponse<Movie>> {
    return this.fetchFromAPI(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
  }

  async searchTVShows(query: string, page = 1): Promise<ApiResponse<TVShow>> {
    return this.fetchFromAPI(`/search/tv?query=${encodeURIComponent(query)}&page=${page}`);
  }

  async searchMulti(query: string, page = 1): Promise<ApiResponse<Movie | TVShow>> {
    return this.fetchFromAPI(`/search/multi?query=${encodeURIComponent(query)}&page=${page}`);
  }

  // Genre endpoints
  async getMovieGenres(): Promise<{ genres: Genre[] }> {
    return this.fetchFromAPI('/genre/movie/list');
  }

  async getTVGenres(): Promise<{ genres: Genre[] }> {
    return this.fetchFromAPI('/genre/tv/list');
  }

  async discoverMovies(params: Record<string, string | number> = {}): Promise<ApiResponse<Movie>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, value.toString());
    });
    return this.fetchFromAPI(`/discover/movie?${queryParams.toString()}`);
  }

  // Helper methods for image URLs
  getPosterUrl(path: string | null, size: 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
    if (!path) return '/placeholder-poster.jpg';
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }

  getBackdropUrl(path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string {
    if (!path) return '/placeholder-backdrop.jpg';
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }

  getProfileUrl(path: string | null, size: 'w45' | 'w185' | 'h632' | 'original' = 'w185'): string {
    if (!path) return '/placeholder-profile.jpg';
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }
}

export const tmdbApi = new TMDBApi();