
import React from 'react';
import { SentencePair, RelatedWord } from '../types';
import SentenceCard from './SentenceCard';
import SearchIcon from './icons/SearchIcon';
import { APP_NAME } from '../constants'; // For a potential title if needed

interface ResultsListProps {
  sentences: SentencePair[];
  relatedWords: RelatedWord[];
  favorites: SentencePair[];
  onToggleFavorite: (sentence: SentencePair) => void;
  onPlayAudio: (text: string) => void;
  isLoading: boolean;
  error: string | null;
  currentSearchTerm: string | null;
}

const ResultsList: React.FC<ResultsListProps> = ({
  sentences,
  relatedWords,
  favorites,
  onToggleFavorite,
  onPlayAudio,
  isLoading,
  error,
  currentSearchTerm
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center p-10 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600"></div>
        <p className="text-slate-600">Letar efter meningar och ord...</p>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg shadow">{error}</div>;
  }

  if (!currentSearchTerm) {
    return (
        <div className="p-6 text-center text-slate-500">
            <SearchIcon className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-xl font-semibold mb-2">Börja lära dig!</h3>
            <p>Skriv ett ämne ovan för att hitta svenska meningar och relaterade ord.</p>
            <p className="mt-2 text-sm">Exempel: "mat", "resor", "familj".</p>
        </div>
    );
  }
  
  const noResults = sentences.length === 0 && relatedWords.length === 0 && currentSearchTerm;
  if (noResults) {
    return <div className="p-6 text-center text-slate-500">Inga resultat hittades för "{currentSearchTerm}". Försök med ett annat ämne.</div>;
  }

  return (
    <div className="space-y-6">
      {relatedWords.length > 0 && (
        <section aria-labelledby="related-words-heading">
          <h2 id="related-words-heading" className="text-lg font-semibold text-sky-700 mb-3 pb-1 border-b-2 border-sky-200">
            Relaterade Ord
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedWords.map((word) => (
              <div key={word.id} className="bg-white p-3 rounded-md shadow-sm border border-slate-200">
                <p className="text-md font-medium text-slate-800">{word.swedish}</p>
                <p className="text-sm text-slate-600 font-persian" dir="rtl">{word.persian}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {sentences.length > 0 && (
        <section aria-labelledby="example-sentences-heading">
           <h2 id="example-sentences-heading" className={`text-lg font-semibold text-sky-700 mb-3 pb-1 ${relatedWords.length > 0 ? 'mt-6 border-t-2 border-sky-100 pt-4' : 'border-b-2 border-sky-200'}`}>
            Exempelmeningar
          </h2>
          <div className="space-y-4">
            {sentences.map((sentence) => (
              <SentenceCard
                key={sentence.id}
                sentence={sentence}
                onToggleFavorite={onToggleFavorite}
                onPlayAudio={onPlayAudio}
                isFavorite={favorites.some(fav => fav.id === sentence.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ResultsList;