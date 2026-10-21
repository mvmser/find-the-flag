import { describe, expect, it } from 'vitest';
import { countries, REGIONS } from '../data/countries';
import { buildQuestion, getQuestionPool, isCorrectTextAnswer, MIN_POOL_SIZE, normalizeAnswer } from './game';

describe('country data', () => {
  it('has unique codes and a bundled flag for every country', () => {
    const codes = countries.map((c) => c.code);
    expect(new Set(codes).size).toBe(codes.length);
    expect(countries.length).toBeGreaterThanOrEqual(195);
    for (const c of countries) {
      expect(c.flagUrl, c.code).not.toBe('');
    }
  });
});

describe('getQuestionPool', () => {
  it('uses only the requested level when the pool is large enough', () => {
    expect(getQuestionPool(countries, 'easy', 'all').every((c) => c.difficulty === 1)).toBe(true);
    expect(getQuestionPool(countries, 'hard', 'all').every((c) => c.difficulty === 3)).toBe(true);
  });

  it('stays in the region and widens difficulty to keep enough countries', () => {
    for (const region of REGIONS) {
      for (const difficulty of ['easy', 'medium', 'hard'] as const) {
        const pool = getQuestionPool(countries, difficulty, region);
        expect(pool.every((c) => c.region === region)).toBe(true);
        expect(pool.length).toBeGreaterThanOrEqual(MIN_POOL_SIZE);
      }
    }
  });
});

describe('buildQuestion', () => {
  it('returns distinct options including the correct one', () => {
    for (const optionCount of [4, 6, 8]) {
      for (let i = 0; i < 50; i++) {
        const pool = getQuestionPool(countries, 'hard', 'oceania');
        const q = buildQuestion(pool, countries, { optionCount, useSimilar: true });
        const codes = q.options.map((o) => o.code);
        expect(codes).toHaveLength(optionCount);
        expect(new Set(codes).size).toBe(optionCount);
        expect(codes).toContain(q.correct.code);
        expect(pool).toContain(q.correct);
      }
    }
  });

  it('does not repeat excluded countries while others remain', () => {
    const pool = getQuestionPool(countries, 'easy', 'all');
    const asked = new Set<string>();
    for (let i = 0; i < pool.length; i++) {
      const q = buildQuestion(pool, countries, { exclude: asked });
      expect(asked.has(q.correct.code)).toBe(false);
      asked.add(q.correct.code);
    }
    expect(asked.size).toBe(pool.length);
  });
});

describe('free-text answers', () => {
  const find = (code: string) => countries.find((c) => c.code === code)!;

  it('normalizes accents, case and articles', () => {
    expect(normalizeAnswer('  Les États-Unis ')).toBe('etats unis');
  });

  it('accepts English, French and alias names', () => {
    expect(isCorrectTextAnswer('germany', find('DE'))).toBe(true);
    expect(isCorrectTextAnswer('Allemagne', find('DE'))).toBe(true);
    expect(isCorrectTextAnswer('usa', find('US'))).toBe(true);
    expect(isCorrectTextAnswer("cote d'ivoire", find('CI'))).toBe(true);
    expect(isCorrectTextAnswer('France', find('DE'))).toBe(false);
    expect(isCorrectTextAnswer('', find('DE'))).toBe(false);
  });
});
