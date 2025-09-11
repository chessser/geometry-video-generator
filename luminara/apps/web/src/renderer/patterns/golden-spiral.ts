import type { Params } from '@/core/params';
import {
  setupPattern,
  finishPattern,
  getChaosOffset,
  getChaosThickness,
  shouldUseChaos,
} from './pattern-base';
import { PATTERN_DEFAULTS } from './pattern-constants';

export function renderGoldenSpiral(
  ctx: CanvasRenderingContext2D,
  params: Params,
  t: number,
  alpha: number = 1,
) {
  const { size, seed } = setupPattern(ctx, params, t, alpha, {
    id: 'golden-spiral',
    ...PATTERN_DEFAULTS,
    hueBase: 45,
  });

  const useDrift = shouldUseChaos(seed, 'drift');
  const useThickness = shouldUseChaos(seed + 1, 'thickness');

  const phi = 1.618;
  const spiralTime = t * 0.008; // Slower growth
  const maxPoints = 200;

  ctx.beginPath();
  for (let i = 0; i < maxPoints; i++) {
    const angle = i * 0.2 + spiralTime;
    const radius = size * 0.01 * Math.pow(phi, angle * 0.15);

    const thicknessFactor = 0.3 + (i / maxPoints) * 0.7; // Thinner lines
    if (useThickness) {
      ctx.lineWidth = getChaosThickness(t, seed, i) * thicknessFactor * 0.5;
    } else {
      ctx.lineWidth = thicknessFactor;
    }

    let x = Math.cos(angle) * radius;
    let y = Math.sin(angle) * radius;

    if (useDrift) {
      const offset = getChaosOffset(t, seed, i, radius * 0.1);
      x += offset.x;
      y += offset.y;
    }

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  finishPattern(ctx);
}
