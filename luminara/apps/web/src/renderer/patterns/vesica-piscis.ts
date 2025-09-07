import type { Params } from '../../core/params';
import { setupPattern, finishPattern } from './pattern-base';

export function renderVesicaPiscis(ctx: CanvasRenderingContext2D, params: Params, t: number, alpha: number = 1) {
  const { size } = setupPattern(ctx, params, t, alpha, {
    id: 'vesica-piscis',
    moveSpeed: 0.13,
    size: 0.4,
    movementRange: 0.4,
    pulseRate: 0.7,
    rotationRate: 0.15,
    hueBase: 180
  });
  
  const overlap = size * 0.3;
  
  // Two intersecting circles
  ctx.beginPath();
  ctx.arc(-overlap, 0, size, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(overlap, 0, size, 0, Math.PI * 2);
  ctx.stroke();
  
  finishPattern(ctx);
}