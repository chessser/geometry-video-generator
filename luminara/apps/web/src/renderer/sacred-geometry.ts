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
  type PatternType 
} from './patterns';
import { hashToSeed } from '../core/hash';

const PATTERNS: PatternType[] = ['flower-of-life', 'seed-of-life', 'metatrons-cube', 'sri-yantra', 'vesica-piscis', 'tree-of-life', 'golden-spiral', 'mandala', 'hexagram', 'pentagram'];
const PATTERN_DURATION = 8;
const TRANSITION_DURATION = 4;

export function renderSacredGeometry(ctx: CanvasRenderingContext2D, params: Params, t: number) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  const seed = hashToSeed('pattern-sequence');
  const multiPatternSeed = hashToSeed('multi-pattern');
  const shouldRenderMultiple = (multiPatternSeed % 100) < 30; // 30% chance for multiple patterns
  
  if (shouldRenderMultiple) {
    // Render 2-3 patterns simultaneously
    const numPatterns = 2 + (multiPatternSeed % 2);
    const patternOrder = [...PATTERNS].sort(() => (seed % 1000) / 500 - 1);
    
    for (let i = 0; i < numPatterns; i++) {
      const patternIndex = (Math.floor(t / PATTERN_DURATION) + i) % patternOrder.length;
      const pattern = patternOrder[patternIndex];
      const phaseOffset = i * Math.PI * 0.7; // Offset each pattern's animation phase
      const alpha = 0.4 + 0.3 * Math.sin(t * 0.5 + phaseOffset); // Varying opacity
      
      renderPattern(ctx, pattern, params, t + i * 2, alpha);
    }
  } else {
    // Single pattern mode (original behavior)
    const patternOrder = [...PATTERNS].sort(() => (seed % 1000) / 500 - 1);
    
    const cycleTime = t % PATTERN_DURATION;
    const currentIndex = Math.floor(t / PATTERN_DURATION) % patternOrder.length;
    const nextIndex = (currentIndex + 1) % patternOrder.length;
    
    const currentPattern = patternOrder[currentIndex];
    const nextPattern = patternOrder[nextIndex];
    
    // Always render current pattern
    const currentAlpha = cycleTime < (PATTERN_DURATION - TRANSITION_DURATION) ? 1.0 : 
      Math.max(0.1, 1.0 - (cycleTime - (PATTERN_DURATION - TRANSITION_DURATION)) / TRANSITION_DURATION);
    
    renderPattern(ctx, currentPattern, params, t, currentAlpha);
    
    // Render next pattern during transition
    if (cycleTime >= (PATTERN_DURATION - TRANSITION_DURATION)) {
      const nextAlpha = Math.min(0.9, (cycleTime - (PATTERN_DURATION - TRANSITION_DURATION)) / TRANSITION_DURATION);
      renderPattern(ctx, nextPattern, params, t, nextAlpha);
    }
  }
}

function renderPattern(ctx: CanvasRenderingContext2D, pattern: PatternType, params: Params, t: number, alpha: number) {
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