// Pure game logic functions for Find the Flag

import { Country, Region } from '../data/countries';
import { Difficulty, GameQuestion } from '../types';

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

// Difficulty levels included for each setting, widened step by step
// when a region doesn't have enough countries at the requested level.
const DIFFICULTY_LEVELS: Record<Difficulty, (1 | 2 | 3)[][]> = {
  easy: [[1], [1, 2], [1, 2, 3]],
  medium: [[2], [1, 2], [1, 2, 3]],
  hard: [[3], [2, 3], [1, 2, 3]],
};

/** Minimum pool size so a game doesn't feel repetitive */
export const MIN_POOL_SIZE = 12;

/**
 * Countries that can be asked for a given difficulty and region.
 */
export function getQuestionPool(
  countries: Country[],
  difficulty: Difficulty,
  region: Region | 'all',
  minSize: number = MIN_POOL_SIZE
): Country[] {
  const inRegion = region === 'all' ? countries : countries.filter((c) => c.region === region);
  let pool: Country[] = inRegion;
  for (const levels of DIFFICULTY_LEVELS[difficulty]) {
    pool = inRegion.filter((c) => levels.includes(c.difficulty));
    if (pool.length >= minSize) break;
  }
  return pool;
}

// Flags that look alike, used to pick tricky wrong answers in medium and hard
const SIMILARITY_GROUPS: string[][] = [
  ['FR', 'IT', 'BE', 'IE', 'RO', 'MD', 'TD', 'ML', 'GN', 'CI', 'NG', 'PE'], // vertical tricolors
  ['NL', 'RU', 'HR', 'SK', 'SI', 'LU', 'RS', 'BG', 'HU', 'AT', 'LV', 'EE', 'LT', 'DE', 'BE', 'YE'], // horizontal tricolors
  ['DK', 'NO', 'SE', 'FI', 'IS'], // Nordic cross
  ['PL', 'ID', 'MC', 'SG', 'UA', 'MT'], // bicolors
  ['US', 'MY', 'LR', 'UY', 'GR', 'CL', 'TG', 'PR'], // stripes and stars
  ['GB', 'AU', 'NZ', 'FJ', 'TV'], // Union Jack
  ['EG', 'SD', 'SY', 'IQ', 'YE', 'JO', 'PS', 'AE', 'KW'], // Pan-Arab
  ['SA', 'PK', 'DZ', 'MR', 'BD', 'LY', 'TM'], // green Islamic flags
  ['TR', 'TN', 'AZ', 'MV', 'DZ', 'LY'], // crescent and star
  ['GH', 'SN', 'CM', 'ML', 'GN', 'BF', 'ET', 'BO', 'LT'], // Pan-African
  ['CO', 'EC', 'VE'], // Gran Colombia
  ['HN', 'SV', 'NI', 'GT', 'AR'], // blue-white-blue
  ['QA', 'BH'], // serrated
  ['CU', 'PR', 'DO'], // Caribbean
  ['KR', 'KP', 'JP', 'BD', 'PW', 'LA'], // discs
  ['CN', 'VN', 'TR', 'KG', 'MA'], // red with symbol
];

/**
 * Countries whose flags look like the given one
 */
export function getSimilarFlags(country: Country, allCountries: Country[]): Country[] {
  const codes = new Set<string>();
  for (const group of SIMILARITY_GROUPS) {
    if (group.includes(country.code)) {
      group.forEach((code) => code !== country.code && codes.add(code));
    }
  }
  return allCountries.filter((c) => codes.has(c.code));
}

export interface BuildQuestionOptions {
  /** Countries already asked this game; avoided while possible */
  exclude?: Set<string>;
  optionCount?: number;
  /** Prefer look-alike flags as wrong answers */
  useSimilar?: boolean;
}

/**
 * Build a question: 1 correct country from the pool + (optionCount - 1) distinct wrong answers.
 * Wrong answers come from look-alike flags (if requested), then the pool, then all countries.
 */
export function buildQuestion(
  pool: Country[],
  allCountries: Country[],
  { exclude, optionCount = 4, useSimilar = false }: BuildQuestionOptions = {}
): GameQuestion {
  if (allCountries.length < optionCount || pool.length === 0) {
    throw new Error(`Need at least ${optionCount} countries to build a question`);
  }

  const fresh = exclude ? pool.filter((c) => !exclude.has(c.code)) : pool;
  const candidates = fresh.length > 0 ? fresh : pool;
  const correct = candidates[Math.floor(Math.random() * candidates.length)];

  const picked = new Map<string, Country>();
  const addFrom = (list: Country[]) => {
    for (const c of shuffle(list)) {
      if (picked.size >= optionCount - 1) return;
      if (c.code !== correct.code && !picked.has(c.code)) picked.set(c.code, c);
    }
  };

  if (useSimilar) {
    // Keep a bit of randomness: at most half of the wrong answers are look-alikes
    const similar = shuffle(getSimilarFlags(correct, allCountries));
    const max = Math.max(1, Math.ceil((optionCount - 1) / 2));
    addFrom(similar.slice(0, max));
  }
  addFrom(pool);
  addFrom(allCountries.filter((c) => c.region === correct.region));
  addFrom(allCountries);

  return {
    correct,
    options: shuffle([correct, ...picked.values()]),
  };
}

/**
 * Normalize a country name for free-text comparison:
 * lowercase, no accents, no punctuation, no leading article.
 */
export function normalizeAnswer(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(the|le|la|les|l) /, '');
}

/**
 * Check a typed answer against the country's English, French and alias names.
 */
export function isCorrectTextAnswer(input: string, country: Country): boolean {
  const answer = normalizeAnswer(input);
  if (!answer) return false;
  return [country.name_en, country.name_fr, ...(country.aliases ?? [])].some(
    (name) => normalizeAnswer(name) === answer
  );
}
