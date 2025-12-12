// Type definitions for the Find the Flag game

export interface Country {
  code: string;
  name: {
    en: string;
    fr: string;
  };
}

export interface GameState {
  currentCountry: Country | null;
  score: number;
  round: number;
  lives: number;
}

export type Language = 'en' | 'fr';
