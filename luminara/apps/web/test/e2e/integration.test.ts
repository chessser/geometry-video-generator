import { test, expect } from 'vitest';

test('full application integration', async () => {
  // Mock DOM environment
  const mockElement = {
    style: {},
    width: 800,
    height: 600,
    textContent: '',
    value: '',
    selected: false,
    children: [],
    appendChild: () => {},
    addEventListener: () => {},
    replaceChildren: () => {},
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
  };

  global.document = {
    createElement: (tag: string) => tag === 'canvas' ? mockElement : { ...mockElement },
    getElementById: () => mockElement,
  } as any;

  global.window = {
    innerWidth: 1024,
    innerHeight: 768,
    addEventListener: () => {},
  } as any;

  global.requestAnimationFrame = () => 1;

  // Test main application startup
  const startTime = performance.now();
  await import('@/main');
  const loadTime = performance.now() - startTime;

  expect(loadTime).toBeLessThan(250);
});

test('theme switching performance', async () => {
  const { THEMES } = await import('@/core/themes');
  const { renderSacredGeometry } = await import('@/renderer/sacred-geometry');
  const { defaultParams } = await import('@/core/params');

  const mockCtx = {
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
  };

  const params = defaultParams();
  const themeKeys = Object.keys(THEMES);
  const renderTimes: number[] = [];

  // Test each theme rendering performance
  for (const theme of themeKeys.slice(0, 5)) {
    params.theme = theme as any;
    const startTime = performance.now();
    renderSacredGeometry(mockCtx as any, params, 1.0);
    const renderTime = performance.now() - startTime;
    renderTimes.push(renderTime);
  }

  const avgRenderTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
  expect(avgRenderTime).toBeLessThan(30);
  expect(Math.max(...renderTimes)).toBeLessThan(100);
});