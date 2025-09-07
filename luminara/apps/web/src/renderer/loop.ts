import { renderSacredGeometry } from './sacred-geometry';

export function startLoop(canvas: HTMLCanvasElement, params: any) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let start = performance.now();

  function frame(now: number) {
    const t = (now - start) / 1000;

    if (params.theme === 'sacred-geometry') {
      renderSacredGeometry(ctx!, params, t);
    } else if (
      [
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
      ].includes(params.theme)
    ) {
      renderSacredGeometry(ctx!, params, t, params.theme);
    } else {
      // Fallback
      const g = Math.floor(64 + 48 * Math.sin(t));
      ctx!.fillStyle = `rgb(0, ${g}, 64)`;
      ctx!.fillRect(0, 0, canvas.width, canvas.height);
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}
