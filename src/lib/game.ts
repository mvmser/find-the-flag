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
 * Build a question with 4 options (1 correct + 3 random incorrect)
 * Ensures no duplicates and avoids repeating the previous correct answer
 */
export function buildQuestion(
  countries: Country[],
  previousCorrectCode?: string
): GameQuestion {
  if (countries.length < 4) {
    throw new Error('Need at least 4 countries to build a question');
  }

  // Pick the correct answer (avoid the previous one if possible)
  const correct = pickRandomCountry(countries, previousCorrectCode);
  
  // Pick 3 random incorrect options (excluding the correct one)
  const incorrect: Country[] = [];
  const availableIncorrect = countries.filter((c) => c.code !== correct.code);
  
  while (incorrect.length < 3 && availableIncorrect.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableIncorrect.length);
    const picked = availableIncorrect.splice(randomIndex, 1)[0];
    incorrect.push(picked);
  }
  
  // Combine and shuffle all options
  const options = shuffle([correct, ...incorrect]);
  
  return {
    correct,
    options,
  };
}
