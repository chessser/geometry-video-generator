import type { Params } from '../../core/params';
import { hashToSeed } from '../../core/hash';
import { applyBoundaryBehavior } from '../boundaries';

export function renderPentagram(ctx: CanvasRenderingContext2D, params: Params, t: number, alpha: number = 1) {
  const { width, height } = ctx.canvas;
  const seed = hashToSeed('pentagram-position');
  const moveSpeed = 0.105 + (seed % 75) / 1500;
  const rawX = width / 2 + (width * 0.36) * Math.cos(t * moveSpeed * 0.9);
  const rawY = height / 2 + (height * 0.34) * Math.sin(t * moveSpeed * 0.7);
  
  const size = Math.min(width, height) * 0.25 * params.scale;
  const boundary = applyBoundaryBehavior(rawX, rawY, width, height, size * 2, 'pentagram');
  const centerX = boundary.x;
  const centerY = boundary.y;
  alpha *= boundary.alpha;
  
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(centerX, centerY);
  ctx.rotate(t * 0.06);
  
  const hue = (t * 45 + 320) % 360;
  ctx.strokeStyle = `hsl(${hue}, 85%, 65%)`;
  ctx.lineWidth = 1.8 + 0.7 * Math.sin(t * 0.5);
  
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
  
  ctx.restore();
}