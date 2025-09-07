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

  const evolution = (t * 0.06) % 1;
  let sides, skipPattern;

  if (evolution < 0.33) {
    sides = 5;
    skipPattern = 2;
  } else if (evolution < 0.66) {
    sides = 6;
    skipPattern = 2;
  } else {
    sides = 8;
    skipPattern = 3;
  }

  if (useThickness) ctx.lineWidth = getChaosThickness(t, seed, 0);

  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle1 = (i / sides) * Math.PI * 2 - Math.PI / 2;
    const angle2 = ((i + skipPattern) / sides) * Math.PI * 2 - Math.PI / 2;

    let x1 = Math.cos(angle1) * size;
    let y1 = Math.sin(angle1) * size;
    let x2 = Math.cos(angle2) * size;
    let y2 = Math.sin(angle2) * size;

    if (useDrift) {
      const offset1 = getChaosOffset(t, seed, i, size * 0.1);
      const offset2 = getChaosOffset(t, seed, i + sides, size * 0.1);
      x1 += offset1.x;
      y1 += offset1.y;
      x2 += offset2.x;
      y2 += offset2.y;
    }

    if (i === 0) ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  }
  ctx.stroke();

  if (evolution > 0.2) {
    const innerAlpha = Math.min(1, (evolution - 0.2) * 2);
    const currentAlpha = ctx.globalAlpha;
    ctx.globalAlpha = currentAlpha * innerAlpha;

    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
      const innerRadius = size * 0.4;

      let x = Math.cos(angle) * innerRadius;
      let y = Math.sin(angle) * innerRadius;

      if (useDrift) {
        const offset = getChaosOffset(t, seed, i + sides * 2, size * 0.05);
        x += offset.x;
        y += offset.y;
      }

      ctx.beginPath();
      ctx.arc(x, y, size * 0.08, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = currentAlpha;
  }

  finishPattern(ctx);
}
