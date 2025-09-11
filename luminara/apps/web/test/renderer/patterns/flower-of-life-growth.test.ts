import { test, expect, vi } from 'vitest';
import { renderFlowerOfLife } from '@/renderer/patterns/flower-of-life';
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
  set globalAlpha(_value: number) {},
  set strokeStyle(_value: string) {},
  set lineWidth(_value: number) {},
});

test('flower of life follows proper layer mathematics', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();
  
  // Test each growth stage
  const testCases = [
    { t: 0, expectedCount: 7 },    // Layer 1+2: 1+6=7
    { t: 10, expectedCount: 19 },  // Layer 1+2+3: 1+6+12=19
    { t: 20, expectedCount: 37 },  // Layer 1+2+3+4: 1+6+12+18=37
    { t: 30, expectedCount: 61 },  // Layer 1+2+3+4+5: 1+6+12+18+24=61
  ];
  
  testCases.forEach(({ t, expectedCount }) => {
    ctx.arc.mockClear();
    renderFlowerOfLife(ctx, params, t, 1.0);
    expect(ctx.arc.mock.calls.length).toBe(expectedCount);
  });
});

test('flower of life renders during transition periods', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();
  
  // Test during transition period - should not throw
  expect(() => renderFlowerOfLife(ctx, params, 8.33, 1.0)).not.toThrow();
  expect(ctx.arc).toHaveBeenCalled();
});

test('flower of life maintains consistent circle properties', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();
  
  renderFlowerOfLife(ctx, params, 0, 1.0);
  
  const arcCalls = ctx.arc.mock.calls;
  expect(arcCalls.length).toBe(7); // Should have 7 circles in first stage
  
  // All circles should have same radius
  const radii = arcCalls.map((call: any[]) => call[2]);
  const firstRadius = radii[0];
  
  radii.forEach(radius => {
    expect(radius).toBe(firstRadius);
  });
  
  // Should draw complete circles (0 to 2π)
  arcCalls.forEach((call: any[]) => {
    expect(call[3]).toBe(0); // start angle
    expect(call[4]).toBeCloseTo(Math.PI * 2, 5); // end angle
  });
});