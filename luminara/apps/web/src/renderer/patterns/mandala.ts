import type { Params } from '../../core/params';
import { hashToSeed } from '../../core/hash';
import { applyBoundaryBehavior } from '../boundaries';
import { getChaosOffset, getChaosThickness, shouldUseChaos } from './pattern-base';

export function renderMandala(
  ctx: CanvasRenderingContext2D,
  params: Params,
  t: number,
  alpha: number = 1,
) {
  const { width, height } = ctx.canvas;
  const seed = hashToSeed('mandala-position');
  const moveSpeed = 0.12 + (seed % 50) / 1500;
  const rawX = width / 2 + width * 0.4 * Math.cos(t * moveSpeed * 1.1);
  const rawY = height / 2 + height * 0.4 * Math.sin(t * moveSpeed * 0.8);

  const radius = Math.min(width, height) * 0.38 * params.scale;
  const boundary = applyBoundaryBehavior(rawX, rawY, width, height, radius * 2, 'mandala');
  const centerX = boundary.x;
  const centerY = boundary.y;
  alpha *= boundary.alpha;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(centerX, centerY);
  ctx.rotate(t * 0.03);

  const hue = (t * 40 + 270) % 360;
  ctx.strokeStyle = `hsl(${hue}, 90%, 65%)`;
  const useDrift = shouldUseChaos(seed, 'drift');
  const useThickness = shouldUseChaos(seed + 1, 'thickness');

  for (let ring = 1; ring <= 4; ring++) {
    const ringRadius = radius * ring * 0.2;
    const petals = ring * 6;

    if (useThickness) ctx.lineWidth = getChaosThickness(t, seed, ring);

    for (let i = 0; i < petals; i++) {
      const angle = (i / petals) * Math.PI * 2;
      const petalSize = ringRadius * 0.3;

      let x = Math.cos(angle) * ringRadius;
      let y = Math.sin(angle) * ringRadius;

      if (useDrift) {
        const offset = getChaosOffset(t, seed, i + ring * 10, radius * 0.15);
        x += offset.x;
        y += offset.y;
      }

      ctx.beginPath();
      ctx.arc(x, y, petalSize * (0.7 + 0.3 * Math.sin(t * 0.4 + i)), 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  ctx.restore();
}
