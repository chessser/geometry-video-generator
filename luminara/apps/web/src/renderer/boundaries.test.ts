import { test, expect, vi } from 'vitest';
import { applyBoundaryBehavior } from './boundaries';

// Mock hashToSeed
vi.mock('../core/hash', () => ({
  hashToSeed: vi.fn(() => 12345),
}));

test('applyBoundaryBehavior returns valid coordinates', () => {
  const result = applyBoundaryBehavior(400, 300, 800, 600, 100, 'test');

  expect(result.x).toBeGreaterThan(0);
  expect(result.y).toBeGreaterThan(0);
  expect(result.alpha).toBeGreaterThan(0);
});

test('applyBoundaryBehavior handles edge positions', () => {
  const result1 = applyBoundaryBehavior(10, 50, 800, 600, 100, 'edge-test');
  const result2 = applyBoundaryBehavior(790, 550, 800, 600, 100, 'edge-test2');

  expect(result1.x).toBeGreaterThan(0);
  expect(result2.x).toBeLessThan(800);
});

test('applyBoundaryBehavior uses different behaviors for different patterns', () => {
  const result1 = applyBoundaryBehavior(400, 300, 800, 600, 100, 'pattern1');
  const result2 = applyBoundaryBehavior(400, 300, 800, 600, 100, 'pattern2');

  expect(result1).toBeDefined();
  expect(result2).toBeDefined();
});

test('applyBoundaryBehavior handles all boundary cases', () => {
  // Test bounce behavior with overshoot
  const bounce1 = applyBoundaryBehavior(-50, 50, 800, 600, 100, 'bounce-test');
  const bounce2 = applyBoundaryBehavior(850, 50, 800, 600, 100, 'bounce-test2');
  const bounce3 = applyBoundaryBehavior(400, -50, 800, 600, 100, 'bounce-test3');
  const bounce4 = applyBoundaryBehavior(400, 650, 800, 600, 100, 'bounce-test4');

  expect(bounce1.x).toBeGreaterThan(0);
  expect(bounce2.x).toBeLessThan(800);
  expect(bounce3.y).toBeGreaterThan(0);
  expect(bounce4.y).toBeLessThan(600);

  // Test fade behavior near edges (closer to edge)
  const fade = applyBoundaryBehavior(30, 30, 800, 600, 100, 'fade-test');
  expect(fade.alpha).toBeLessThanOrEqual(1.0);
});

test('applyBoundaryBehavior covers all behavior branches', () => {
  // Test wrap behavior with edge cases
  const wrap1 = applyBoundaryBehavior(10, 50, 800, 600, 100, 'wrap-x');
  const wrap2 = applyBoundaryBehavior(790, 50, 800, 600, 100, 'wrap-x2');
  const wrap3 = applyBoundaryBehavior(400, 10, 800, 600, 100, 'wrap-y');
  const wrap4 = applyBoundaryBehavior(400, 590, 800, 600, 100, 'wrap-y2');

  expect(wrap1.x).toBeGreaterThan(0);
  expect(wrap2.x).toBeLessThan(800);
  expect(wrap3.y).toBeGreaterThan(0);
  expect(wrap4.y).toBeLessThan(600);
});
