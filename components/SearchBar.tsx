
import React, { useState } from 'react';
import SearchIcon from './icons/SearchIcon';

interface SearchBarProps {
  onSearch: (topic: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSearch(topic.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 bg-white shadow-md">
      <div className="relative flex-grow">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic (e.g., mat, väder)"
          className="w-full p-3 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
          disabled={isLoading}
        />
        <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
      </div>
      <button
        type="submit"
        className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition-colors disabled:bg-slate-400"
        disabled={isLoading}
      >
        {isLoading ? 'Söker...' : 'Sök'}
      </button>
    </form>
  );
};

export default SearchBar;
