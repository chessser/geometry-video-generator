import type { Params } from '@/core/params';
import {
  setupPattern,
  finishPattern,
  getChaosOffset,
  getChaosThickness,
  shouldUseChaos,
  getGrowthCycle,
  getFadeAlpha,
  drawElementWithFade,
} from './pattern-base';
import { PATTERN_DEFAULTS } from './pattern-constants';

export function renderFlowerOfLife(
  ctx: CanvasRenderingContext2D,
  params: Params,
  t: number,
  alpha: number = 1,
) {
  const { size, hue, seed } = setupPattern(ctx, params, t, alpha, {
    id: 'flower-of-life',
    ...PATTERN_DEFAULTS,
    hueBase: 0,
  });

  const useDrift = shouldUseChaos(seed, 'drift');
  const useThickness = shouldUseChaos(seed + 1, 'thickness');

  const radius = size * 0.15;
  const growthCycle = getGrowthCycle(t, 0.03);

  function generateFlowerOfLifePositions(maxRings: number) {
    const positions = [[0, 0]]; // Center (Layer 1)

    for (let ring = 2; ring <= maxRings; ring++) {
      const ringRadius = radius * (ring - 1);
      const circlesInRing = (ring - 1) * 6; // Layer 2=6, Layer 3=12, Layer 4=18, etc.

      for (let i = 0; i < circlesInRing; i++) {
        const angle = (i / circlesInRing) * Math.PI * 2;
        const x = Math.cos(angle) * ringRadius;
        const y = Math.sin(angle) * ringRadius;
        positions.push([x, y]);
      }
    }

    return positions;
  }

  const allPositions = generateFlowerOfLifePositions(5);
  const layerCounts = [7, 19, 37, 61];
  const stage = Math.floor(growthCycle * 4);
  const positions = allPositions.slice(
    0,
    layerCounts[stage] || layerCounts[layerCounts.length - 1],
  );

  positions.forEach(([x, y], i) => {
    if (x === undefined || y === undefined) return;

    let finalX = x;
    let finalY = y;

    if (useDrift) {
      const offset = getChaosOffset(t, seed, i, radius * 0.1);
      finalX += offset.x;
      finalY += offset.y;
    }

    if (useThickness) ctx.lineWidth = getChaosThickness(t, seed, i);

    const fadeAlpha = getFadeAlpha(growthCycle, i, [7, 19, 37]);

    drawElementWithFade(
      ctx,
      () => {
        ctx.strokeStyle = `hsl(${(hue + i * 8) % 360}, 75%, 65%)`;
        ctx.beginPath();
        ctx.arc(finalX, finalY, radius, 0, Math.PI * 2);
        ctx.stroke();
      },
      alpha,
      fadeAlpha,
    );
  });

  finishPattern(ctx);
}
