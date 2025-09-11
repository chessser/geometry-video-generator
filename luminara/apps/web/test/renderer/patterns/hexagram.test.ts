import { test, expect, vi } from 'vitest';
import { renderHexagram } from '../../../src/renderer/patterns/hexagram';
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
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  set globalAlpha(_value: number) {},
  set strokeStyle(_value: string) {},
  set lineWidth(_value: number) {},
});

test('renderHexagram renders without errors', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();

  expect(() => renderHexagram(ctx, params, 1.0, 1.0)).not.toThrow();
  expect(ctx.closePath).toHaveBeenCalledTimes(2);
});
