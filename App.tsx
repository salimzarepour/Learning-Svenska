
import React, { useState, useEffect, useCallback } from 'react';
import { SentencePair, RelatedWord, HistoryItem, View, TopicResult } from './types';
import { PREDEFINED_TOPICS, APP_NAME } from './constants';
import * as storageService from './services/storageService';
import * as geminiService from './services/geminiService';

import SearchBar from './components/SearchBar';
import ResultsList from './components/ResultsList';
import FavoritesView from './components/FavoritesView';
import HistoryView from './components/HistoryView';

import SearchIcon from './components/icons/SearchIcon';
import HeartIcon from './components/icons/HeartIcon';
import HistoryIcon from './components/icons/HistoryIcon';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Search);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SentencePair[]>([]);
  const [relatedWords, setRelatedWords] = useState<RelatedWord[]>([]);
  const [favorites, setFavorites] = useState<SentencePair[]>([]);
  const [searchHistory, setSearchHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [swedishVoices, setSwedishVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    setFavorites(storageService.getFavorites());
    setSearchHistory(storageService.getSearchHistory());

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const svVoices = voices.filter(voice => voice.lang === 'sv-SE' || voice.lang.startsWith('sv-'));
      setSwedishVoices(svVoices);
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speakSwedish = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (swedishVoices.length > 0) {
        utterance.voice = swedishVoices[0];
      } else {
        utterance.lang = 'sv-SE';
      }
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Ledsen, din webbläsare stöder inte text-till-tal.');
    }
  }, [swedishVoices]);

  const handleSearch = async (topic: string) => {
    setCurrentView(View.Search);
    setSearchTerm(topic);
    setIsLoading(true);
    setError(null);
    setSearchResults([]);
    setRelatedWords([]);

    const updatedHistory = storageService.addSearchToHistory(topic);
    setSearchHistory(updatedHistory);

    const lowerCaseTopic = topic.toLowerCase();
    if (PREDEFINED_TOPICS[lowerCaseTopic]) {
      setSearchResults(PREDEFINED_TOPICS[lowerCaseTopic]);
      setRelatedWords([]); // No predefined related words
      setIsLoading(false);
    } else {
      try {
        const result: TopicResult = await geminiService.generateSentencesAndWordsForTopic(topic);
        setSearchResults(result.sentences);
        setRelatedWords(result.relatedWords || []);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ett okänt fel inträffade.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleToggleFavorite = (sentence: SentencePair) => {
    if (favorites.some(fav => fav.id === sentence.id)) {
      const updatedFavorites = storageService.removeFavorite(sentence.id);
      setFavorites(updatedFavorites);
    } else {
      const updatedFavorites = storageService.addFavorite(sentence);
      setFavorites(updatedFavorites);
    }
  };

  const handleClearHistory = () => {
    const updatedHistory = storageService.clearSearchHistory();
    setSearchHistory(updatedHistory);
  };
  
  const handleSearchFromHistory = (term: string) => {
    handleSearch(term);
  };

  const renderView = () => {
    switch (currentView) {
      case View.Search:
        return (
          <>
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            <div className="p-4 flex-grow overflow-y-auto">
              <ResultsList
                sentences={searchResults}
                relatedWords={relatedWords}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onPlayAudio={speakSwedish}
                isLoading={isLoading}
                error={error}
                currentSearchTerm={searchTerm}
              />
            </div>
          </>
        );
      case View.Favorites:
        return (
          <div className="p-4 flex-grow overflow-y-auto">
            <FavoritesView
              favoriteSentences={favorites}
              onToggleFavorite={handleToggleFavorite}
              onPlayAudio={speakSwedish}
            />
          </div>
        );
      case View.History:
        return (
          <div className="flex-grow overflow-y-auto h-full">
            <HistoryView
              historyItems={searchHistory}
              onSearchHistoryItem={handleSearchFromHistory}
              onClearHistory={handleClearHistory}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const getHeaderTitle = () => {
    switch (currentView) {
      case View.Search:
        return searchTerm ? `Resultat för "${searchTerm}"` : APP_NAME;
      case View.Favorites:
        return "Mina Favoriter";
      case View.History:
        return "Sökhistorik";
      default:
        return APP_NAME;
    }
  };

  return (
    <div className="h-screen flex flex-col max-w-lg mx-auto bg-slate-50 shadow-xl">
      <header className="bg-sky-700 text-white p-4 text-center shadow-md sticky top-0 z-20">
        <h1 className="text-xl font-semibold">{getHeaderTitle()}</h1>
      </header>

      <main className="flex-grow flex flex-col overflow-hidden">
        {renderView()}
      </main>

      <nav className="bg-white border-t border-slate-200 p-2 flex justify-around items-center shadow-top sticky bottom-0 z-20">
        {[
          { view: View.Search, label: "Sök", Icon: SearchIcon },
          { view: View.Favorites, label: "Favoriter", Icon: HeartIcon },
          { view: View.History, label: "Historik", Icon: HistoryIcon },
        ].map(({ view, label, Icon }) => (
          <button
            key={view}
            onClick={() => setCurrentView(view)}
            className={`flex flex-col items-center justify-center p-2 rounded-md w-1/3 transition-colors ${
              currentView === view ? 'text-sky-600 bg-sky-50' : 'text-slate-500 hover:bg-slate-100'
            }`}
            aria-label={`Gå till ${label}`}
          >
            <Icon className={`w-6 h-6 mb-0.5 ${currentView === view && view === View.Favorites ? 'fill-sky-600': ''}`} />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;