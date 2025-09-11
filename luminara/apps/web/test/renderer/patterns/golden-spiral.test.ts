import { test, expect, vi } from 'vitest';
import { renderGoldenSpiral } from '../../../src/renderer/patterns/golden-spiral';
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

test('renderGoldenSpiral renders without errors', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();

  expect(() => renderGoldenSpiral(ctx, params, 1.0, 1.0)).not.toThrow();
  expect(ctx.moveTo).toHaveBeenCalled();
  expect(ctx.lineTo).toHaveBeenCalled();
});
