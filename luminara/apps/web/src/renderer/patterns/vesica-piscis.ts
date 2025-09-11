import type { Params } from '@/core/params';
import {
  setupPattern,
  finishPattern,
  getChaosOffset,
  getChaosThickness,
  shouldUseChaos,
} from './pattern-base';
import { PATTERN_DEFAULTS } from './pattern-constants';

export function renderVesicaPiscis(
  ctx: CanvasRenderingContext2D,
  params: Params,
  t: number,
  alpha: number = 1,
) {
  const { size, seed } = setupPattern(ctx, params, t, alpha, {
    id: 'vesica-piscis',
    ...PATTERN_DEFAULTS,
    hueBase: 180,
  });

  const useDrift = shouldUseChaos(seed, 'drift');
  const useThickness = shouldUseChaos(seed + 1, 'thickness');

  const evolution = (t * 0.07) % 1;
  const numCircles = Math.floor(2 + evolution * 5);
  const overlap = size * (0.2 + evolution * 0.3);

  for (let i = 0; i < numCircles; i++) {
    let x, y;

    if (numCircles === 2) {
      x = i === 0 ? -overlap : overlap;
      y = 0;
    } else {
      const angle = (i / numCircles) * Math.PI * 2;
      const radius = overlap * (1 + evolution * 0.5);
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * radius;
    }

    if (useDrift) {
      const offset = getChaosOffset(t, seed, i, size * 0.15);
      x += offset.x;
      y += offset.y;
    }

    if (useThickness) ctx.lineWidth = getChaosThickness(t, seed, i);

    const circleSize = size * (0.8 + 0.3 * Math.sin(t * 0.5 + i));

    ctx.beginPath();
    ctx.arc(x, y, circleSize, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (evolution > 0.4 && numCircles > 2) {
    const lineAlpha = Math.min(1, (evolution - 0.4) * 2);
    const currentAlpha = ctx.globalAlpha;
    ctx.globalAlpha = currentAlpha * lineAlpha * 0.6;

    for (let i = 0; i < numCircles; i++) {
      const angle1 = (i / numCircles) * Math.PI * 2;
      const angle2 = (((i + 1) % numCircles) / numCircles) * Math.PI * 2;
      const radius = overlap * (1 + evolution * 0.5);

      let x1 = Math.cos(angle1) * radius;
      let y1 = Math.sin(angle1) * radius;
      let x2 = Math.cos(angle2) * radius;
      let y2 = Math.sin(angle2) * radius;

      if (useDrift) {
        const offset1 = getChaosOffset(t, seed, i + numCircles, size * 0.1);
        const offset2 = getChaosOffset(t, seed, ((i + 1) % numCircles) + numCircles, size * 0.1);
        x1 += offset1.x;
        y1 += offset1.y;
        x2 += offset2.x;
        y2 += offset2.y;
      }

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.globalAlpha = currentAlpha;
  }

  finishPattern(ctx);
}
