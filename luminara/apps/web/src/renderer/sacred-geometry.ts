import type { Params } from '../core/params';
import {
  renderFlowerOfLife,
  renderSeedOfLife,
  renderMetatronsCube,
  renderSriYantra,
  renderVesicaPiscis,
  renderTreeOfLife,
  renderGoldenSpiral,
  renderMandala,
  renderHexagram,
  renderPentagram,
  type PatternType,
} from './patterns';
import { hashToSeed } from '../core/hash';

const PATTERNS: PatternType[] = [
  'flower-of-life',
  'seed-of-life',
  'metatrons-cube',
  'sri-yantra',
  'vesica-piscis',
  'tree-of-life',
  'golden-spiral',
  'mandala',
  'hexagram',
  'pentagram',
];
const PATTERN_DURATION = 20;
const FADE_DURATION = 3;

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

  const seed = hashToSeed('pattern-sequence');
  const multiPatternSeed = hashToSeed('multi-pattern');
  const rand = multiPatternSeed % 100;

  // Decreasing probability for more patterns
  let numPatterns = 1;
  if (rand < 70)
    numPatterns = 2; // 70% chance for 2 patterns
  else if (rand < 85)
    numPatterns = 3; // 15% chance for 3 patterns
  else if (rand < 93)
    numPatterns = 4; // 8% chance for 4 patterns
  else if (rand < 97)
    numPatterns = 5; // 4% chance for 5 patterns
  else if (rand < 99)
    numPatterns = 6; // 2% chance for 6 patterns
  else numPatterns = 7; // 1% chance for 7 patterns

  const patternOrder = [...PATTERNS].sort(() => (seed % 1000) / 500 - 1);

  for (let i = 0; i < numPatterns; i++) {
    const patternIndex = (Math.floor(t / PATTERN_DURATION) + i) % patternOrder.length;
    const pattern = patternOrder[patternIndex];
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
    case 'mandala':
      renderMandala(ctx, params, t, alpha);
      break;
    case 'hexagram':
      renderHexagram(ctx, params, t, alpha);
      break;
    case 'pentagram':
      renderPentagram(ctx, params, t, alpha);
      break;
  }
}
