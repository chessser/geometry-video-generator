import { defaultParams } from '../core/params';
import { renderSacredGeometry } from './sacred-geometry';

export function startLoop(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let start = performance.now();
  const params = defaultParams();

  function frame(now: number) {
    const t = (now - start) / 1000;

    if (params.theme === 'sacred-geometry') {
      renderSacredGeometry(ctx!, params, t);
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
