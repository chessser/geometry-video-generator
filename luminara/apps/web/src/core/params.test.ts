import { describe, it, expect } from 'vitest';
import { defaultParams } from './params';

describe('defaultParams', () => {
  it('should return valid default parameters', () => {
    const params = defaultParams();
    expect(params).toEqual({
      theme: 'sacred-geometry',
      symmetry: 6,
      angle: 0.0,
      scale: 1.0,
      iter: 8,
      paletteIdx: 0,
    });
  });

  it('should return a new object each time', () => {
    const params1 = defaultParams();
    const params2 = defaultParams();
    expect(params1).not.toBe(params2);
    expect(params1).toEqual(params2);
  });
});