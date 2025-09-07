import type { Params } from '../../core/params';
import {
  setupPattern,
  finishPattern,
  getChaosOffset,
  getChaosThickness,
  shouldUseChaos,
} from './pattern-base';

export function renderPentagram(
  ctx: CanvasRenderingContext2D,
  params: Params,
  t: number,
  alpha: number = 1,
) {
  const { size, seed } = setupPattern(ctx, params, t, alpha, {
    id: 'pentagram',
    moveSpeed: 0.105,
    size: 0.42,
    movementRange: 0.45,
    pulseRate: 0.9,
    rotationRate: 0.18,
    hueBase: 320,
  });

  const useDrift = shouldUseChaos(seed, 'drift');
  const useThickness = shouldUseChaos(seed + 1, 'thickness');

  if (useThickness) ctx.lineWidth = getChaosThickness(t, seed, 0);

  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle1 = (i / 5) * Math.PI * 2 - Math.PI / 2;
    const angle2 = ((i + 2) / 5) * Math.PI * 2 - Math.PI / 2;

    let x1 = Math.cos(angle1) * size;
    let y1 = Math.sin(angle1) * size;
    let x2 = Math.cos(angle2) * size;
    let y2 = Math.sin(angle2) * size;

    if (useDrift) {
      const offset1 = getChaosOffset(t, seed, i, size * 0.15);
      const offset2 = getChaosOffset(t, seed, i + 5, size * 0.15);
      x1 += offset1.x;
      y1 += offset1.y;
      x2 += offset2.x;
      y2 += offset2.y;
    }

    if (i === 0) ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  }
  ctx.closePath();
  ctx.stroke();

  finishPattern(ctx);
}
