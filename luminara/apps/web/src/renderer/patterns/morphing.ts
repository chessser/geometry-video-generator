import type { Params } from '@/core/params';
import { setupPattern, finishPattern } from './pattern-base';

export function renderMorphingPattern(
  ctx: CanvasRenderingContext2D,
  params: Params,
  t: number,
  alpha: number = 1,
) {
  const { size } = setupPattern(ctx, params, t, alpha, {
    id: 'morphing-pattern',
    moveSpeed: 0.08,
    size: 0.4,
    movementRange: 0.3,
    pulseRate: 0.4,
    rotationRate: 0.1,
    hueBase: 270,
  });

  // Morphing cycle: 0-1 over 10 seconds
  const morphCycle = (t * 0.1) % 1;

  if (morphCycle < 0.33) {
    // Circle to Triangle (0-0.33)
    const progress = morphCycle / 0.33;
    renderCircleToTriangle(ctx, size, progress);
  } else if (morphCycle < 0.66) {
    // Triangle to Square (0.33-0.66)
    const progress = (morphCycle - 0.33) / 0.33;
    renderTriangleToSquare(ctx, size, progress);
  } else {
    // Square to Circle (0.66-1.0)
    const progress = (morphCycle - 0.66) / 0.34;
    renderSquareToCircle(ctx, size, progress);
  }

  finishPattern(ctx);
}

function renderCircleToTriangle(ctx: CanvasRenderingContext2D, size: number, progress: number) {
  const points = 32;
  ctx.beginPath();

  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2;

    // Circle radius
    const circleRadius = size;

    // Triangle vertices
    const triAngle = Math.floor(i / (points / 3)) * ((Math.PI * 2) / 3) - Math.PI / 2;
    const triRadius = size / Math.cos(Math.PI / 6);

    // Interpolate between circle and triangle
    const radius = circleRadius * (1 - progress) + triRadius * progress;
    const targetAngle = angle * (1 - progress) + triAngle * progress;

    const x = Math.cos(targetAngle) * radius;
    const y = Math.sin(targetAngle) * radius;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.stroke();
}

function renderTriangleToSquare(ctx: CanvasRenderingContext2D, size: number, progress: number) {
  const points = 32;
  ctx.beginPath();

  for (let i = 0; i <= points; i++) {
    const t = i / points;

    // Triangle point
    const triSide = Math.min(Math.floor(t * 3), 2);
    const triT = (t * 3) % 1;
    const triVertices = [
      [0, -size],
      [size * 0.866, size * 0.5],
      [-size * 0.866, size * 0.5],
    ];
    const triNext = (triSide + 1) % 3;
    const triX = triVertices[triSide][0] * (1 - triT) + triVertices[triNext][0] * triT;
    const triY = triVertices[triSide][1] * (1 - triT) + triVertices[triNext][1] * triT;

    // Square point
    const sqSide = Math.min(Math.floor(t * 4), 3);
    const sqT = (t * 4) % 1;
    const sqVertices = [
      [-size, -size],
      [size, -size],
      [size, size],
      [-size, size],
    ];
    const sqNext = (sqSide + 1) % 4;
    const sqX = sqVertices[sqSide][0] * (1 - sqT) + sqVertices[sqNext][0] * sqT;
    const sqY = sqVertices[sqSide][1] * (1 - sqT) + sqVertices[sqNext][1] * sqT;

    // Interpolate
    const x = triX * (1 - progress) + sqX * progress;
    const y = triY * (1 - progress) + sqY * progress;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.stroke();
}

function renderSquareToCircle(ctx: CanvasRenderingContext2D, size: number, progress: number) {
  const points = 32;
  ctx.beginPath();

  for (let i = 0; i <= points; i++) {
    const t = i / points;

    // Square point
    const sqSide = Math.min(Math.floor(t * 4), 3);
    const sqT = (t * 4) % 1;
    const sqVertices = [
      [-size, -size],
      [size, -size],
      [size, size],
      [-size, size],
    ];
    const sqNext = (sqSide + 1) % 4;
    const sqX = sqVertices[sqSide][0] * (1 - sqT) + sqVertices[sqNext][0] * sqT;
    const sqY = sqVertices[sqSide][1] * (1 - sqT) + sqVertices[sqNext][1] * sqT;

    // Circle point
    const angle = t * Math.PI * 2;
    const circleX = Math.cos(angle) * size;
    const circleY = Math.sin(angle) * size;

    // Interpolate
    const x = sqX * (1 - progress) + circleX * progress;
    const y = sqY * (1 - progress) + circleY * progress;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.stroke();
}
