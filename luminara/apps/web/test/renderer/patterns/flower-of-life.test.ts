import { test, expect, vi } from 'vitest';
import { renderFlowerOfLife } from '../../../src/renderer/patterns/flower-of-life';
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
  scale: vi.fn(),
  transform: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  stroke: vi.fn(),
  set globalAlpha(_value: number) {},
  set strokeStyle(_value: string) {},
  set lineWidth(_value: number) {},
});

test('renderFlowerOfLife renders without errors', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();

  expect(() => renderFlowerOfLife(ctx, params, 1.0, 1.0)).not.toThrow();
  expect(ctx.save).toHaveBeenCalled();
  expect(ctx.restore).toHaveBeenCalled();
  expect(ctx.arc).toHaveBeenCalled();
});

test('renderFlowerOfLife changes circle count over time', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();
  
  const arcCounts = [];
  for (let t = 0; t < 40; t += 10) {
    ctx.arc.mockClear();
    renderFlowerOfLife(ctx, params, t, 1.0);
    arcCounts.push(ctx.arc.mock.calls.length);
  }
  
  const uniqueCounts = [...new Set(arcCounts)];
  expect(uniqueCounts.length).toBeGreaterThan(1);
  expect(uniqueCounts.every(count => [7, 19, 37, 61].includes(count))).toBe(true);
});
