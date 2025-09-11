import { test, expect, vi } from 'vitest';
import { attachPanel } from '../../src';

const mockElements: any = {};

global.document = {
  createElement: vi.fn((tag: string) => {
    const element = {
      style: {},
      textContent: '',
      value: '',
      selected: false,
      appendChild: vi.fn(),
      addEventListener: vi.fn(),
    };
    mockElements[tag] = element;
    return element;
  }),
} as any;

test('attachPanel handles change event without callback', () => {
  const mockRoot = {
    appendChild: vi.fn(),
  };

  attachPanel(mockRoot as any);

  const select = mockElements.select;
  const changeHandler = select.addEventListener.mock.calls.find(
    (call: any) => call[0] === 'change'
  )[1];

  const mockEvent = {
    target: { value: 'flower-of-life' },
  };

  expect(() => changeHandler(mockEvent)).not.toThrow();
});

test('attachPanel calls onThemeChange when provided', () => {
  const mockRoot = {
    appendChild: vi.fn(),
  };
  const onThemeChange = vi.fn();

  attachPanel(mockRoot as any, onThemeChange);

  const select = mockElements.select;
  const changeHandler = select.addEventListener.mock.calls.find(
    (call: any) => call[0] === 'change'
  )[1];

  const mockEvent = {
    target: { value: 'seed-of-life' },
  };

  changeHandler(mockEvent);

  expect(onThemeChange).toHaveBeenCalledWith('seed-of-life');
});