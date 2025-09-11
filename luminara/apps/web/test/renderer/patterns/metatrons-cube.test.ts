import { test, expect, vi } from 'vitest';
import { renderMetatronsCube } from '@/renderer/patterns/metatrons-cube';
import { defaultParams } from '@/core/params';

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
  arc: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  set globalAlpha(_value: number) {},
  set strokeStyle(_value: string) {},
  set lineWidth(_value: number) {},
});

test('renderMetatronsCube renders without errors', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();

  expect(() => renderMetatronsCube(ctx, params, 1.0, 1.0)).not.toThrow();
  expect(ctx.arc).toHaveBeenCalled();
  expect(ctx.lineTo).toHaveBeenCalled();
});

test('renderMetatronsCube handles different time values', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();

  // Test multiple calls to potentially hit different path types
  expect(() => renderMetatronsCube(ctx, params, 1.0, 1.0)).not.toThrow();
  expect(() => renderMetatronsCube(ctx, params, 2.0, 1.0)).not.toThrow();
  expect(() => renderMetatronsCube(ctx, params, 3.0, 1.0)).not.toThrow();

  expect(ctx.arc).toHaveBeenCalled();
});

test('renderMetatronsCube covers all movement path branches', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();

  // Test with varied time values to hit different pathType calculations
  for (let i = 0; i < 6; i++) {
    expect(() => renderMetatronsCube(ctx, params, i * 0.5, 1.0)).not.toThrow();
  }

  expect(ctx.arc).toHaveBeenCalled();
});
