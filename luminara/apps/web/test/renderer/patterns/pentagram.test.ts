import { test, expect, vi } from 'vitest';
import { renderPentagram } from '../../../src/renderer/patterns/pentagram';
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
  closePath: vi.fn(),
  stroke: vi.fn(),
  set globalAlpha(_value: number) {},
  set strokeStyle(_value: string) {},
  set lineWidth(_value: number) {},
});

test('renderPentagram renders without errors', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();

  expect(() => renderPentagram(ctx, params, 1.0, 1.0)).not.toThrow();
  expect(ctx.stroke).toHaveBeenCalled();
});
