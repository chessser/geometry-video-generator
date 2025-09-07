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

export function setupPattern(
  ctx: CanvasRenderingContext2D,
  params: Params,
  t: number,
  alpha: number,
  config: PatternConfig,
) {
  const { width, height } = ctx.canvas;
  const seed = hashToSeed(config.id);

  // Enhanced movement calculation with figure-8 and spiral patterns
  const moveSpeed = config.moveSpeed + (seed % 100) / 600;
  const movePattern = seed % 4;
  let rawX, rawY;

  if (movePattern === 0) {
    // Figure-8 pattern
    rawX = width / 2 + width * config.movementRange * Math.sin(t * moveSpeed * 2);
    rawY = height / 2 + height * config.movementRange * 0.7 * Math.sin(t * moveSpeed);
  } else if (movePattern === 1) {
    // Spiral pattern
    const spiralRadius = width * config.movementRange * (0.3 + 0.4 * Math.sin(t * moveSpeed * 0.3));
    rawX = width / 2 + spiralRadius * Math.cos(t * moveSpeed * 1.5);
    rawY = height / 2 + spiralRadius * Math.sin(t * moveSpeed * 1.5);
  } else if (movePattern === 2) {
    // Lissajous curve
    rawX = width / 2 + width * config.movementRange * Math.sin(t * moveSpeed * 1.2);
    rawY = height / 2 + height * config.movementRange * Math.sin(t * moveSpeed * 1.7);
  } else {
    // Orbital with wobble
    const orbitRadius = width * config.movementRange * (0.8 + 0.3 * Math.sin(t * moveSpeed * 0.5));
    const wobble = 0.2 * Math.sin(t * moveSpeed * 3);
    rawX = width / 2 + orbitRadius * Math.cos(t * moveSpeed) + wobble * width * 0.1;
    rawY = height / 2 + orbitRadius * Math.sin(t * moveSpeed) + wobble * height * 0.1;
  }

  // Enhanced size calculation with multiple oscillations
  const pulse = 0.6 + 0.6 * Math.sin(t * config.pulseRate + seed);
  const breathe = 0.7 + 0.5 * Math.sin(t * (config.pulseRate * 1.4) + seed * 2);
  const throb = 0.9 + 0.2 * Math.sin(t * (config.pulseRate * 2.1) + seed * 3);
  const size = Math.min(width, height) * config.size * params.scale * pulse * breathe * throb;

  // Boundary behavior
  const boundary = applyBoundaryBehavior(rawX, rawY, width, height, size * 2, config.id);

  // Canvas setup with distortion and misalignment
  ctx.save();
  ctx.globalAlpha = alpha * boundary.alpha;

  // Add misalignment offset to break perfect geometry
  const misalignX = width * 0.15 * Math.sin(t * 0.3 + seed * 1.7);
  const misalignY = height * 0.12 * Math.cos(t * 0.4 + seed * 2.1);

  ctx.translate(boundary.x + misalignX, boundary.y + misalignY);

  // Enhanced rotation with acceleration and deceleration
  const rotationSpeed = config.rotationRate * (1 + 0.5 * Math.sin(t * 0.2 + seed));
  const rotation = t * rotationSpeed + params.angle + seed * 0.01;
  ctx.rotate(rotation);

  // Enhanced distortion effects
  const skewX = 0.25 * Math.sin(t * 0.4 + seed) * Math.cos(t * 0.15);
  const skewY = 0.2 * Math.cos(t * 0.5 + seed * 1.5) * Math.sin(t * 0.12);
  const scaleX = 1 + 0.3 * Math.sin(t * 0.3 + seed * 0.7) + 0.1 * Math.cos(t * 0.8);
  const scaleY = 1 + 0.25 * Math.cos(t * 0.4 + seed * 1.2) + 0.1 * Math.sin(t * 0.9);
  const shearX = 0.1 * Math.sin(t * 0.6 + seed * 2);
  const shearY = 0.08 * Math.cos(t * 0.7 + seed * 2.5);
  ctx.transform(scaleX, skewX + shearX, skewY + shearY, scaleY, 0, 0);

  // Enhanced color setup with dynamic cycling
  const hueSpeed = 50 + (seed % 40);
  const hue = (t * hueSpeed + config.hueBase + seed * 20) % 360;
  const saturationBase = 65 + (seed % 30);
  const saturation = saturationBase + 20 * Math.sin(t * 0.8 + seed);
  const lightnessBase = 50 + (seed % 35);
  const lightness = lightnessBase + 15 * Math.cos(t * 0.6 + seed * 1.3);
  ctx.strokeStyle = `hsl(${hue}, ${Math.max(30, Math.min(100, saturation))}%, ${Math.max(20, Math.min(80, lightness))}%)`;

  // Moderate line thickness variation
  const thicknessPulse = 1.5 + 2 * Math.sin(t * (0.7 + (seed % 5) * 0.1));
  const thicknessWave = 1 + 1.5 * Math.cos(t * (1.2 + (seed % 3) * 0.15));
  const thickness = thicknessPulse * thicknessWave + (seed % 4) * 0.3;
  ctx.lineWidth = Math.max(0.8, thickness);

  return { size, seed, hue };
}

export function finishPattern(ctx: CanvasRenderingContext2D) {
  ctx.restore();
}

export function getChaosOffset(t: number, seed: number, index: number, amplitude: number = 0.2) {
  const x = amplitude * Math.sin(t * (0.3 + (seed % 5) * 0.1) + index * 1.2);
  const y = amplitude * Math.cos(t * (0.4 + (seed % 7) * 0.1) + index * 1.5);
  return { x, y };
}

export function getChaosThickness(t: number, seed: number, index: number = 0) {
  const base = 1.5 + (seed % 3);
  const pulse = 2 * Math.sin(t * (0.6 + (seed % 4) * 0.1) + index * 0.8);
  return Math.max(0.8, base + pulse);
}

export function shouldUseChaos(seed: number, chaosType: 'drift' | 'thickness' | 'both') {
  const rand = seed % 100;
  if (chaosType === 'drift') return rand < 70;
  if (chaosType === 'thickness') return rand < 80;
  return rand < 60; // both
}
