import type { Params } from '@/core/params';
import {
  setupPattern,
  finishPattern,
  getChaosOffset,
  getChaosThickness,
  shouldUseChaos,
} from './pattern-base';
import { PATTERN_DEFAULTS } from './pattern-constants';

export function renderSeedOfLife(
  ctx: CanvasRenderingContext2D,
  params: Params,
  t: number,
  alpha: number = 1,
) {
  const { size, hue, seed } = setupPattern(ctx, params, t, alpha, {
    id: 'seed-of-life',
    ...PATTERN_DEFAULTS,
    hueBase: 120,
  });

  const useDrift = shouldUseChaos(seed, 'drift');
  const useThickness = shouldUseChaos(seed + 1, 'thickness');

  // Seed of Life: 7 equal circles (1 center + 6 surrounding)
  const circleRadius = size * 0.15;
  const positions = [
    [0, 0], // Center circle
  ];

  // 6 surrounding circles positioned for proper overlapping
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const x = Math.cos(angle) * circleRadius;
    const y = Math.sin(angle) * circleRadius;
    positions.push([x, y]);
  }

  positions.forEach(([x, y], i) => {
    if (x === undefined || y === undefined) return;

    let finalX = x;
    let finalY = y;

    if (useDrift) {
      const offset = getChaosOffset(t, seed, i, circleRadius * 0.1);
      finalX += offset.x;
      finalY += offset.y;
    }

    if (useThickness) ctx.lineWidth = getChaosThickness(t, seed, i);
    ctx.strokeStyle = `hsl(${(hue + i * 5) % 360}, 75%, 65%)`;
    ctx.beginPath();
    ctx.arc(finalX, finalY, circleRadius, 0, Math.PI * 2);
    ctx.stroke();
  });

  finishPattern(ctx);
}
