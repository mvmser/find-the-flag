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
  gameMode: 'multiple-choice',
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
      const parsed = JSON.parse(stored);
      
      // Validate and sanitize stored settings - only keep known properties
      const validatedSettings: GameSettings = { ...DEFAULT_SETTINGS };
      
      // Validate optionCount
      if (parsed.optionCount === 4 || parsed.optionCount === 6 || parsed.optionCount === 8) {
        validatedSettings.optionCount = parsed.optionCount;
      }
      
      // Validate timerEnabled
      if (typeof parsed.timerEnabled === 'boolean') {
        validatedSettings.timerEnabled = parsed.timerEnabled;
      }
      
      // Validate timerDuration
      if (typeof parsed.timerDuration === 'number' && parsed.timerDuration > 0) {
        validatedSettings.timerDuration = parsed.timerDuration;
      }
      
      // Validate gameMode
      if (parsed.gameMode === 'multiple-choice' || parsed.gameMode === 'free-text') {
        validatedSettings.gameMode = parsed.gameMode;
      }
      
      // Return only validated properties, ignoring any obsolete ones from parsed
      return validatedSettings;
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
