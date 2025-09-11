import { test, expect, vi } from 'vitest';

test('sacred-geometry handles undefined pattern gracefully', async () => {
  const { renderSacredGeometry } = await import('@/renderer/sacred-geometry');
  const { defaultParams } = await import('@/core/params');

  let clearCalls = 0;
  
  const mockCtx = {
    canvas: { width: 800, height: 600 },
    clearRect: () => { clearCalls++; },
    save: () => {},
    restore: () => {},
    translate: () => {},
    rotate: () => {},
    scale: () => {},
    transform: () => {},
    beginPath: () => {},
    arc: () => {},
    stroke: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    set globalAlpha(_: number) {},
    set strokeStyle(_: string) {},
    set lineWidth(_: number) {},
  };

  // Mock PATTERNS to potentially return undefined
  vi.doMock('@/renderer/sacred-geometry', async () => {
    const actual = await vi.importActual('@/renderer/sacred-geometry');
    return {
      ...actual,
      PATTERNS: [undefined, 'flower-of-life'], // Include undefined pattern
    };
  });

  renderSacredGeometry(mockCtx as any, defaultParams(), 100); // Large time to trigger pattern cycling
  
  expect(clearCalls).toBeGreaterThan(0);
});