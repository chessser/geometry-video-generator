import type { Params } from '../../core/params';
import { hashToSeed } from '../../core/hash';
import { applyBoundaryBehavior } from '../boundaries';
import { getChaosOffset, getChaosThickness, shouldUseChaos } from './pattern-base';

export function renderHexagram(
  ctx: CanvasRenderingContext2D,
  params: Params,
  t: number,
  alpha: number = 1,
) {
  const { width, height } = ctx.canvas;
  const seed = hashToSeed('hexagram-position');
  const moveSpeed = 0.11 + (seed % 90) / 1600;
  const rawX = width / 2 + width * 0.38 * Math.sin(t * moveSpeed * 0.6);
  const rawY = height / 2 + height * 0.32 * Math.cos(t * moveSpeed * 1.1);

  const size = Math.min(width, height) * 0.24 * params.scale;
  const boundary = applyBoundaryBehavior(rawX, rawY, width, height, size * 2, 'hexagram');
  const centerX = boundary.x;
  const centerY = boundary.y;
  alpha *= boundary.alpha;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(centerX, centerY);
  ctx.rotate(t * 0.07);

  const hue = (t * 50 + 200) % 360;
  ctx.strokeStyle = `hsl(${hue}, 80%, 70%)`;
  const useDrift = shouldUseChaos(seed, 'drift');
  const useThickness = shouldUseChaos(seed + 1, 'thickness');

  for (let tri = 0; tri < 2; tri++) {
    ctx.save();
    ctx.rotate(tri * Math.PI);

    if (useThickness) ctx.lineWidth = getChaosThickness(t, seed, tri);

    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;

      let x = Math.cos(angle) * size;
      let y = Math.sin(angle) * size;

      if (useDrift) {
        const offset = getChaosOffset(t, seed, i + tri * 3, size * 0.2);
        x += offset.x;
        y += offset.y;
      }

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}
