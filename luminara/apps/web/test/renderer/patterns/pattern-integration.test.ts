import { test, expect, vi } from 'vitest';
import {
  renderFlowerOfLife,
  renderSeedOfLife,
  renderGoldenSpiral,
} from '@/renderer/patterns';
import { defaultParams } from '@/core/params';

vi.mock('../../../src/core/hash', () => ({
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
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  set globalAlpha(_value: number) {},
  set strokeStyle(_value: string) {},
  set lineWidth(_value: number) {},
});

test('all patterns handle alpha transparency correctly', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();
  
  const patterns = [
    { name: 'flower-of-life', fn: renderFlowerOfLife },
    { name: 'seed-of-life', fn: renderSeedOfLife },
    { name: 'golden-spiral', fn: renderGoldenSpiral },
  ];
  
  patterns.forEach(({ name, fn }) => {
    ctx.save.mockClear();
    ctx.restore.mockClear();
    
    fn(ctx, params, 1.0, 0.5);
    
    expect(ctx.save).toHaveBeenCalled();
    expect(ctx.restore).toHaveBeenCalled();
  });
});

test('patterns respond to scale parameter', () => {
  const ctx = createMockContext() as any;
  const baseParams = defaultParams();
  
  const smallParams = { ...baseParams, scale: 0.5 };
  const largeParams = { ...baseParams, scale: 2.0 };
  
  // Test with flower of life
  ctx.arc.mockClear();
  renderFlowerOfLife(ctx, smallParams, 1.0, 1.0);
  const smallRadii = ctx.arc.mock.calls.map((call: any[]) => call[2]);
  
  ctx.arc.mockClear();
  renderFlowerOfLife(ctx, largeParams, 1.0, 1.0);
  const largeRadii = ctx.arc.mock.calls.map((call: any[]) => call[2]);
  
  // Large scale should produce larger radii
  expect(largeRadii[0]).toBeGreaterThan(smallRadii[0]);
});

test('patterns maintain consistent behavior across time', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();
  
  const timePoints = [0, 5, 10, 15, 20];
  const callCounts: number[] = [];
  
  timePoints.forEach(t => {
    ctx.arc.mockClear();
    renderFlowerOfLife(ctx, params, t, 1.0);
    callCounts.push(ctx.arc.mock.calls.length);
  });
  
  // Should have predictable pattern based on growth cycle
  const uniqueCounts = [...new Set(callCounts)];
  expect(uniqueCounts.length).toBeGreaterThan(1);
  expect(uniqueCounts.every(count => [7, 19, 37, 61].includes(count))).toBe(true);
});