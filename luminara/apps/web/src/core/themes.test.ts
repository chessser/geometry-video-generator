import { test, expect } from 'vitest';
import { THEMES, getDefaultTheme, type Theme } from './themes';

test('THEMES contains expected themes', () => {
  expect(THEMES).toHaveProperty('sacred-geometry');
  expect(THEMES).toHaveProperty('fractals');
  expect(THEMES).toHaveProperty('organic');
  expect(THEMES).toHaveProperty('minimal');
});

test('getDefaultTheme returns sacred-geometry', () => {
  expect(getDefaultTheme()).toBe('sacred-geometry');
});

test('all theme keys are valid Theme types', () => {
  const validThemes: Theme[] = ['sacred-geometry', 'fractals', 'organic', 'minimal'];
  
  Object.keys(THEMES).forEach(key => {
    expect(validThemes).toContain(key as Theme);
  });
});

test('theme display names are strings', () => {
  Object.values(THEMES).forEach(name => {
    expect(typeof name).toBe('string');
    expect(name.length).toBeGreaterThan(0);
  });
});