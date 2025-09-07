import type { Params } from '../../core/params';
import { hashToSeed } from '../../core/hash';
import { applyBoundaryBehavior } from '../boundaries';

export interface PatternConfig {
  id: string;
  moveSpeed: number;
  size: number;
  movementRange: number;
  pulseRate: number;
  rotationRate: number;
  hueBase: number;
}

export function setupPattern(ctx: CanvasRenderingContext2D, params: Params, t: number, alpha: number, config: PatternConfig) {
  const { width, height } = ctx.canvas;
  const seed = hashToSeed(config.id);
  
  // Movement calculation
  const moveSpeed = config.moveSpeed + (seed % 100) / 800;
  const rawX = width / 2 + (width * config.movementRange) * Math.sin(t * moveSpeed);
  const rawY = height / 2 + (height * config.movementRange) * Math.cos(t * moveSpeed * 0.8);
  
  // Enhanced size calculation
  const pulse = 0.7 + 0.5 * Math.sin(t * config.pulseRate + seed);
  const breathe = 0.8 + 0.4 * Math.sin(t * (config.pulseRate * 1.3) + seed * 2);
  const size = Math.min(width, height) * config.size * params.scale * pulse * breathe;
  
  // Boundary behavior
  const boundary = applyBoundaryBehavior(rawX, rawY, width, height, size * 2, config.id);
  
  // Canvas setup with distortion
  ctx.save();
  ctx.globalAlpha = alpha * boundary.alpha;
  ctx.translate(boundary.x, boundary.y);
  
  // Enhanced rotation
  const rotation = t * config.rotationRate + params.angle + seed * 0.01;
  ctx.rotate(rotation);
  
  // Distortion effects
  const skewX = 0.15 * Math.sin(t * 0.3 + seed);
  const skewY = 0.1 * Math.cos(t * 0.4 + seed * 1.5);
  const scaleX = 1 + 0.2 * Math.sin(t * 0.25 + seed * 0.7);
  const scaleY = 1 + 0.15 * Math.cos(t * 0.35 + seed * 1.2);
  ctx.transform(scaleX, skewX, skewY, scaleY, 0, 0);
  
  // Enhanced color setup
  const hue = (t * (40 + seed % 30) + config.hueBase + seed * 15) % 360;
  const saturation = 70 + (seed % 25);
  const lightness = 55 + (seed % 30);
  ctx.strokeStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  
  // Variable line thickness
  const thickness = 1.5 + 3 * Math.sin(t * (0.6 + seed % 4 * 0.1)) + (seed % 10) * 0.2;
  ctx.lineWidth = thickness;
  
  return { size, seed, hue };
}

export function finishPattern(ctx: CanvasRenderingContext2D) {
  ctx.restore();
}