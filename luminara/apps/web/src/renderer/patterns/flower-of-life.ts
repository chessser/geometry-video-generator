import type { Params } from '../../core/params';
import { hashToSeed } from '../../core/hash';
import { applyBoundaryBehavior } from '../boundaries';

export function renderFlowerOfLife(ctx: CanvasRenderingContext2D, params: Params, t: number, alpha: number = 1) {
  const { width, height } = ctx.canvas;
  const seed = hashToSeed('flower-position');
  const moveSpeed = 0.15 + (seed % 100) / 1500;
  const startX = (seed % 3) * width / 3;
  const startY = ((seed * 7) % 3) * height / 3;
  const rawX = startX + (width - startX) * (0.5 + 0.3 * Math.sin(t * moveSpeed));
  const rawY = startY + (height - startY) * (0.5 + 0.3 * Math.cos(t * moveSpeed * 0.8));
  
  const pulse = 0.8 + 0.3 * Math.sin(t * (0.6 + seed % 3 * 0.1));
  const breathe = 0.9 + 0.2 * Math.sin(t * (0.8 + (seed * 3) % 4 * 0.1));
  const baseRadius = Math.min(width, height) * 0.35 * params.scale * pulse * breathe;
  
  const boundary = applyBoundaryBehavior(rawX, rawY, width, height, baseRadius * 2, 'flower-of-life');
  const centerX = boundary.x;
  const centerY = boundary.y;
  alpha *= boundary.alpha;
  
  const lineThickness = 1.5 + 2 * (0.5 + 0.5 * Math.sin(t * (0.3 + seed % 2 * 0.1)));
  const rotation = t * (0.06 + (seed % 50) / 1000) + params.angle;
  const skew = 0.1 * Math.sin(t * (0.25 + seed % 3 * 0.05));
  
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);
  ctx.scale(1 + skew * 0.3, 1 - skew * 0.2);
  
  const hue = (t * 40 + params.angle * 57.3) % 360;
  ctx.strokeStyle = `hsl(${hue}, 75%, 65%)`;
  ctx.lineWidth = lineThickness;
  
  // Center circle
  const centerPulse = 0.9 + 0.2 * Math.sin(t * 0.7);
  ctx.beginPath();
  ctx.arc(0, 0, baseRadius * centerPulse, 0, Math.PI * 2);
  ctx.stroke();
  
  // Surrounding circles
  for (let i = 0; i < params.symmetry; i++) {
    const angle = (i / params.symmetry) * Math.PI * 2;
    const individualPulse = 0.85 + 0.15 * Math.sin(t * 0.6 + i * 0.3);
    const distance = baseRadius * (1.1 + 0.1 * Math.sin(t * 0.25 + i));
    
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    
    ctx.lineWidth = lineThickness * (0.8 + 0.2 * Math.sin(t * 0.5 + i));
    ctx.strokeStyle = `hsl(${(hue + i * 15) % 360}, 75%, 65%)`;
    
    ctx.beginPath();
    ctx.arc(x, y, baseRadius * individualPulse, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  ctx.restore();
}