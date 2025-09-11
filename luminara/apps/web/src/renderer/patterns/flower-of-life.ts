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
    moveSpeed: 0.25,
    size: 0.45,
    movementRange: 0.35,
    pulseRate: 0.8,
    rotationRate: 0.3,
    hueBase: 0,
  });

  const useDrift = shouldUseChaos(seed, 'drift');
  const useThickness = shouldUseChaos(seed + 1, 'thickness');

  const radius = size * 0.15;
  const growthCycle = (t * 0.03) % 1;

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

  const allPositions = generateFlowerOfLifePositions(4);

  let numLayers;
  if (growthCycle < 0.25) {
    numLayers = 2; // Center + Layer 2 (7 total)
  } else if (growthCycle < 0.5) {
    numLayers = 3; // + Layer 3 (19 total)
  } else if (growthCycle < 0.75) {
    numLayers = 4; // + Layer 4 (37 total)
  } else {
    numLayers = 5; // + Layer 5 (61 total)
  }

  const positions = allPositions.slice(
    0,
    Math.min(
      allPositions.length,
      numLayers === 2 ? 7 : numLayers === 3 ? 19 : numLayers === 4 ? 37 : 61,
    ),
  );

  positions.forEach(([x, y], i) => {
    let finalX = x;
    let finalY = y;
    let circleAlpha = 1;

    // Fade effect for new rings
    const fadeZone = 0.1;
    const ring2Start = 7;
    const ring3Start = 19;
    const ring4Start = 37;

    if (
      i >= ring2Start &&
      i < ring3Start &&
      growthCycle >= 0.25 - fadeZone &&
      growthCycle < 0.25 + fadeZone
    ) {
      circleAlpha = Math.min(1, (growthCycle - (0.25 - fadeZone)) / (fadeZone * 2));
    } else if (
      i >= ring3Start &&
      i < ring4Start &&
      growthCycle >= 0.5 - fadeZone &&
      growthCycle < 0.5 + fadeZone
    ) {
      circleAlpha = Math.min(1, (growthCycle - (0.5 - fadeZone)) / (fadeZone * 2));
    } else if (i >= ring4Start && growthCycle >= 0.75 - fadeZone && growthCycle < 0.75 + fadeZone) {
      circleAlpha = Math.min(1, (growthCycle - (0.75 - fadeZone)) / (fadeZone * 2));
    }

    if (useDrift) {
      const offset = getChaosOffset(t, seed, i, radius * 0.1);
      finalX += offset.x;
      finalY += offset.y;
    }

    if (useThickness) ctx.lineWidth = getChaosThickness(t, seed, i);
    ctx.globalAlpha = alpha * circleAlpha;
    ctx.strokeStyle = `hsl(${(hue + i * 8) % 360}, 75%, 65%)`;
    ctx.beginPath();
    ctx.arc(finalX, finalY, radius, 0, Math.PI * 2);
    ctx.stroke();
  });

  finishPattern(ctx);
}
