import { test, expect, vi } from 'vitest';

// Mock DOM and modules
const mockCanvas = {
  style: {},
  width: 0,
  height: 0,
};

const mockRoot = {
  replaceChildren: vi.fn(),
};

global.document = {
  createElement: vi.fn(() => mockCanvas),
  getElementById: vi.fn(() => mockRoot),
} as any;

global.window = {
  innerWidth: 1024,
  innerHeight: 768,
  addEventListener: vi.fn(),
} as any;

vi.mock('./renderer/loop', () => ({
  startLoop: vi.fn(),
}));

vi.mock('./ui/panel', () => ({
  attachPanel: vi.fn(),
}));

test('main initializes canvas and starts app', async () => {
  const { startLoop } = await import('./renderer/loop');
  const { attachPanel } = await import('./ui/panel');

  // Import main to trigger initialization
  await import('./main');

  expect(document.getElementById).toHaveBeenCalledWith('app');
  expect(document.createElement).toHaveBeenCalledWith('canvas');
  expect(mockRoot.replaceChildren).toHaveBeenCalledWith(mockCanvas);
  expect(startLoop).toHaveBeenCalledWith(mockCanvas, expect.any(Object));
  expect(attachPanel).toHaveBeenCalledWith(mockRoot, expect.any(Function));
});

test('main sets up resize listener', async () => {
  await import('./main');

  expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
});

test('resize handler updates canvas dimensions', async () => {
  global.window.innerWidth = 1920;
  global.window.innerHeight = 1080;

  await import('./main');

  // Get the resize handler
  const resizeHandler = (window.addEventListener as any).mock.calls.find(
    (call: any) => call[0] === 'resize',
  )[1];

  // Call resize handler
  resizeHandler();

  expect(mockCanvas.width).toBe(1920);
  expect(mockCanvas.height).toBe(1080);
});
