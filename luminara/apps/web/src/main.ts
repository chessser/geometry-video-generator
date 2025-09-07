import { startLoop } from './renderer/loop';
import { attachPanel } from './ui/panel';
import { defaultParams } from './core/params';
import type { Theme } from './core/themes';

const root = document.getElementById('app')!;
const canvas = document.createElement('canvas');
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
root.replaceChildren(canvas);

const params = defaultParams();

startLoop(canvas, params);
attachPanel(root, (theme: string) => {
  params.theme = theme as Theme;
});

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
