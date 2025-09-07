import type { Params } from '../../core/params';
import {
  setupPattern,
  finishPattern,
  getChaosOffset,
  getChaosThickness,
  shouldUseChaos,
} from './pattern-base';

export function renderVesicaPiscis(
  ctx: CanvasRenderingContext2D,
  params: Params,
  t: number,
  alpha: number = 1,
) {
  const { size, seed } = setupPattern(ctx, params, t, alpha, {
    id: 'vesica-piscis',
    moveSpeed: 0.13,
    size: 0.4,
    movementRange: 0.4,
    pulseRate: 0.7,
    rotationRate: 0.15,
    hueBase: 180,
  });

  const useDrift = shouldUseChaos(seed, 'drift');
  const useThickness = shouldUseChaos(seed + 1, 'thickness');
  const overlap = size * 0.3;

  // Two intersecting circles
  for (let i = 0; i < 2; i++) {
    let x = i === 0 ? -overlap : overlap;
    let y = 0;

    if (useDrift) {
      const offset = getChaosOffset(t, seed, i, size * 0.25);
      x += offset.x;
      y += offset.y;
    }

    if (useThickness) ctx.lineWidth = getChaosThickness(t, seed, i);

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.stroke();
  }

  finishPattern(ctx);
}
