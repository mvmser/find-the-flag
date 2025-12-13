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
 * Get difficulty rating for a country based on recognition
 * Well-known countries: 1 (easy)
 * Moderately known: 2 (medium)  
 * Lesser-known: 3 (hard)
 */
export function getCountryDifficulty(country: Country): 1 | 2 | 3 {
  // Override if difficulty is set
  if (country.difficulty) return country.difficulty;
  
  // Easy: G7 countries + major powers + popular destinations
  const easyCountries = [
    'US', 'CA', 'GB', 'FR', 'DE', 'IT', 'JP', // G7
    'CN', 'IN', 'BR', 'RU', 'AU', 'MX', 'ES', // Major powers
    'NL', 'CH', 'SE', 'NO', 'DK', 'GR', 'PT', // Popular European
    'EG', 'ZA', 'AR', 'TR', 'TH', 'SG', 'NZ'  // Other well-known
  ];
  
  // Hard: Small nations, island nations, less familiar countries
  const hardCountries = [
    'LU', 'MT', 'CY', 'IS', 'EE', 'LV', 'LT', 'SI', 'SK',
    'HR', 'BG', 'RO', 'RS', 'BA', 'MK', 'AL', 'ME',
    'GE', 'AM', 'AZ', 'BY', 'MD', 'UA'
  ];
  
  if (easyCountries.includes(country.code)) return 1;
  if (hardCountries.includes(country.code)) return 3;
  return 2; // Medium by default
}

/**
 * Get countries that have similar flags based on colors/patterns
 */
export function getSimilarFlags(country: Country, allCountries: Country[]): Country[] {
  // Define flag similarity groups by dominant colors/patterns
  const similarityGroups: { [key: string]: string[] } = {
    // Tricolor vertical
    'tricolor_vertical': ['FR', 'IT', 'BE', 'IE', 'RO', 'MD', 'TD'],
    // Tricolor horizontal  
    'tricolor_horizontal': ['NL', 'RU', 'HR', 'SK', 'SI', 'LU', 'BG', 'EE', 'LT', 'LV', 'AT'],
    // Nordic cross
    'nordic_cross': ['DK', 'NO', 'SE', 'FI', 'IS'],
    // Red white
    'red_white': ['CA', 'CH', 'DK', 'ID', 'MC', 'PL', 'SG', 'TR', 'TN', 'AT', 'LV'],
    // Blue white red
    'blue_white_red': ['FR', 'NL', 'RU', 'GB', 'US', 'AU', 'NZ', 'CZ', 'SK', 'SI'],
    // Green white red
    'green_white_red': ['IT', 'MX', 'HU', 'BG', 'IR'],
    // Pan-Arab colors
    'pan_arab': ['EG', 'SD', 'SY', 'IQ', 'YE', 'JO', 'PS', 'AE'],
    // Pan-Slavic
    'pan_slavic': ['RU', 'SK', 'SI', 'HR', 'RS', 'CZ'],
    // Stars and stripes
    'stars_stripes': ['US', 'MY', 'LR', 'CL', 'UY', 'GR'],
    // Union Jack
    'union_jack': ['GB', 'AU', 'NZ', 'FJ'],
    // Green flags
    'green': ['SA', 'PK', 'LY', 'BD', 'BR', 'NG', 'IE'],
    // Simple bicolor
    'bicolor': ['PL', 'ID', 'MC', 'MT', 'UA'],
  };
  
  // Find which group this country belongs to
  const countryGroups: string[] = [];
  for (const [groupName, codes] of Object.entries(similarityGroups)) {
    if (codes.includes(country.code)) {
      countryGroups.push(groupName);
    }
  }
  
  // If no group found, return random countries
  if (countryGroups.length === 0) {
    return shuffle(allCountries.filter(c => c.code !== country.code)).slice(0, 10);
  }
  
  // Collect all countries from the same groups
  const similarCodes = new Set<string>();
  for (const group of countryGroups) {
    for (const code of similarityGroups[group]) {
      if (code !== country.code) {
        similarCodes.add(code);
      }
    }
  }
  
  // Return similar countries
  return allCountries.filter(c => similarCodes.has(c.code));
}

/**
 * Filter countries by difficulty level
 * Note: Ranges intentionally overlap to ensure enough variety at each level:
 * - Easy: includes level 1 and 2 countries (well-known and moderate)
 * - Medium: includes level 2 and 3 countries (moderate and lesser-known)
 * - Hard: includes level 3 and 2 countries (lesser-known and moderate)
 */
export function filterByDifficulty(
  countries: Country[],
  difficulty: 'easy' | 'medium' | 'hard'
): Country[] {
  return countries.filter(c => {
    const countryDiff = getCountryDifficulty(c);
    
    if (difficulty === 'easy') {
      return countryDiff === 1 || countryDiff === 2; // Easy and medium countries
    } else if (difficulty === 'medium') {
      return countryDiff === 2 || countryDiff === 3; // Medium and hard countries
    } else {
      return countryDiff === 3 || countryDiff === 2; // Hard and medium countries
    }
  });
}

/**
 * Build a question with configurable difficulty and number of options
 */
export function buildQuestionWithDifficulty(
  countries: Country[],
  difficulty: 'easy' | 'medium' | 'hard',
  previousCorrectCode?: string,
  optionCount: number = 4
): GameQuestion {
  // Filter countries by difficulty
  const availableCountries = filterByDifficulty(countries, difficulty);
  
  if (availableCountries.length < optionCount) {
    // Fallback to all countries if not enough
    return buildQuestion(countries, previousCorrectCode, optionCount);
  }

  // Pick the correct answer from appropriate difficulty
  const availableForCorrect = previousCorrectCode
    ? availableCountries.filter(c => c.code !== previousCorrectCode)
    : availableCountries;
  
  if (availableForCorrect.length === 0) {
    return buildQuestion(countries, previousCorrectCode, optionCount);
  }
  
  const correct = availableForCorrect[Math.floor(Math.random() * availableForCorrect.length)];
  
  // For medium and hard, try to get similar flags as incorrect options
  let incorrect: Country[] = [];
  
  if (difficulty === 'medium' || difficulty === 'hard') {
    const similarFlags = getSimilarFlags(correct, countries);
    const availableSimilar = similarFlags.filter(c => c.code !== correct.code);
    
    if (availableSimilar.length >= optionCount - 1) {
      // Use similar flags
      const shuffledSimilar = shuffle(availableSimilar);
      incorrect = shuffledSimilar.slice(0, optionCount - 1);
    }
  }
  
  // If we don't have enough similar flags, fill with random from appropriate difficulty
  if (incorrect.length < optionCount - 1) {
    const availableIncorrect = availableCountries.filter(
      c => c.code !== correct.code && !incorrect.find(i => i.code === c.code)
    );
    const shuffledIncorrect = shuffle(availableIncorrect);
    const needed = optionCount - 1 - incorrect.length;
    incorrect = [...incorrect, ...shuffledIncorrect.slice(0, needed)];
  }
  
  // Combine and shuffle all options
  const options = shuffle([correct, ...incorrect]);
  
  return {
    correct,
    options,
  };
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
