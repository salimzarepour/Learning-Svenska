
export interface SentencePair {
  id: string;
  swedish: string;
  persian: string;
  topic: string;
}

export interface RelatedWord {
  id: string;
  swedish: string;
  persian: string;
  topic: string;
}

export interface TopicResult {
  sentences: SentencePair[];
  relatedWords: RelatedWord[];
}

export interface TopicData {
  [topic: string]: SentencePair[]; // Predefined topics only have sentences
}

export interface HistoryItem {
  id: string;
  term: string;
  timestamp: number;
}

export enum View {
  Search = 'SEARCH',
  Favorites = 'FAVORITES',
  History = 'HISTORY',
}