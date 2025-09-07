import type { Params } from '../../core/params';
import { hashToSeed } from '../../core/hash';
import { applyBoundaryBehavior } from '../boundaries';

export function renderSriYantra(
  ctx: CanvasRenderingContext2D,
  params: Params,
  t: number,
  alpha: number = 1,
) {
  const { width, height } = ctx.canvas;
  const positionSeed = hashToSeed('yantra-position');
  const moveSpeed = 0.1 + (positionSeed % 50) / 800;
  const amplitude = 0.35 + (positionSeed % 30) / 120;

  const spiralRadius = width * amplitude * (0.3 + 0.5 * Math.abs(Math.sin(t * moveSpeed * 0.5)));
  const spiralAngle = t * moveSpeed * 2;
  const rawX = width / 2 + spiralRadius * Math.cos(spiralAngle);
  const rawY = height / 2 + spiralRadius * Math.sin(spiralAngle);

  const pulse = 0.85 + 0.35 * Math.sin(t * (2.5 + (positionSeed % 3)));
  const baseSize = Math.min(width, height) * 0.32 * params.scale;
  const boundary = applyBoundaryBehavior(rawX, rawY, width, height, baseSize * 2, 'sri-yantra');
  const centerX = boundary.x;
  const centerY = boundary.y;
  alpha *= boundary.alpha;

  const flutter = 0.95 + 0.15 * Math.sin(t * (3.2 + ((positionSeed * 7) % 5)));
  const size = baseSize * pulse * flutter;
  const rotation = t * (0.12 + (positionSeed % 30) / 300) + params.angle;
  const wobble = 0.1 * Math.sin(t * (2.8 + (positionSeed % 4)));

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(centerX + wobble * 25, centerY + wobble * 20);
  ctx.rotate(rotation);
  ctx.scale(1 + wobble * 0.25, 1 - wobble * 0.15);

  const hue = (t * 45 + 300) % 360;
  ctx.strokeStyle = `hsl(${hue}, 90%, 65%)`;
  ctx.lineWidth = 1.5 + 1.5 * Math.sin(t * 2.5);

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

  ctx.restore();
}
