import { test, expect } from 'vitest';
import { hashToSeed } from '@/core/hash';

test('hashToSeed returns consistent results', () => {
  expect(hashToSeed('test')).toBe(hashToSeed('test'));
});

test('hashToSeed returns different values for different inputs', () => {
  expect(hashToSeed('test1')).not.toBe(hashToSeed('test2'));
});
