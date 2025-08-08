
import React from 'react';
import { SentencePair } from '../types';
import SentenceCard from './SentenceCard';
import HeartIcon from './icons/HeartIcon';

interface FavoritesViewProps {
  favoriteSentences: SentencePair[];
  onToggleFavorite: (sentence: SentencePair) => void;
  onPlayAudio: (text: string) => void;
}

const FavoritesView: React.FC<FavoritesViewProps> = ({ favoriteSentences, onToggleFavorite, onPlayAudio }) => {
  if (favoriteSentences.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500">
        <HeartIcon className="w-16 h-16 mx-auto mb-4 text-slate-300" />
        <h3 className="text-xl font-semibold mb-2">Inga favoriter än</h3>
        <p>Tryck på hjärtikonen på en mening för att spara den här.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {favoriteSentences.map((sentence) => (
        <SentenceCard
          key={sentence.id}
          sentence={sentence}
          onToggleFavorite={onToggleFavorite}
          onPlayAudio={onPlayAudio}
          isFavorite={true} // It's in favorites list, so it's a favorite
        />
      ))}
    </div>
  );
};

export default FavoritesView;
