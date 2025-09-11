import { test, expect, vi } from 'vitest';
import { renderMorphingPattern } from '../../../src/renderer/patterns/morphing';
import { defaultParams } from '../../../src/core/params';

vi.mock('../../core/hash', () => ({
  hashToSeed: vi.fn(() => 12345),
}));

const createMockContext = () => ({
  canvas: { width: 800, height: 600 },
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  transform: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  set globalAlpha(_value: number) {},
  set strokeStyle(_value: string) {},
  set lineWidth(_value: number) {},
});

test('renderMorphingPattern renders without errors', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();

  expect(() => renderMorphingPattern(ctx, params, 1.0, 1.0)).not.toThrow();
  expect(ctx.beginPath).toHaveBeenCalled();
  expect(ctx.stroke).toHaveBeenCalled();
});

test('renderMorphingPattern handles different morph cycles', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();

  // Test different time values to hit different morph phases
  expect(() => renderMorphingPattern(ctx, params, 2.0, 1.0)).not.toThrow(); // Circle to triangle
  expect(() => renderMorphingPattern(ctx, params, 5.0, 1.0)).not.toThrow(); // Triangle to square
  expect(() => renderMorphingPattern(ctx, params, 8.0, 1.0)).not.toThrow(); // Square to circle

  expect(ctx.moveTo).toHaveBeenCalled();
  expect(ctx.lineTo).toHaveBeenCalled();
});
