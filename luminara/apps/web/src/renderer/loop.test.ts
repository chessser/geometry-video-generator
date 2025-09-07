import { test, expect, vi } from 'vitest';
import { startLoop } from './loop';

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => {
  setTimeout(cb, 16);
  return 1;
});

test('startLoop handles missing canvas context', () => {
  const canvas = {
    getContext: vi.fn(() => null),
  } as any;

  expect(() => startLoop(canvas)).not.toThrow();
  expect(canvas.getContext).toHaveBeenCalledWith('2d');
});

test('startLoop starts render loop with valid context', () => {
  const mockCtx = {
    canvas: { width: 800, height: 600 },
    fillStyle: '',
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    set globalAlpha(_value: number) {},
    set strokeStyle(_value: string) {},
    set lineWidth(_value: number) {},
  };

  const canvas = {
    getContext: vi.fn(() => mockCtx),
    width: 800,
    height: 600,
  } as any;

  // Mock requestAnimationFrame to prevent infinite loop
  const originalRAF = global.requestAnimationFrame;
  global.requestAnimationFrame = vi.fn();

  startLoop(canvas);

  expect(canvas.getContext).toHaveBeenCalledWith('2d');
  expect(global.requestAnimationFrame).toHaveBeenCalled();

  // Restore original
  global.requestAnimationFrame = originalRAF;
});

test('startLoop animation callback executes render logic', () => {
  const mockCtx = {
    canvas: { width: 800, height: 600 },
    fillStyle: '',
    fillRect: vi.fn(),
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
  };

  const canvas = {
    getContext: vi.fn(() => mockCtx),
    width: 800,
    height: 600,
  } as any;

  let animationCallback: Function;
  global.requestAnimationFrame = vi.fn((cb) => {
    animationCallback = cb;
    return 1;
  });

  startLoop(canvas);

  // Execute the animation callback
  animationCallback!(16.67);

  expect(mockCtx.clearRect).toHaveBeenCalled();
});

test('startLoop handles null context gracefully', () => {
  const canvas = {
    getContext: vi.fn(() => null),
  } as any;

  global.requestAnimationFrame = vi.fn();

  expect(() => startLoop(canvas)).not.toThrow();
  expect(global.requestAnimationFrame).not.toHaveBeenCalled();
});
