import { test, expect } from 'vitest';
import { hashToSeed } from './hash';

// Future test for deterministic generation
test('same text input produces same visual parameters', () => {
  const text = 'sacred geometry';
  const seed1 = hashToSeed(text);
  const seed2 = hashToSeed(text);
  
  // Same text should always produce same seed
  expect(seed1).toBe(seed2);
  
  // TODO: Add when text-to-params mapping exists
  // const params1 = textToParams(text);
  // const params2 = textToParams(text);
  // expect(params1).toEqual(params2);
});

test('different text produces different parameters', () => {
  const hash1 = hashToSeed('mandala');
  const hash2 = hashToSeed('spiral');
  
  expect(hash1).not.toBe(hash2);
});