import type { Params } from '../../core/params';
import {
  setupPattern,
  finishPattern,
  getChaosOffset,
  getChaosThickness,
  shouldUseChaos,
} from './pattern-base';

export function renderFlowerOfLife(
  ctx: CanvasRenderingContext2D,
  params: Params,
  t: number,
  alpha: number = 1,
) {
  const { size, hue, seed } = setupPattern(ctx, params, t, alpha, {
    id: 'flower-of-life',
    moveSpeed: 0.15,
    size: 0.45,
    movementRange: 0.35,
    pulseRate: 0.8,
    rotationRate: 0.12,
    hueBase: 0,
  });

  const useDrift = shouldUseChaos(seed, 'drift');
  const useThickness = shouldUseChaos(seed + 1, 'thickness');

  // Center circle
  if (useThickness) ctx.lineWidth = getChaosThickness(t, seed, 0);
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
  ctx.stroke();

  // Surrounding circles
  for (let i = 0; i < params.symmetry; i++) {
    const angle = (i / params.symmetry) * Math.PI * 2;
    const distance = size * 0.6;

    let x = Math.cos(angle) * distance;
    let y = Math.sin(angle) * distance;

    if (useDrift) {
      const offset = getChaosOffset(t, seed, i, size * 0.2);
      x += offset.x;
      y += offset.y;
    }

    if (useThickness) ctx.lineWidth = getChaosThickness(t, seed, i + 1);
    ctx.strokeStyle = `hsl(${(hue + i * 15) % 360}, 75%, 65%)`;
    ctx.beginPath();
    ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
    ctx.stroke();
  }

  finishPattern(ctx);
}
