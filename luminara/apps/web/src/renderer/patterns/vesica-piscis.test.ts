import { test, expect, vi } from 'vitest';
import { renderVesicaPiscis } from './vesica-piscis';
import { defaultParams } from '../../core/params';

vi.mock('../../core/hash', () => ({
  hashToSeed: vi.fn(() => 12345)
}));

const createMockContext = () => ({
  canvas: { width: 800, height: 600 },
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  transform: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  stroke: vi.fn(),
  set globalAlpha(_value: number) {},
  set strokeStyle(_value: string) {},
  set lineWidth(_value: number) {}
});

test('renderVesicaPiscis renders without errors', () => {
  const ctx = createMockContext() as any;
  const params = defaultParams();
  
  expect(() => renderVesicaPiscis(ctx, params, 1.0, 1.0)).not.toThrow();
  expect(ctx.arc).toHaveBeenCalledTimes(2);
});