import { test, expect, vi } from 'vitest';

test('main handles missing root element', async () => {
  global.document = {
    getElementById: () => null,
  } as any;

  await expect(async () => {
    await import('@/main');
  }).rejects.toThrow('Root element not found');
});

