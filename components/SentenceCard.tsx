
import React from 'react';
import { SentencePair } from '../types';
import PlayIcon from './icons/PlayIcon';
import HeartIcon from './icons/HeartIcon';

interface SentenceCardProps {
  sentence: SentencePair;
  onToggleFavorite: (sentence: SentencePair) => void;
  onPlayAudio: (text: string) => void;
  isFavorite: boolean;
}

const SentenceCard: React.FC<SentenceCardProps> = ({ sentence, onToggleFavorite, onPlayAudio, isFavorite }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 transition-all hover:shadow-lg">
      <div className="mb-3">
        <p className="text-lg font-semibold text-slate-800">{sentence.swedish}</p>
        <p className="text-md text-slate-600 font-persian" dir="rtl">{sentence.persian}</p>
      </div>
      <div className="flex items-center justify-end space-x-3">
        <button
          onClick={() => onPlayAudio(sentence.swedish)}
          aria-label="Play Swedish pronunciation"
          className="p-2 text-sky-600 hover:text-sky-800 rounded-full hover:bg-sky-100 transition-colors"
        >
          <PlayIcon className="w-6 h-6" />
        </button>
        <button
          onClick={() => onToggleFavorite(sentence)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className={`p-2 rounded-full hover:bg-red-100 transition-colors ${isFavorite ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
        >
          <HeartIcon className="w-6 h-6" isFilled={isFavorite} />
        </button>
      </div>
    </div>
  );
};

export default SentenceCard;
