import type { Params } from '../../core/params';
import { hashToSeed } from '../../core/hash';
import { applyBoundaryBehavior } from '../boundaries';

export function renderSeedOfLife(ctx: CanvasRenderingContext2D, params: Params, t: number, alpha: number = 1) {
  const { width, height } = ctx.canvas;
  const positionSeed = hashToSeed('seed-position');
  const moveSpeed = 0.12 + (positionSeed % 80) / 1200;
  const startX = ((positionSeed * 3) % 4) * width / 4;
  const startY = ((positionSeed * 5) % 4) * height / 4;
  const rawX = startX + (width - startX) * (0.5 + 0.4 * Math.cos(t * moveSpeed));
  const rawY = startY + (height - startY) * (0.5 + 0.4 * Math.sin(t * moveSpeed * 1.2));
  
  const seed = hashToSeed('seed-of-life');
  const radius = Math.min(width, height) * 0.28 * params.scale;
  const boundary = applyBoundaryBehavior(rawX, rawY, width, height, radius * 2, 'seed-of-life');
  const centerX = boundary.x;
  const centerY = boundary.y;
  alpha *= boundary.alpha;
  
  const pulse1 = 0.7 + 0.5 * Math.sin(t * (1.5 + seed % 2));
  const pulse2 = 0.8 + 0.4 * Math.sin(t * (2.2 + (seed * 7) % 3));
  const finalRadius = radius * pulse1;
  const rotation = t * (0.15 + (seed % 100) / 1000) + params.angle;
  const wobble = 0.1 * Math.sin(t * (3 + seed % 4));
  
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(centerX + wobble * 20, centerY + wobble * 15);
  ctx.rotate(rotation);
  ctx.scale(1 + wobble * 0.2, 1 - wobble * 0.1);
  
  const hue = (t * (45 + seed % 30) + 120) % 360;
  ctx.strokeStyle = `hsl(${hue}, ${70 + (seed % 20)}%, ${60 + (seed % 25)}%)`;
  ctx.lineWidth = 1.5 + 2.5 * Math.sin(t * (1.8 + seed % 3)) * pulse2;
  
  // Center with breathing
  const centerRadius = finalRadius * (0.9 + 0.3 * Math.sin(t * (2.5 + seed % 2)));
  ctx.beginPath();
  ctx.arc(0, 0, centerRadius, 0, Math.PI * 2);
  ctx.stroke();
  
  // 6 outer circles with individual variations
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + t * 0.1 * ((seed + i) % 3 - 1);
    const distance = finalRadius * (1 + 0.2 * Math.sin(t * (2 + i * 0.3) + seed));
    const circleRadius = finalRadius * (0.8 + 0.4 * Math.sin(t * (1.5 + i * 0.2) + seed * i));
    
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    
    ctx.strokeStyle = `hsl(${(hue + i * (20 + seed % 15)) % 360}, ${75 + (seed % 15)}%, ${65 + (seed % 20)}%)`;
    ctx.lineWidth = (1 + 2 * Math.sin(t * (2 + i * 0.4) + seed)) * pulse2;
    
    ctx.beginPath();
    ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  ctx.restore();
}