import { hashToSeed } from '../core/hash';

export type BoundaryBehavior = 'bounce' | 'wrap' | 'fade';

export function applyBoundaryBehavior(
  x: number, 
  y: number, 
  width: number, 
  height: number, 
  patternSize: number,
  patternId: string
): { x: number; y: number; alpha: number } {
  const seed = hashToSeed(patternId);
  const behavior: BoundaryBehavior = ['bounce', 'wrap', 'fade'][seed % 3] as BoundaryBehavior;
  
  const margin = patternSize * 0.6;
  const softZone = margin * 0.8; // Soft transition zone
  const minX = margin;
  const maxX = width - margin;
  const minY = margin;
  const maxY = height - margin;
  
  let newX = x;
  let newY = y;
  let alpha = 1.0;
  
  switch (behavior) {
    case 'bounce':
      // Soft bounce with easing
      if (x < minX) {
        const overshoot = minX - x;
        newX = minX + overshoot * 0.3 * Math.sin(overshoot / softZone * Math.PI * 0.5);
      } else if (x > maxX) {
        const overshoot = x - maxX;
        newX = maxX - overshoot * 0.3 * Math.sin(overshoot / softZone * Math.PI * 0.5);
      }
      
      if (y < minY) {
        const overshoot = minY - y;
        newY = minY + overshoot * 0.3 * Math.sin(overshoot / softZone * Math.PI * 0.5);
      } else if (y > maxY) {
        const overshoot = y - maxY;
        newY = maxY - overshoot * 0.3 * Math.sin(overshoot / softZone * Math.PI * 0.5);
      }
      break;
      
    case 'wrap':
      // Smooth wrap with interpolation
      if (x < minX) {
        const progress = (minX - x) / softZone;
        newX = maxX - (minX - x) * Math.min(1, progress);
      } else if (x > maxX) {
        const progress = (x - maxX) / softZone;
        newX = minX + (x - maxX) * Math.min(1, progress);
      }
      
      if (y < minY) {
        const progress = (minY - y) / softZone;
        newY = maxY - (minY - y) * Math.min(1, progress);
      } else if (y > maxY) {
        const progress = (y - maxY) / softZone;
        newY = minY + (y - maxY) * Math.min(1, progress);
      }
      break;
      
    case 'fade':
      const fadeZone = margin * 1.2;
      const distToEdgeX = Math.min(x - minX, maxX - x);
      const distToEdgeY = Math.min(y - minY, maxY - y);
      const minDist = Math.min(distToEdgeX, distToEdgeY);
      
      if (minDist < fadeZone) {
        // Smooth fade with easing
        const fadeProgress = minDist / fadeZone;
        alpha = Math.max(0.1, fadeProgress * fadeProgress); // Quadratic easing
      }
      break;
  }
  
  return { x: newX, y: newY, alpha };
}