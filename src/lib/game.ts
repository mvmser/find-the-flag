// Pure game logic functions for Find the Flag

import { Country } from '../data/countries';
import { GameQuestion } from '../types';

/**
 * Fisher-Yates shuffle algorithm for randomizing arrays
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Pick a random country from the list, optionally excluding one
 */
export function pickRandomCountry(
  countries: Country[],
  excludeCode?: string
): Country {
  const available = excludeCode
    ? countries.filter((c) => c.code !== excludeCode)
    : countries;
  
  if (available.length === 0) {
    throw new Error('No countries available to pick');
  }
  
  return available[Math.floor(Math.random() * available.length)];
}

/**
 * Build a question with configurable number of options (1 correct + N-1 random incorrect)
 * Ensures no duplicates and avoids repeating the previous correct answer
 */
export function buildQuestion(
  countries: Country[],
  previousCorrectCode?: string,
  optionCount: number = 4
): GameQuestion {
  if (countries.length < optionCount) {
    throw new Error(`Need at least ${optionCount} countries to build a question`);
  }

  // Pick the correct answer (avoid the previous one if possible)
  const correct = pickRandomCountry(countries, previousCorrectCode);
  
  // Pick N-1 random incorrect options (excluding the correct one)
  const incorrect: Country[] = [];
  const availableIncorrect = countries.filter((c) => c.code !== correct.code);
  
  // Use Fisher-Yates shuffle and take first N-1 for O(n) complexity
  const shuffledIncorrect = shuffle(availableIncorrect);
  for (let i = 0; i < Math.min(optionCount - 1, shuffledIncorrect.length); i++) {
    incorrect.push(shuffledIncorrect[i]);
  }
  
  // Combine and shuffle all options
  const options = shuffle([correct, ...incorrect]);
  
  return {
    correct,
    options,
  };
}
