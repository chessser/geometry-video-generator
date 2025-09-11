import type { Params } from '@/core/params';
import { setupPattern, finishPattern } from './pattern-base';
import { PATTERN_DEFAULTS } from './pattern-constants';

export function renderSriYantra(
  ctx: CanvasRenderingContext2D,
  params: Params,
  t: number,
  alpha: number = 1,
) {
  const { size, hue } = setupPattern(ctx, params, t, alpha, {
    id: 'sri-yantra',
    ...PATTERN_DEFAULTS,
    hueBase: 300,
  });

  for (let i = 0; i < 9; i++) {
    const scale = 0.3 + i * 0.1 + 0.1 * Math.sin(t * 2 + i);
    const triangleRotation = (i % 2 === 0 ? 0 : Math.PI) + t * 0.1 * (i % 2 === 0 ? 1 : -1);

    ctx.save();
    ctx.rotate(triangleRotation);
    ctx.strokeStyle = `hsl(${(hue + i * 20) % 360}, 90%, 65%)`;

    ctx.beginPath();
    for (let j = 0; j < 3; j++) {
      const angle = (j / 3) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * size * scale;
      const y = Math.sin(angle) * size * scale;
      if (j === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  finishPattern(ctx);
}
