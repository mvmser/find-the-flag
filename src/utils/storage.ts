// Utility functions for localStorage persistence

import { GameSettings } from '../types';

const STORAGE_KEYS = {
  TOTAL_SCORE: 'findTheFlag_totalScore',
  SETTINGS: 'findTheFlag_settings',
} as const;

export const DEFAULT_SETTINGS: GameSettings = {
  optionCount: 4,
  timerEnabled: true,
  timerDuration: 20,
};

// Total Score persistence
export function loadTotalScore(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TOTAL_SCORE);
    if (!stored) return 0;
    const parsed = parseInt(stored, 10);
    return isNaN(parsed) ? 0 : parsed;
  } catch {
    return 0;
  }
}

export function saveTotalScore(score: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TOTAL_SCORE, score.toString());
  } catch {
    // Silent fail if localStorage is not available
  }
}

export function resetTotalScore(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.TOTAL_SCORE);
  } catch {
    // Silent fail if localStorage is not available
  }
}

// Settings persistence
export function loadSettings(): GameSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch {
    // Fall through to default
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch {
    // Silent fail if localStorage is not available
  }
}
