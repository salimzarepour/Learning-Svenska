
import { SentencePair, HistoryItem } from '../types';

const FAVORITES_KEY = 'swedishAppFavorites';
const HISTORY_KEY = 'swedishAppHistory';

export const getFavorites = (): SentencePair[] => {
  const storedFavorites = localStorage.getItem(FAVORITES_KEY);
  return storedFavorites ? JSON.parse(storedFavorites) : [];
};

export const addFavorite = (sentence: SentencePair): SentencePair[] => {
  const favorites = getFavorites();
  if (!favorites.find(fav => fav.id === sentence.id)) {
    const updatedFavorites = [...favorites, sentence];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return updatedFavorites;
  }
  return favorites;
};

export const removeFavorite = (sentenceId: string): SentencePair[] => {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter(fav => fav.id !== sentenceId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  return updatedFavorites;
};

export const isFavorite = (sentenceId: string): boolean => {
  const favorites = getFavorites();
  return favorites.some(fav => fav.id === sentenceId);
};

export const getSearchHistory = (): HistoryItem[] => {
  const storedHistory = localStorage.getItem(HISTORY_KEY);
  return storedHistory ? JSON.parse(storedHistory) : [];
};

export const addSearchToHistory = (term: string): HistoryItem[] => {
  if (!term.trim()) return getSearchHistory();
  let history = getSearchHistory();
  // Remove existing entry for the same term to move it to the top
  history = history.filter(item => item.term.toLowerCase() !== term.toLowerCase());
  const newItem: HistoryItem = { id: crypto.randomUUID(), term, timestamp: Date.now() };
  const updatedHistory = [newItem, ...history].slice(0, 50); // Keep last 50 searches
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  return updatedHistory;
};

export const clearSearchHistory = (): HistoryItem[] => {
  localStorage.removeItem(HISTORY_KEY);
  return [];
};
