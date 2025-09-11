import { test, expect, vi } from 'vitest';
import { setupPattern, finishPattern } from '../../../src/renderer/patterns/pattern-base';
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
  set globalAlpha(_value: number) {},
  set strokeStyle(_value: string) {},
  set lineWidth(_value: number) {},
});

test('setupPattern configures canvas correctly', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();

  const result = setupPattern(ctx, params, 1.0, 1.0, {
    id: 'test-pattern',
    moveSpeed: 0.1,
    size: 0.3,
    movementRange: 0.2,
    pulseRate: 0.5,
    rotationRate: 0.05,
    hueBase: 180,
  });

  expect(ctx.save).toHaveBeenCalled();
  expect(ctx.translate).toHaveBeenCalled();
  expect(ctx.rotate).toHaveBeenCalled();
  expect(result.size).toBeGreaterThan(0);
});

test('finishPattern restores canvas', () => {
  const ctx = createMockContext() as any;

  finishPattern(ctx);

  expect(ctx.restore).toHaveBeenCalled();
});
