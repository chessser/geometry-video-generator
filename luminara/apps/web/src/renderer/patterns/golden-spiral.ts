import type { Params } from '../../core/params';
import {
  setupPattern,
  finishPattern,
  getChaosOffset,
  getChaosThickness,
  shouldUseChaos,
} from './pattern-base';

export function renderGoldenSpiral(
  ctx: CanvasRenderingContext2D,
  params: Params,
  t: number,
  alpha: number = 1,
) {
  const { size, seed } = setupPattern(ctx, params, t, alpha, {
    id: 'golden-spiral',
    moveSpeed: 0.12,
    size: 0.28,
    movementRange: 0.35,
    pulseRate: 0.5,
    rotationRate: 0.04,
    hueBase: 45,
  });

  const useDrift = shouldUseChaos(seed, 'drift');
  const useThickness = shouldUseChaos(seed + 1, 'thickness');

  const phi = 1.618;
  const evolution = (t * 0.08) % 1;
  const numArms = Math.floor(1 + evolution * 3);
  const maxPoints = Math.floor(60 + evolution * 80);

  for (let arm = 0; arm < numArms; arm++) {
    const armOffset = (arm / numArms) * Math.PI * 2;

    ctx.beginPath();
    for (let i = 0; i < maxPoints; i++) {
      const angle = i * 0.15 + armOffset;
      const radius = size * 0.015 * Math.pow(phi, angle * 0.08);

      const thicknessFactor = 0.5 + (i / maxPoints) * 1.5;
      if (useThickness) {
        ctx.lineWidth = getChaosThickness(t, seed, i) * thicknessFactor;
      } else {
        ctx.lineWidth = thicknessFactor * (0.8 + 0.4 * Math.sin(t * 0.5 + arm));
      }

      let x = Math.cos(angle) * radius;
      let y = Math.sin(angle) * radius;

      if (useDrift) {
        const offset = getChaosOffset(t, seed, i + arm * 100, radius * 0.1);
        x += offset.x;
        y += offset.y;
      }

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);

      if (i > 0 && i % 8 === 0) {
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    }
    ctx.stroke();
  }

  finishPattern(ctx);
}
