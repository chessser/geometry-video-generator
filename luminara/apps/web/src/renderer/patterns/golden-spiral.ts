import type { Params } from '../../core/params';
import { hashToSeed } from '../../core/hash';
import { applyBoundaryBehavior } from '../boundaries';

export function renderGoldenSpiral(
  ctx: CanvasRenderingContext2D,
  params: Params,
  t: number,
  alpha: number = 1,
) {
  const { width, height } = ctx.canvas;
  const seed = hashToSeed('spiral-position');
  const moveSpeed = 0.12 + (seed % 70) / 1300;
  const rawX = width / 2 + width * 0.4 * Math.sin(t * moveSpeed * 0.7);
  const rawY = height / 2 + height * 0.35 * Math.cos(t * moveSpeed);

  const size = Math.min(width, height) * 0.28 * params.scale;
  const boundary = applyBoundaryBehavior(rawX, rawY, width, height, size * 2, 'golden-spiral');
  const centerX = boundary.x;
  const centerY = boundary.y;
  alpha *= boundary.alpha;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(centerX, centerY);
  ctx.rotate(t * 0.04);

  const hue = (t * 35 + 45) % 360;
  ctx.strokeStyle = `hsl(${hue}, 85%, 60%)`;
  ctx.lineWidth = 4 + 8 * Math.sin(t * 0.5);

  const phi = 1.618;
  ctx.beginPath();
  for (let i = 0; i < 100; i++) {
    const angle = i * 0.2;
    const radius = size * 0.02 * Math.pow(phi, angle * 0.1);

    // Add spiral point drift
    const driftX = radius * 0.3 * Math.sin(t * 0.3 + i * 0.1);
    const driftY = radius * 0.25 * Math.cos(t * 0.4 + i * 0.12);

    const x = Math.cos(angle) * radius + driftX;
    const y = Math.sin(angle) * radius + driftY;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.restore();
}
