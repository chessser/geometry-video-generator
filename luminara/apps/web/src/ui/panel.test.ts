import { test, expect, vi } from 'vitest';
import { attachPanel } from './panel';

// Mock DOM
const createMockElement = (tagName: string) => ({
  tagName,
  style: {},
  textContent: '',
  appendChild: vi.fn(),
  createElement: vi.fn(),
  addEventListener: vi.fn(),
  selected: false,
  value: '',
});

global.document = {
  createElement: vi.fn((tag) => createMockElement(tag)),
} as any;

test('attachPanel creates panel elements', () => {
  const mockRoot = {
    appendChild: vi.fn(),
  } as any;

  attachPanel(mockRoot);

  expect(document.createElement).toHaveBeenCalledWith('div');
  expect(document.createElement).toHaveBeenCalledWith('h3');
  expect(document.createElement).toHaveBeenCalledWith('select');
  expect(mockRoot.appendChild).toHaveBeenCalled();
});

test('attachPanel creates theme options', () => {
  const mockRoot = { appendChild: vi.fn() } as any;

  attachPanel(mockRoot);

  expect(document.createElement).toHaveBeenCalledWith('option');
});
