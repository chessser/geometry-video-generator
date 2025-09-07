import type { Params } from '../../core/params';
import { hashToSeed } from '../../core/hash';
import { applyBoundaryBehavior } from '../boundaries';

export function renderTreeOfLife(ctx: CanvasRenderingContext2D, params: Params, t: number, alpha: number = 1) {
  const { width, height } = ctx.canvas;
  const seed = hashToSeed('tree-position');
  const moveSpeed = 0.11 + (seed % 60) / 1400;
  const rawX = width / 2 + (width * 0.35) * Math.cos(t * moveSpeed);
  const rawY = height / 2 + (height * 0.3) * Math.sin(t * moveSpeed * 1.3);
  
  const size = Math.min(width, height) * 0.3 * params.scale;
  const boundary = applyBoundaryBehavior(rawX, rawY, width, height, size * 2, 'tree-of-life');
  const centerX = boundary.x;
  const centerY = boundary.y;
  alpha *= boundary.alpha;
  
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(centerX, centerY);
  ctx.rotate(t * 0.05);
  
  const hue = (t * 30 + 60) % 360;
  ctx.strokeStyle = `hsl(${hue}, 75%, 65%)`;
  ctx.lineWidth = 1.5 + 0.5 * Math.sin(t * 0.6);
  
  const sephirot = [
    [0, -size * 0.8], [0, size * 0.8],
    [-size * 0.4, -size * 0.4], [size * 0.4, -size * 0.4],
    [-size * 0.4, 0], [size * 0.4, 0],
    [-size * 0.4, size * 0.4], [size * 0.4, size * 0.4],
    [0, -size * 0.2], [0, size * 0.2]
  ];
  
  sephirot.forEach(([x, y], i) => {
    const circleSize = size * 0.08 * (0.8 + 0.4 * Math.sin(t * 0.3 + i));
    ctx.beginPath();
    ctx.arc(x, y, circleSize, 0, Math.PI * 2);
    ctx.stroke();
  });
  
  const connections = [[0,8], [8,2], [2,4], [4,6], [6,9], [9,7], [7,5], [5,3], [3,8], [8,9], [2,3], [4,5], [6,7]];
  connections.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(sephirot[a][0], sephirot[a][1]);
    ctx.lineTo(sephirot[b][0], sephirot[b][1]);
    ctx.stroke();
  });
  
  ctx.restore();
}