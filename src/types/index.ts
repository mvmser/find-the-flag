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

export type GameMode = 'multiple-choice' | 'free-text';

export interface GameSettings {
  optionCount: 4 | 6 | 8;
  timerEnabled: boolean;
  timerDuration: number;
  gameMode: GameMode;
}

export type Language = 'en' | 'fr';
