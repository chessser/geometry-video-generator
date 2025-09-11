import type { Params } from '@/core/params';
import {
  renderFlowerOfLife,
  renderSeedOfLife,
  renderMetatronsCube,
  renderSriYantra,
  renderVesicaPiscis,
  renderTreeOfLife,
  renderGoldenSpiral,
  type PatternType,
} from './patterns';
import { hashToSeed } from '@/core/hash';

export const PATTERNS: readonly PatternType[] = [
  'flower-of-life',
  'seed-of-life',
  'metatrons-cube',
  'sri-yantra',
  'vesica-piscis',
  'tree-of-life',
  'golden-spiral',
];
import { APP_CONFIG } from '@/constants';

const { PATTERN_DURATION, FADE_DURATION } = APP_CONFIG;

export function renderSacredGeometry(
  ctx: CanvasRenderingContext2D,
  params: Params,
  t: number,
  singlePattern?: string,
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Single pattern mode
  if (singlePattern && PATTERNS.includes(singlePattern as any)) {
    renderPattern(ctx, singlePattern as any, params, t, 1.0);
    return;
  }

  // Use time-based seed for true randomization
  const multiPatternSeed = hashToSeed(`multi-${Math.floor(t / 10)}`);
  const rand = multiPatternSeed % 100;

  // Decreasing probability for more patterns
  let numPatterns = 1;
  if (rand < 60)
    numPatterns = 2; // 60% chance for 2 patterns
  else if (rand < 80)
    numPatterns = 3; // 20% chance for 3 patterns
  else if (rand < 90)
    numPatterns = 4; // 10% chance for 4 patterns
  else if (rand < 95)
    numPatterns = 5; // 5% chance for 5 patterns
  else if (rand < 98)
    numPatterns = 6; // 3% chance for 6 patterns
  else numPatterns = 7; // 2% chance for 7 patterns

  // Generate truly random pattern selection for each layer
  const selectedPatterns: PatternType[] = [];
  for (let i = 0; i < numPatterns; i++) {
    const patternSeed = hashToSeed(`pattern-${i}-${Math.floor(t / 8)}`);
    const patternIndex = patternSeed % PATTERNS.length;
    const pattern = PATTERNS[patternIndex];
    if (pattern) selectedPatterns.push(pattern);
  }

  for (let i = 0; i < numPatterns; i++) {
    const pattern = selectedPatterns[i];
    if (!pattern) continue;
    const phaseOffset = i * Math.PI * 0.6;

    // Calculate fade based on pattern lifecycle
    const cycleTime = t % PATTERN_DURATION;
    let fadeAlpha = 1.0;

    if (cycleTime < FADE_DURATION) {
      // Smooth fade in with easing
      const progress = cycleTime / FADE_DURATION;
      fadeAlpha = progress * progress * (3 - 2 * progress); // Smoothstep
    } else if (cycleTime > PATTERN_DURATION - FADE_DURATION) {
      // Smooth fade out with easing
      const progress = (PATTERN_DURATION - cycleTime) / FADE_DURATION;
      fadeAlpha = progress * progress * (3 - 2 * progress); // Smoothstep
    }

    const baseAlpha = numPatterns === 1 ? 1.0 : 0.4 + 0.4 / numPatterns;
    const pulseAlpha = baseAlpha + 0.15 * Math.sin(t * 0.3 + phaseOffset);
    const finalAlpha = pulseAlpha * fadeAlpha;

    renderPattern(ctx, pattern, params, t + i * 2.5, finalAlpha);
  }
}

function renderPattern(
  ctx: CanvasRenderingContext2D,
  pattern: PatternType,
  params: Params,
  t: number,
  alpha: number,
) {
  switch (pattern) {
    case 'flower-of-life':
      renderFlowerOfLife(ctx, params, t, alpha);
      break;
    case 'seed-of-life':
      renderSeedOfLife(ctx, params, t, alpha);
      break;
    case 'metatrons-cube':
      renderMetatronsCube(ctx, params, t, alpha);
      break;
    case 'sri-yantra':
      renderSriYantra(ctx, params, t, alpha);
      break;
    case 'vesica-piscis':
      renderVesicaPiscis(ctx, params, t, alpha);
      break;
    case 'tree-of-life':
      renderTreeOfLife(ctx, params, t, alpha);
      break;
    case 'golden-spiral':
      renderGoldenSpiral(ctx, params, t, alpha);
      break;
  }
}
