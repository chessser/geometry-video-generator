import { test, expect, vi } from 'vitest';
import { renderSacredGeometry, defaultParams } from '../../src';

vi.mock('../../src/core/hash', () => ({
  hashToSeed: vi.fn((key: string) => {
    if (key === 'multi-pattern') return 98; // Force 6 patterns (line 52)
    return 12345;
  }),
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

test('renderSacredGeometry handles 6 patterns case', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();
  
  renderSacredGeometry(ctx, params, 1.0);
  
  expect(ctx.clearRect).toHaveBeenCalled();
});

test('renderSacredGeometry handles invalid single pattern', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();
  
  renderSacredGeometry(ctx, params, 1.0, 'invalid-pattern');
  
  expect(ctx.clearRect).toHaveBeenCalled();
});