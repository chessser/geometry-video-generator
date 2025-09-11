import type { Params } from '@/core/params';
import { hashToSeed } from '@/core/hash';
import { applyBoundaryBehavior } from '@/renderer/boundaries';

export interface PatternConfig {
  id: string;
  moveSpeed: number;
  size: number;
  movementRange: number;
  pulseRate: number;
  rotationRate: number;
  hueBase: number;
  movementType?: 'auto' | 'circular';
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

  // Movement calculation
  const moveSpeed = config.moveSpeed + (seed % 100) / 600;
  let rawX, rawY;

  if (config.movementType === 'circular') {
    // Simple circular movement
    rawX = width / 2 + width * config.movementRange * Math.cos(t * moveSpeed);
    rawY = height / 2 + height * config.movementRange * Math.sin(t * moveSpeed);
  } else {
    // Auto movement patterns based on seed
    const movePattern = seed % 4;
    if (movePattern === 0) {
      // Figure-8 pattern
      rawX = width / 2 + width * config.movementRange * Math.sin(t * moveSpeed * 2);
      rawY = height / 2 + height * config.movementRange * 0.7 * Math.sin(t * moveSpeed);
    } else if (movePattern === 1) {
      // Spiral pattern
      const spiralRadius =
        width * config.movementRange * (0.3 + 0.4 * Math.sin(t * moveSpeed * 0.3));
      rawX = width / 2 + spiralRadius * Math.cos(t * moveSpeed * 1.5);
      rawY = height / 2 + spiralRadius * Math.sin(t * moveSpeed * 1.5);
    } else if (movePattern === 2) {
      // Lissajous curve
      rawX = width / 2 + width * config.movementRange * Math.sin(t * moveSpeed * 1.2);
      rawY = height / 2 + height * config.movementRange * Math.sin(t * moveSpeed * 1.7);
    } else {
      // Orbital with wobble
      const orbitRadius =
        width * config.movementRange * (0.8 + 0.3 * Math.sin(t * moveSpeed * 0.5));
      const wobble = 0.2 * Math.sin(t * moveSpeed * 3);
      rawX = width / 2 + orbitRadius * Math.cos(t * moveSpeed) + wobble * width * 0.1;
      rawY = height / 2 + orbitRadius * Math.sin(t * moveSpeed) + wobble * height * 0.1;
    }
  }

  // Size calculation with minimum threshold
  const pulse = 0.8 + 0.4 * Math.sin(t * config.pulseRate + seed);
  const breathe = 0.9 + 0.2 * Math.sin(t * (config.pulseRate * 1.2) + seed * 2);
  const baseSize = Math.min(width, height) * config.size * params.scale;
  const size = Math.max(baseSize * 0.6, baseSize * pulse * breathe);

  // Boundary behavior
  const boundary = applyBoundaryBehavior(rawX, rawY, width, height, size * 2, config.id);

  // Canvas setup with distortion and misalignment
  ctx.save();
  ctx.globalAlpha = alpha * boundary.alpha;

  // Add misalignment offset to break perfect geometry
  const misalignX = width * 0.15 * Math.sin(t * 0.3 + seed * 1.7);
  const misalignY = height * 0.12 * Math.cos(t * 0.4 + seed * 2.1);

  ctx.translate(boundary.x + misalignX, boundary.y + misalignY);

  // Smooth constant rotation
  const rotation = t * config.rotationRate + params.angle;
  ctx.rotate(rotation);

  // Minimal distortion effects
  const skewX = 0.05 * Math.sin(t * 0.2 + seed);
  const skewY = 0.04 * Math.cos(t * 0.25 + seed);
  ctx.transform(1, skewX, skewY, 1, 0, 0);

  // Enhanced color setup with dynamic cycling
  const hueSpeed = 50 + (seed % 40);
  const hue = (t * hueSpeed + config.hueBase + seed * 20) % 360;
  const saturationBase = 65 + (seed % 30);
  const saturation = saturationBase + 20 * Math.sin(t * 0.8 + seed);
  const lightnessBase = 50 + (seed % 35);
  const lightness = lightnessBase + 15 * Math.cos(t * 0.6 + seed * 1.3);
  ctx.strokeStyle = `hsl(${hue}, ${Math.max(30, Math.min(100, saturation))}%, ${Math.max(20, Math.min(80, lightness))}%)`;

  // Size-based thickness with variation
  const sizeRatio = size / (Math.min(width, height) * config.size);
  const baseThickness = 1 + sizeRatio * 2;
  const thicknessPulse = 1 + 0.5 * Math.sin(t * (0.5 + (seed % 3) * 0.1));
  const thickness = baseThickness * thicknessPulse;
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

export function getGrowthCycle(t: number, speed: number = 0.03) {
  return (t * speed) % 1;
}

export function getGrowthStage(cycle: number, stages: number) {
  return Math.floor(cycle * stages);
}

export function getFadeAlpha(
  cycle: number,
  elementIndex: number,
  stageBreakpoints: number[],
  fadeZone: number = 0.1,
) {
  for (let i = 0; i < stageBreakpoints.length; i++) {
    const stageStart = stageBreakpoints[i];
    const cyclePoint = (i + 1) / stageBreakpoints.length;

    if (
      elementIndex >= stageStart &&
      cycle >= cyclePoint - fadeZone &&
      cycle < cyclePoint + fadeZone
    ) {
      return Math.min(1, (cycle - (cyclePoint - fadeZone)) / (fadeZone * 2));
    }
  }
  return 1;
}

export function drawElementWithFade(
  ctx: CanvasRenderingContext2D,
  drawFn: () => void,
  baseAlpha: number,
  fadeAlpha: number,
) {
  const originalAlpha = ctx.globalAlpha;
  ctx.globalAlpha = baseAlpha * fadeAlpha;
  drawFn();
  ctx.globalAlpha = originalAlpha;
}
