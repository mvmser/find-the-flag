// Type definitions for the Find the Flag game

import { Country, Region } from '../data/countries';

export type { Country, Region };

export interface GameQuestion {
  correct: Country;
  options: Country[];
}

export interface GameState {
  score: number;
  total: number;
  startTime?: number;
}

export type GameMode = 'multiple-choice' | 'free-text';

export interface GameSettings {
  optionCount: 4 | 6 | 8;
  timerEnabled: boolean;
  timerDuration: number;
  gameMode: GameMode;
  questionCount: number;
  difficulty: Difficulty;
  region: Region | 'all';
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export type Language = 'en' | 'fr';
