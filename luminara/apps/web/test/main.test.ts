import { test, expect, vi } from 'vitest';

// Mock DOM and modules
const mockElement = {
  style: {},
  width: 0,
  height: 0,
  textContent: '',
  value: '',
  selected: false,
  getContext: vi.fn(() => ({})),
  appendChild: vi.fn(),
  addEventListener: vi.fn(),
};

const mockCanvas = mockElement;

const mockRoot = {
  replaceChildren: vi.fn(),
  appendChild: vi.fn(),
};

global.document = {
  createElement: vi.fn(() => mockElement),
  getElementById: vi.fn(() => mockRoot),
} as any;

global.window = {
  innerWidth: 1024,
  innerHeight: 768,
  addEventListener: vi.fn(),
} as any;

global.requestAnimationFrame = vi.fn();

vi.mock('../src/renderer/loop', () => ({
  startLoop: vi.fn(),
}));

vi.mock('../src/ui/panel', () => ({
  attachPanel: vi.fn(),
}));

test('main initializes canvas and starts app', async () => {
  const { startLoop } = await import('../src');
  const { attachPanel } = await import('../src');

  // Import main to trigger initialization
  await import('../src/main');

  expect(document.getElementById).toHaveBeenCalledWith('app');
  expect(document.createElement).toHaveBeenCalledWith('canvas');
  expect(mockRoot.replaceChildren).toHaveBeenCalledWith(mockCanvas);
  expect(startLoop).toHaveBeenCalledWith(mockCanvas, expect.any(Object));
  expect(attachPanel).toHaveBeenCalledWith(mockRoot, expect.any(Function));
});

test('main sets up resize listener', async () => {
  await import('../src/main');

  expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
});

test('resize handler updates canvas dimensions', async () => {
  global.window.innerWidth = 1920;
  global.window.innerHeight = 1080;

  await import('../src/main');

  // Get the resize handler
  const resizeHandler = (window.addEventListener as any).mock.calls.find(
    (call: any) => call[0] === 'resize',
  )[1];

  // Call resize handler
  resizeHandler();

  expect(mockCanvas.width).toBe(1920);
  expect(mockCanvas.height).toBe(1080);
});
