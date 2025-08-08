
import React, { useState } from 'react';
import { HistoryItem } from '../types';
import ChevronRightIcon from './icons/ChevronRightIcon';
import TrashIcon from './icons/TrashIcon';
import HistoryIcon from './icons/HistoryIcon'; // Main icon for empty state
import SearchIcon from './icons/SearchIcon'; // For the search input

interface HistoryViewProps {
  historyItems: HistoryItem[];
  onSearchHistoryItem: (term: string) => void;
  onClearHistory: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ historyItems, onSearchHistoryItem, onClearHistory }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = historyItems.filter(item =>
    item.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (historyItems.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500">
        <HistoryIcon className="w-16 h-16 mx-auto mb-4 text-slate-300" />
        <h3 className="text-xl font-semibold mb-2">Ingen sökhistorik</h3>
        <p>Din sökhistorik kommer att visas här.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 bg-white sticky top-0 z-10 shadow-sm">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Sök i historik..."
            className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
      </div>
      
      {filteredHistory.length === 0 && searchTerm && (
        <p className="text-center text-slate-500 p-4">Inga historikobjekt matchade din sökning.</p>
      )}

      <ul className="divide-y divide-slate-200 flex-grow overflow-y-auto">
        {filteredHistory.map((item) => (
          <li key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
            <button
              onClick={() => onSearchHistoryItem(item.term)}
              className="w-full flex justify-between items-center text-left"
            >
              <span className="text-slate-700">{item.term}</span>
              <ChevronRightIcon className="text-slate-400 w-5 h-5" />
            </button>
          </li>
        ))}
      </ul>
      <div className="p-4 mt-auto border-t border-slate-200 bg-white">
        <button
          onClick={onClearHistory}
          className="w-full flex items-center justify-center px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
        >
          <TrashIcon className="w-5 h-5 mr-2" />
          Rensa historik
        </button>
      </div>
    </div>
  );
};

export default HistoryView;
