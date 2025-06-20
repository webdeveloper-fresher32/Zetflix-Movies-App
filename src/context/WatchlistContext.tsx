import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Movie, TVShow } from '../api/tmdb';

export type WatchlistItem = (Movie | TVShow) & {
  media_type: 'movie' | 'tv';
  added_date: string;
};

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  addToWatchlist: (item: Movie | TVShow, mediaType: 'movie' | 'tv') => void;
  removeFromWatchlist: (id: number, mediaType: 'movie' | 'tv') => void;
  isInWatchlist: (id: number, mediaType: 'movie' | 'tv') => boolean;
  clearWatchlist: () => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const useWatchlist = (): WatchlistContextType => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};

interface WatchlistProviderProps {
  children: ReactNode;
}

export const WatchlistProvider: React.FC<WatchlistProviderProps> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('zetflix-watchlist');
    if (savedWatchlist) {
      try {
        setWatchlist(JSON.parse(savedWatchlist));
      } catch (error) {
        console.error('Error loading watchlist from localStorage:', error);
      }
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('zetflix-watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (item: Movie | TVShow, mediaType: 'movie' | 'tv') => {
    const watchlistItem: WatchlistItem = {
      ...item,
      media_type: mediaType,
      added_date: new Date().toISOString(),
    };

    setWatchlist(prev => {
      const exists = prev.some(w => w.id === item.id && w.media_type === mediaType);
      if (exists) return prev;
      return [watchlistItem, ...prev];
    });
  };

  const removeFromWatchlist = (id: number, mediaType: 'movie' | 'tv') => {
    setWatchlist(prev => prev.filter(item => !(item.id === id && item.media_type === mediaType)));
  };

  const isInWatchlist = (id: number, mediaType: 'movie' | 'tv'): boolean => {
    return watchlist.some(item => item.id === id && item.media_type === mediaType);
  };

  const clearWatchlist = () => {
    setWatchlist([]);
  };

  const value: WatchlistContextType = {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    clearWatchlist,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};