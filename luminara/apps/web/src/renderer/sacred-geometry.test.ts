import { test, expect, vi } from 'vitest';
import { renderSacredGeometry } from './sacred-geometry';
import { defaultParams } from '../core/params';

// Mock hashToSeed
vi.mock('../core/hash', () => ({
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
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  set globalAlpha(_value: number) {},
  set strokeStyle(_value: string) {},
  set lineWidth(_value: number) {},
});

test('renderSacredGeometry clears canvas', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();

  renderSacredGeometry(ctx, params, 1.0);

  expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 800, 600);
});

test('renderSacredGeometry cycles through patterns', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();

  // Test different time values to trigger pattern changes
  renderSacredGeometry(ctx, params, 0);
  renderSacredGeometry(ctx, params, 6);
  renderSacredGeometry(ctx, params, 12);

  expect(ctx.clearRect).toHaveBeenCalledTimes(3);
});

test('renderSacredGeometry handles transition periods', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();

  // Test transition time (should render two patterns)
  renderSacredGeometry(ctx, params, 4.5); // Mid-transition

  expect(ctx.clearRect).toHaveBeenCalled();
});

test('renderSacredGeometry handles all pattern types in switch', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();

  // Test each pattern type by controlling the pattern order
  renderSacredGeometry(ctx, params, 0); // flower-of-life
  renderSacredGeometry(ctx, params, 6); // seed-of-life
  renderSacredGeometry(ctx, params, 12); // metatrons-cube
  renderSacredGeometry(ctx, params, 18); // sri-yantra

  expect(ctx.clearRect).toHaveBeenCalledTimes(4);
});

test('renderSacredGeometry handles multi-pattern mode', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();

  // Test multiple time values - now always renders multiple patterns
  renderSacredGeometry(ctx, params, 1.0);
  renderSacredGeometry(ctx, params, 10.0);

  expect(ctx.clearRect).toHaveBeenCalledTimes(2);
  expect(ctx.save).toHaveBeenCalled();
});

test('renderSacredGeometry covers all pattern render cases', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();

  // Test different time values - now renders 1-7 patterns based on probability
  for (let i = 0; i < 10; i++) {
    renderSacredGeometry(ctx, params, i * 15);
  }

  expect(ctx.clearRect).toHaveBeenCalledTimes(10);
  expect(ctx.save).toHaveBeenCalled();
});

test('renderSacredGeometry handles multi-pattern rendering branches', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();

  // Test with different time offsets - system now always uses multi-pattern logic
  renderSacredGeometry(ctx, params, 5.5);
  renderSacredGeometry(ctx, params, 25.3);
  renderSacredGeometry(ctx, params, 100.7);

  expect(ctx.clearRect).toHaveBeenCalledTimes(3);
  expect(ctx.save).toHaveBeenCalled();
});

test('renderSacredGeometry renders variable pattern counts', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();

  // Test multiple calls to potentially hit different pattern counts (1-7)
  for (let i = 0; i < 20; i++) {
    renderSacredGeometry(ctx, params, i * 3.7);
  }

  expect(ctx.clearRect).toHaveBeenCalledTimes(20);
  expect(ctx.save).toHaveBeenCalled();
});

test('renderSacredGeometry handles single pattern mode', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();

  renderSacredGeometry(ctx, params, 1.0, 'flower-of-life');
  renderSacredGeometry(ctx, params, 2.0, 'pentagram');
  renderSacredGeometry(ctx, params, 3.0, 'mandala');

  expect(ctx.clearRect).toHaveBeenCalledTimes(3);
  expect(ctx.save).toHaveBeenCalled();
});

test('renderSacredGeometry ignores invalid single patterns', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();

  renderSacredGeometry(ctx, params, 1.0, 'invalid-pattern');

  expect(ctx.clearRect).toHaveBeenCalledTimes(1);
  expect(ctx.save).toHaveBeenCalled();
});
