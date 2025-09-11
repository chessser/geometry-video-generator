import { test, expect } from 'vitest';

test('animation frame consistency', async () => {
  let frameCount = 0;
  let lastFrameTime = 0;
  const frameTimes: number[] = [];

  global.requestAnimationFrame = (cb: FrameRequestCallback) => {
    const now = performance.now();
    if (lastFrameTime > 0) {
      frameTimes.push(now - lastFrameTime);
    }
    lastFrameTime = now;
    frameCount++;
    
    if (frameCount < 10) {
      setTimeout(() => cb(now), 16);
    }
    return frameCount;
  };

  const { startLoop } = await import('@/renderer/loop');
  const { defaultParams } = await import('@/core/params');

  const mockCanvas = {
    getContext: () => ({
      canvas: { width: 800, height: 600 },
      clearRect: () => {},
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
    }),
    width: 800,
    height: 600,
  };

  startLoop(mockCanvas as any, defaultParams());

  await new Promise(resolve => setTimeout(resolve, 200));

  const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
  expect(avgFrameTime).toBeGreaterThan(10);
  expect(avgFrameTime).toBeLessThan(50);
  expect(frameTimes.length).toBeGreaterThan(5);
});

test('pattern rendering performance', async () => {
  const { renderSacredGeometry } = await import('@/renderer/sacred-geometry');
  const { defaultParams } = await import('@/core/params');

  let drawCallCount = 0;
  const mockCtx = {
    canvas: { width: 800, height: 600 },
    clearRect: () => { drawCallCount++; },
    save: () => { drawCallCount++; },
    restore: () => { drawCallCount++; },
    translate: () => { drawCallCount++; },
    rotate: () => { drawCallCount++; },
    scale: () => { drawCallCount++; },
    transform: () => { drawCallCount++; },
    beginPath: () => { drawCallCount++; },
    arc: () => { drawCallCount++; },
    stroke: () => { drawCallCount++; },
    moveTo: () => { drawCallCount++; },
    lineTo: () => { drawCallCount++; },
    closePath: () => { drawCallCount++; },
    set globalAlpha(_: number) { drawCallCount++; },
    set strokeStyle(_: string) { drawCallCount++; },
    set lineWidth(_: number) { drawCallCount++; },
  };

  const startTime = performance.now();
  renderSacredGeometry(mockCtx as any, defaultParams(), 1.0);
  const renderTime = performance.now() - startTime;

  expect(renderTime).toBeLessThan(50);
  expect(drawCallCount).toBeGreaterThan(10);
});