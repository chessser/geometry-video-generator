import type { Params } from '../../core/params';
import { setupPattern, finishPattern } from './pattern-base';

export function renderFlowerOfLife(ctx: CanvasRenderingContext2D, params: Params, t: number, alpha: number = 1) {
  const { size, hue } = setupPattern(ctx, params, t, alpha, {
    id: 'flower-of-life',
    moveSpeed: 0.15,
    size: 0.45,
    movementRange: 0.35,
    pulseRate: 0.8,
    rotationRate: 0.12,
    hueBase: 0
  });
  
  // Center circle
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
  ctx.stroke();
  
  // Surrounding circles
  for (let i = 0; i < params.symmetry; i++) {
    const angle = (i / params.symmetry) * Math.PI * 2;
    const distance = size * 0.6;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    
    ctx.strokeStyle = `hsl(${(hue + i * 15) % 360}, 75%, 65%)`;
    ctx.beginPath();
    ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  finishPattern(ctx);
}