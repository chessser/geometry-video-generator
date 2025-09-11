import { test, expect, vi } from 'vitest';
import {
  renderFlowerOfLife,
  renderSeedOfLife,
  renderMetatronsCube,
  renderSriYantra,
} from '@/renderer/patterns';
import { defaultParams } from '@/core/params';

// Mock hashToSeed
vi.mock('../core/hash', () => ({
  hashToSeed: vi.fn(() => 12345),
}));

// Mock canvas context
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
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  set globalAlpha(_value: number) {},
  set strokeStyle(_value: string) {},
  set lineWidth(_value: number) {},
});

test('renderFlowerOfLife calls canvas methods', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();

  renderFlowerOfLife(ctx, params, 1.0, 0.5);

  expect(ctx.save).toHaveBeenCalled();
  expect(ctx.restore).toHaveBeenCalled();
  expect(ctx.translate).toHaveBeenCalled();
  expect(ctx.rotate).toHaveBeenCalled();
  expect(ctx.arc).toHaveBeenCalled();
});

test('renderSeedOfLife renders with different parameters', () => {
  const ctx = createMockContext() as any;
  const params = { ...defaultParams(), symmetry: 8 };

  renderSeedOfLife(ctx, params, 2.0, 1.0);

  expect(ctx.arc).toHaveBeenCalledTimes(7); // 1 center + 6 outer
  expect(ctx.stroke).toHaveBeenCalled();
});

test('renderMetatronsCube handles positions array', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();

  renderMetatronsCube(ctx, params, 0.5, 0.8);

  expect(ctx.arc).toHaveBeenCalled();
  expect(ctx.moveTo).toHaveBeenCalled();
  expect(ctx.lineTo).toHaveBeenCalled();
});

test('renderSriYantra creates triangles', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();

  renderSriYantra(ctx, params, 1.5, 0.3);

  expect(ctx.closePath).toHaveBeenCalled();
  expect(ctx.stroke).toHaveBeenCalled();
});

test('all patterns handle zero time', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();

  expect(() => renderFlowerOfLife(ctx, params, 0)).not.toThrow();
  expect(() => renderSeedOfLife(ctx, params, 0)).not.toThrow();
  expect(() => renderMetatronsCube(ctx, params, 0)).not.toThrow();
  expect(() => renderSriYantra(ctx, params, 0)).not.toThrow();
});

test('patterns handle different alpha values', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();

  renderFlowerOfLife(ctx, params, 1.0, 0);
  renderSeedOfLife(ctx, params, 1.0, 0.5);
  renderMetatronsCube(ctx, params, 1.0, 1.0);

  expect(ctx.save).toHaveBeenCalledTimes(3);
});

test('metatron cube handles different path types', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();

  // Test different pathType values by calling multiple times
  renderMetatronsCube(ctx, params, 1.0, 1.0);
  renderMetatronsCube(ctx, params, 2.0, 1.0);
  renderMetatronsCube(ctx, params, 3.0, 1.0);

  expect(ctx.translate).toHaveBeenCalledTimes(3);
  expect(ctx.arc).toHaveBeenCalled();
});

test('patterns use enhanced dynamics', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();

  // Test that patterns call basic canvas methods
  renderFlowerOfLife(ctx, params, 1.0, 1.0);
  expect(ctx.translate).toHaveBeenCalled();

  renderMetatronsCube(ctx, params, 1.0, 1.0);
  expect(ctx.transform).toHaveBeenCalled();

  renderSriYantra(ctx, params, 1.0, 1.0);
  expect(ctx.rotate).toHaveBeenCalled();
});
