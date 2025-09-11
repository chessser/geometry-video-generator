import type { Params } from '@/core/params';
import { setupPattern, finishPattern } from './pattern-base';
import { PATTERN_DEFAULTS } from './pattern-constants';

export function renderTreeOfLife(
  ctx: CanvasRenderingContext2D,
  params: Params,
  t: number,
  alpha: number = 1,
) {
  const { size, hue } = setupPattern(ctx, params, t, alpha, {
    id: 'tree-of-life',
    ...PATTERN_DEFAULTS,
    hueBase: 60,
  });

  const sephirot = [
    [0, -size * 0.9], // 0: Kether (Crown)
    [-size * 0.35, -size * 0.5], // 1: Chokmah (Wisdom)
    [size * 0.35, -size * 0.5], // 2: Binah (Understanding)
    [-size * 0.35, -size * 0.1], // 3: Chesed (Mercy)
    [size * 0.35, -size * 0.1], // 4: Geburah (Severity)
    [0, -size * 0.1], // 5: Tiphereth (Beauty)
    [-size * 0.35, size * 0.3], // 6: Netzach (Victory)
    [size * 0.35, size * 0.3], // 7: Hod (Glory)
    [0, size * 0.3], // 8: Yesod (Foundation)
    [0, size * 0.7], // 9: Malkuth (Kingdom)
  ];

  ctx.strokeStyle = `hsl(${hue}, 75%, 65%)`;
  sephirot.forEach(([x, y], i) => {
    if (x === undefined || y === undefined) return;

    const circleSize = size * 0.08 * (0.8 + 0.4 * Math.sin(t * 0.3 + i));
    ctx.beginPath();
    ctx.arc(x, y, circleSize, 0, Math.PI * 2);
    ctx.stroke();
  });

  const connections = [
    [0, 1],
    [0, 2],
    [0, 5], // Kether connections
    [1, 2],
    [1, 3],
    [1, 5], // Chokmah connections
    [2, 4],
    [2, 5], // Binah connections
    [3, 4],
    [3, 5],
    [3, 6], // Chesed connections
    [4, 5],
    [4, 7], // Geburah connections
    [5, 6],
    [5, 7],
    [5, 8],
    [5, 9], // Tiphereth connections
    [6, 7],
    [6, 8],
    [6, 9], // Netzach connections
    [7, 8],
    [7, 9], // Hod connections
    [8, 9], // Yesod to Malkuth
  ];
  connections.forEach(([a, b]) => {
    if (a === undefined || b === undefined) return;
    const pointA = sephirot[a];
    const pointB = sephirot[b];
    if (
      !pointA ||
      !pointB ||
      pointA[0] === undefined ||
      pointA[1] === undefined ||
      pointB[0] === undefined ||
      pointB[1] === undefined
    )
      return;

    ctx.beginPath();
    ctx.moveTo(pointA[0], pointA[1]);
    ctx.lineTo(pointB[0], pointB[1]);
    ctx.stroke();
  });

  finishPattern(ctx);
}
