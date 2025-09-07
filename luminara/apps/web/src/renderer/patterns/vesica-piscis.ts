import type { Params } from '../../core/params';
import { hashToSeed } from '../../core/hash';
import { applyBoundaryBehavior } from '../boundaries';

export function renderVesicaPiscis(ctx: CanvasRenderingContext2D, params: Params, t: number, alpha: number = 1) {
  const { width, height } = ctx.canvas;
  const seed = hashToSeed('vesica-position');
  const moveSpeed = 0.13 + (seed % 80) / 1100;
  const rawX = width / 2 + (width * 0.3) * Math.sin(t * moveSpeed);
  const rawY = height / 2 + (height * 0.25) * Math.cos(t * moveSpeed * 0.9);
  
  const radius = Math.min(width, height) * 0.25 * params.scale;
  const boundary = applyBoundaryBehavior(rawX, rawY, width, height, radius * 2, 'vesica-piscis');
  const centerX = boundary.x;
  const centerY = boundary.y;
  alpha *= boundary.alpha;
  
  const pulse = 0.85 + 0.25 * Math.sin(t * 0.5);
  const finalRadius = radius * pulse;
  const overlap = finalRadius * 0.6;
  
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(centerX, centerY);
  ctx.rotate(t * 0.08);
  
  const hue = (t * 25 + 180) % 360;
  ctx.strokeStyle = `hsl(${hue}, 80%, 70%)`;
  ctx.lineWidth = 2 + Math.sin(t * 0.4);
  
  // Two intersecting circles
  ctx.beginPath();
  ctx.arc(-overlap/2, 0, finalRadius, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(overlap/2, 0, finalRadius, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.restore();
}