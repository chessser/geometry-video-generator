import type { Params } from '../../core/params';
import { hashToSeed } from '../../core/hash';
import { applyBoundaryBehavior } from '../boundaries';

export function renderMetatronsCube(ctx: CanvasRenderingContext2D, params: Params, t: number, alpha: number = 1) {
  const { width, height } = ctx.canvas;
  const positionSeed = hashToSeed('metatron-position');
  const moveSpeed = 0.14 + (positionSeed % 60) / 900;
  const pathType = positionSeed % 3;
  let centerX, centerY;
  
  if (pathType === 0) {
    centerX = width * (0.2 + 0.6 * Math.abs(Math.sin(t * moveSpeed)));
    centerY = height * (0.2 + 0.6 * Math.abs(Math.cos(t * moveSpeed)));
  } else if (pathType === 1) {
    centerX = width / 2 + (width * 0.35) * Math.cos(t * moveSpeed);
    centerY = height / 2 + (height * 0.35) * Math.sin(t * moveSpeed);
  } else {
    centerX = width / 2 + (width * 0.3) * Math.sin(t * moveSpeed * 2);
    centerY = height / 2 + (height * 0.3) * Math.sin(t * moveSpeed);
  }
  
  const pulse = 0.8 + 0.4 * Math.sin(t * (1.8 + positionSeed % 3));
  const baseRadius = Math.min(width, height) * 0.4 * params.scale;
  const boundary = applyBoundaryBehavior(centerX, centerY, width, height, baseRadius * 2, 'metatrons-cube');
  centerX = boundary.x;
  centerY = boundary.y;
  alpha *= boundary.alpha;
  
  const warp = 0.9 + 0.3 * Math.sin(t * (2.1 + (positionSeed * 5) % 4));
  const radius = baseRadius * pulse * warp;
  const rotation = t * (0.35 + (positionSeed % 40) / 150) + params.angle;
  const tilt = 0.2 * Math.sin(t * (0.8 + positionSeed % 2));
  
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);
  ctx.transform(1, tilt * 0.3, tilt * 0.2, 1, 0, 0);
  
  const hue = (t * 35 + 240) % 360;
  ctx.strokeStyle = `hsl(${hue}, 85%, 60%)`;
  ctx.lineWidth = 1.5 + Math.sin(t * 3);
  
  const positions = [
    [0, 0], [1, 0], [-1, 0], [0, 1], [0, -1],
    [0.5, 0.866], [-0.5, 0.866], [0.5, -0.866], [-0.5, -0.866],
    [1.5, 0.866], [-1.5, 0.866], [1.5, -0.866], [-1.5, -0.866]
  ];
  
  positions.forEach(([x, y], i) => {
    const circleRadius = radius * 0.15 * (0.8 + 0.4 * Math.sin(t * 2 + i * 0.3));
    ctx.beginPath();
    ctx.arc(x * radius * 0.4, y * radius * 0.4, circleRadius, 0, Math.PI * 2);
    ctx.stroke();
  });
  
  ctx.lineWidth = 1;
  positions.forEach(([x1, y1], i) => {
    positions.slice(i + 1).forEach(([x2, y2]) => {
      ctx.beginPath();
      ctx.moveTo(x1 * radius * 0.4, y1 * radius * 0.4);
      ctx.lineTo(x2 * radius * 0.4, y2 * radius * 0.4);
      ctx.stroke();
    });
  });
  
  ctx.restore();
}