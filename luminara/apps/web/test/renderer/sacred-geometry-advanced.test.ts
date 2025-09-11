import { test, expect, vi } from 'vitest';
import { renderSacredGeometry } from '@/renderer/sacred-geometry';
import { defaultParams } from '@/core/params';

vi.mock('../../src/core/hash', () => ({
  hashToSeed: vi.fn(() => 12345),
}));

const createMockContext = () => ({
  canvas: { width: 800, height: 600 },
  clearRect: vi.fn(),
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
  closePath: vi.fn(),
  set globalAlpha(_value: number) {},
  set strokeStyle(_value: string) {},
  set lineWidth(_value: number) {},
});

test('sacred geometry handles single pattern mode', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();
  
  renderSacredGeometry(ctx, params, 1.0, 'flower-of-life');
  
  expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 800, 600);
  expect(ctx.arc).toHaveBeenCalled(); // Flower of life uses arcs
});

test('sacred geometry creates multi-pattern compositions', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();
  
  renderSacredGeometry(ctx, params, 1.0);
  
  expect(ctx.clearRect).toHaveBeenCalled();
  expect(ctx.save).toHaveBeenCalled();
  expect(ctx.restore).toHaveBeenCalled();
});

test('sacred geometry applies fade transitions correctly', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();
  
  let alphaValues: number[] = [];
  Object.defineProperty(ctx, 'globalAlpha', {
    set: (value: number) => alphaValues.push(value),
    get: () => alphaValues[alphaValues.length - 1] || 1,
  });
  
  // Test at different cycle points
  renderSacredGeometry(ctx, params, 2.0); // Early in cycle
  const earlyAlphas = [...alphaValues];
  
  alphaValues = [];
  renderSacredGeometry(ctx, params, 18.0); // Late in cycle
  const lateAlphas = [...alphaValues];
  
  // Should have different alpha patterns
  expect(earlyAlphas).not.toEqual(lateAlphas);
});

test('sacred geometry maintains performance with multiple patterns', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();
  
  const startTime = performance.now();
  
  // Render multiple frames
  for (let i = 0; i < 10; i++) {
    ctx.clearRect.mockClear();
    ctx.save.mockClear();
    ctx.restore.mockClear();
    
    renderSacredGeometry(ctx, params, i);
  }
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  // Should complete reasonably quickly (less than 100ms for 10 frames)
  expect(duration).toBeLessThan(100);
});