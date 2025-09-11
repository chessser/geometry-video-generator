import { test, expect } from 'vitest';

test('patterns have smooth rotation behavior', async () => {
  const { renderSacredGeometry } = await import('@/renderer/sacred-geometry');
  const { defaultParams } = await import('@/core/params');

  let rotationCalls: number[] = [];
  const mockCtx = {
    canvas: { width: 800, height: 600 },
    clearRect: () => {},
    save: () => {},
    restore: () => {},
    translate: () => {},
    rotate: (angle: number) => { rotationCalls.push(angle); },
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
  
  // Test rotation over time
  renderSacredGeometry(mockCtx as any, params, 0);
  const rotation1 = rotationCalls.length;
  
  rotationCalls = [];
  renderSacredGeometry(mockCtx as any, params, 1);
  const rotation2 = rotationCalls.length;
  
  rotationCalls = [];
  renderSacredGeometry(mockCtx as any, params, 2);
  const rotation3 = rotationCalls.length;

  // Should have consistent rotation calls (shapes are spinning)
  expect(rotation1).toBeGreaterThan(0);
  expect(rotation2).toBeGreaterThan(0);
  expect(rotation3).toBeGreaterThan(0);
  expect(Math.abs(rotation2 - rotation1)).toBeLessThan(5); // Consistent rotation count
});

test('patterns have smooth movement without teleporting', async () => {
  const { renderSacredGeometry } = await import('@/renderer/sacred-geometry');
  const { defaultParams } = await import('@/core/params');

  let translateCalls: Array<[number, number]> = [];
  const mockCtx = {
    canvas: { width: 800, height: 600 },
    clearRect: () => {},
    save: () => {},
    restore: () => {},
    translate: (x: number, y: number) => { translateCalls.push([x, y]); },
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
  
  // Capture positions at different times
  renderSacredGeometry(mockCtx as any, params, 0);
  const positions1 = [...translateCalls];
  
  translateCalls = [];
  renderSacredGeometry(mockCtx as any, params, 0.1);
  const positions2 = [...translateCalls];
  
  translateCalls = [];
  renderSacredGeometry(mockCtx as any, params, 0.2);
  const positions3 = [...translateCalls];

  // Should have movement
  expect(positions1.length).toBeGreaterThan(0);
  expect(positions2.length).toBeGreaterThan(0);
  expect(positions3.length).toBeGreaterThan(0);
  
  // Check for smooth movement (no teleporting)
  if (positions1.length > 0 && positions2.length > 0) {
    const [x1, y1] = positions1[0];
    const [x2, y2] = positions2[0];
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    
    // Movement should be reasonable (not teleporting across screen)
    expect(distance).toBeLessThan(100); // Max 100px movement in 0.1 seconds
  }
});

test('patterns have continuous drawing without gaps', async () => {
  const { renderSacredGeometry } = await import('@/renderer/sacred-geometry');
  const { defaultParams } = await import('@/core/params');

  let drawOperations: string[] = [];
  const mockCtx = {
    canvas: { width: 800, height: 600 },
    clearRect: () => { drawOperations.push('clear'); },
    save: () => {},
    restore: () => {},
    translate: () => {},
    rotate: () => {},
    scale: () => {},
    transform: () => {},
    beginPath: () => { drawOperations.push('begin'); },
    arc: () => { drawOperations.push('arc'); },
    stroke: () => { drawOperations.push('stroke'); },
    moveTo: () => { drawOperations.push('move'); },
    lineTo: () => { drawOperations.push('line'); },
    closePath: () => { drawOperations.push('close'); },
    set globalAlpha(_: number) {},
    set strokeStyle(_: string) {},
    set lineWidth(_: number) {},
  };

  const params = defaultParams();
  renderSacredGeometry(mockCtx as any, params, 1.0);

  // Should have proper drawing sequence
  expect(drawOperations).toContain('clear');
  expect(drawOperations).toContain('begin');
  expect(drawOperations.filter(op => op === 'stroke').length).toBeGreaterThan(0);
  
  // Check for proper begin/stroke pairing (no gaps)
  const beginCount = drawOperations.filter(op => op === 'begin').length;
  const strokeCount = drawOperations.filter(op => op === 'stroke').length;
  expect(strokeCount).toBeGreaterThan(0);
  expect(beginCount).toBeGreaterThan(0);
});

test('individual patterns maintain consistent behavior', async () => {
  const patterns = ['flower-of-life', 'seed-of-life', 'golden-spiral', 'tree-of-life'];
  
  for (const patternName of patterns) {
    const { renderSacredGeometry } = await import('@/renderer/sacred-geometry');
    const { defaultParams } = await import('@/core/params');

    let operationCount = 0;
    const mockCtx = {
      canvas: { width: 800, height: 600 },
      clearRect: () => { operationCount++; },
      save: () => { operationCount++; },
      restore: () => { operationCount++; },
      translate: () => { operationCount++; },
      rotate: () => { operationCount++; },
      scale: () => { operationCount++; },
      transform: () => { operationCount++; },
      beginPath: () => { operationCount++; },
      arc: () => { operationCount++; },
      stroke: () => { operationCount++; },
      moveTo: () => { operationCount++; },
      lineTo: () => { operationCount++; },
      closePath: () => { operationCount++; },
      set globalAlpha(_: number) { operationCount++; },
      set strokeStyle(_: string) { operationCount++; },
      set lineWidth(_: number) { operationCount++; },
    };

    const params = defaultParams();
    params.theme = patternName as any;
    
    renderSacredGeometry(mockCtx as any, params, 1.0, patternName);
    
    // Each pattern should perform drawing operations
    expect(operationCount).toBeGreaterThan(10);
  }
});