import { test, expect } from 'vitest';
import { THEMES, getDefaultTheme, type Theme } from '@/core/themes';

test('THEMES contains expected themes', () => {
  expect(THEMES).toHaveProperty('sacred-geometry');
  expect(THEMES).toHaveProperty('fractals');
  expect(THEMES).toHaveProperty('organic');
  expect(THEMES).toHaveProperty('minimal');
});

test('getDefaultTheme returns sacred-geometry', () => {
  expect(getDefaultTheme()).toBe('sacred-geometry');
});

test('THEMES includes all individual patterns', () => {
  const patterns = [
    'flower-of-life',
    'seed-of-life',
    'metatrons-cube',
    'sri-yantra',
    'vesica-piscis',
    'tree-of-life',
    'golden-spiral',
  ];

  patterns.forEach((pattern) => {
    expect(THEMES).toHaveProperty(pattern);
    expect(THEMES[pattern as keyof typeof THEMES]).toContain('└');
  });
});

test('themes align with actual pattern implementations', async () => {
  const { PATTERNS } = await import('@/renderer/sacred-geometry');
  const patternThemes = Object.keys(THEMES).filter(key => key !== 'sacred-geometry' && key !== 'fractals' && key !== 'organic' && key !== 'minimal');
  
  // Every pattern theme should have a corresponding pattern implementation
  patternThemes.forEach(theme => {
    expect(PATTERNS).toContain(theme);
  });
  
  // Every pattern implementation should have a corresponding theme
  PATTERNS.forEach((pattern: string) => {
    expect(THEMES).toHaveProperty(pattern);
  });
});

test('THEMES maintains original themes', () => {
  expect(THEMES['sacred-geometry']).toBe('Sacred Geometry');
  expect(THEMES.fractals).toBe('Fractals');
  expect(THEMES.organic).toBe('Organic Forms');
  expect(THEMES.minimal).toBe('Minimal');
});

test('all theme keys are valid Theme types', () => {
  const validThemes: Theme[] = [
    'sacred-geometry',
    'fractals',
    'organic',
    'minimal',
    'flower-of-life',
    'seed-of-life',
    'metatrons-cube',
    'sri-yantra',
    'vesica-piscis',
    'tree-of-life',
    'golden-spiral',
  ];

  Object.keys(THEMES).forEach((key) => {
    expect(validThemes).toContain(key as Theme);
  });
});

test('theme display names are strings', () => {
  Object.values(THEMES).forEach((name) => {
    expect(typeof name).toBe('string');
    expect(name.length).toBeGreaterThan(0);
  });
});
