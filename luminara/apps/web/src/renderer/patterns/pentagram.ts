import type { Params } from '../../core/params';
import { setupPattern, finishPattern } from './pattern-base';

export function renderPentagram(ctx: CanvasRenderingContext2D, params: Params, t: number, alpha: number = 1) {
  const { size } = setupPattern(ctx, params, t, alpha, {
    id: 'pentagram',
    moveSpeed: 0.105,
    size: 0.42,
    movementRange: 0.45,
    pulseRate: 0.9,
    rotationRate: 0.18,
    hueBase: 320
  });
  
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle1 = (i / 5) * Math.PI * 2 - Math.PI / 2;
    const angle2 = ((i + 2) / 5) * Math.PI * 2 - Math.PI / 2;
    
    const x1 = Math.cos(angle1) * size;
    const y1 = Math.sin(angle1) * size;
    const x2 = Math.cos(angle2) * size;
    const y2 = Math.sin(angle2) * size;
    
    if (i === 0) ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  }
  ctx.closePath();
  ctx.stroke();
  
  finishPattern(ctx);
}