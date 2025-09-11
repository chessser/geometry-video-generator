import { test, expect, vi } from 'vitest';
import {
  getGrowthCycle,
  getGrowthStage,
  getFadeAlpha,
  drawElementWithFade,
} from '@/renderer/patterns/pattern-base';

test('getGrowthCycle returns correct cycle values', () => {
  expect(getGrowthCycle(0, 0.1)).toBe(0);
  expect(getGrowthCycle(5, 0.1)).toBe(0.5);
  expect(getGrowthCycle(10, 0.1)).toBe(0);
  expect(getGrowthCycle(15, 0.1)).toBe(0.5);
});

test('getGrowthStage returns correct stage indices', () => {
  expect(getGrowthStage(0, 4)).toBe(0);
  expect(getGrowthStage(0.25, 4)).toBe(1);
  expect(getGrowthStage(0.5, 4)).toBe(2);
  expect(getGrowthStage(0.75, 4)).toBe(3);
  expect(getGrowthStage(0.99, 4)).toBe(3);
});

test('getFadeAlpha returns correct fade values', () => {
  // No fade outside transition zones
  expect(getFadeAlpha(0.1, 7, [7, 19, 37])).toBe(1);
  
  // Fade during transition
  expect(getFadeAlpha(0.25, 7, [7, 19, 37], 0.1)).toBeLessThan(1);
  expect(getFadeAlpha(0.25, 7, [7, 19, 37], 0.1)).toBeGreaterThan(0);
  
  // No fade for elements not in transition
  expect(getFadeAlpha(0.25, 1, [7, 19, 37])).toBe(1);
});

test('drawElementWithFade applies correct alpha', () => {
  const mockCtx = {
    globalAlpha: 1,
  };
  
  const drawFn = vi.fn();
  
  drawElementWithFade(mockCtx as any, drawFn, 0.8, 0.5);
  
  expect(drawFn).toHaveBeenCalled();
  expect(mockCtx.globalAlpha).toBe(1); // Should be restored
});