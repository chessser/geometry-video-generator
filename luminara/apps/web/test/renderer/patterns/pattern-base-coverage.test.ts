import { test, expect, vi } from 'vitest';
import { getFadeAlpha } from '@/renderer/patterns/pattern-base';

test('getFadeAlpha returns 1 when element not in fade zone', () => {
  const result = getFadeAlpha(0.5, 100, [7, 19, 37], 0.1);
  expect(result).toBe(1);
});

test('getFadeAlpha handles edge case with no matching stage', () => {
  const result = getFadeAlpha(0.1, 50, [7, 19, 37], 0.05);
  expect(result).toBe(1);
});