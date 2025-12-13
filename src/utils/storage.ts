// Utility functions for localStorage persistence

import { GameSettings } from '../types';

const STORAGE_KEYS = {
  TOTAL_SCORE: 'findTheFlag_totalScore',
  SETTINGS: 'findTheFlag_settings',
  PSEUDONYM: 'findTheFlag_pseudonym',
} as const;

export const PSEUDONYM_MAX_LENGTH = 20;
export const MAX_SCORE = 999999; // Maximum reasonable score

export const DEFAULT_SETTINGS: GameSettings = {
  optionCount: 4,
  timerEnabled: true,
  timerDuration: 20,
  gameMode: 'multiple-choice',
};

// Score sharing encoding/decoding
// Simple obfuscation to make it harder for users to manually craft URLs
export function encodeScoreData(username: string, score: number): string {
  const data = JSON.stringify({ u: username, s: score, t: Date.now() });
  return btoa(data); // Base64 encode
}

export function decodeScoreData(encoded: string): { username: string; score: number } | null {
  try {
    const decoded = atob(encoded); // Base64 decode
    const data = JSON.parse(decoded);
    
    // Validate structure
    if (typeof data.u !== 'string' || typeof data.s !== 'number') {
      return null;
    }
    
    // Validate score bounds
    if (isNaN(data.s) || data.s < 0 || data.s > MAX_SCORE) {
      return null;
    }
    
    // Sanitize username
    const username = data.u.trim().substring(0, PSEUDONYM_MAX_LENGTH);
    
    return { username, score: data.s };
  } catch {
    return null;
  }
}

// Total Score persistence
export function loadTotalScore(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TOTAL_SCORE);
    if (!stored) return 0;
    const parsed = parseInt(stored, 10);
    return (isNaN(parsed) || parsed < 0) ? 0 : parsed;
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
      
      // Validate timerDuration (must be > 0 and <= 60 seconds)
      if (typeof parsed.timerDuration === 'number' && parsed.timerDuration > 0 && parsed.timerDuration <= 60) {
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

// Pseudonym persistence
export function loadPseudonym(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PSEUDONYM);
    return stored || '';
  } catch {
    return '';
  }
}

export function savePseudonym(pseudonym: string): void {
  try {
    // Validate and sanitize pseudonym
    const sanitized = pseudonym.trim().substring(0, PSEUDONYM_MAX_LENGTH);
    localStorage.setItem(STORAGE_KEYS.PSEUDONYM, sanitized);
  } catch {
    // Silent fail if localStorage is not available
  }
}
