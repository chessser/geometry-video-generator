import type { Params } from '@/core/params';
import { setupPattern, finishPattern } from './pattern-base';
import { PATTERN_DEFAULTS } from './pattern-constants';

export function renderMetatronsCube(
  ctx: CanvasRenderingContext2D,
  params: Params,
  t: number,
  alpha: number = 1,
) {
  const { size, hue } = setupPattern(ctx, params, t, alpha, {
    id: 'metatrons-cube',
    ...PATTERN_DEFAULTS,
    moveSpeed: 0.14,
    movementRange: 0.25,
    movementType: 'circular',
    hueBase: 240,
  });

  const positions = [
    [0, 0],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [0.5, 0.866],
    [-0.5, 0.866],
    [0.5, -0.866],
    [-0.5, -0.866],
    [1.5, 0.866],
    [-1.5, 0.866],
    [1.5, -0.866],
    [-1.5, -0.866],
  ];

  ctx.strokeStyle = `hsl(${hue}, 85%, 60%)`;
  positions.forEach(([x, y], i) => {
    if (x === undefined || y === undefined) return;

    const circleRadius = size * 0.15 * (0.8 + 0.4 * Math.sin(t * 2 + i * 0.3));
    ctx.beginPath();
    ctx.arc(x * size * 0.4, y * size * 0.4, circleRadius, 0, Math.PI * 2);
    ctx.stroke();
  });

  ctx.lineWidth = 1;
  positions.forEach(([x1, y1], i) => {
    if (x1 === undefined || y1 === undefined) return;

    positions.slice(i + 1).forEach(([x2, y2]) => {
      if (x2 === undefined || y2 === undefined) return;

      ctx.beginPath();
      ctx.moveTo(x1 * size * 0.4, y1 * size * 0.4);
      ctx.lineTo(x2 * size * 0.4, y2 * size * 0.4);
      ctx.stroke();
    });
  });

  finishPattern(ctx);
}
