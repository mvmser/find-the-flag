// Type definitions for the Find the Flag game

import { Country } from '../data/countries';

export type { Country };

export interface GameQuestion {
  correct: Country;
  options: Country[];
}

export interface GameState {
  score: number;
  total: number;
  previousCorrectCode?: string;
}

export type Language = 'en' | 'fr';
