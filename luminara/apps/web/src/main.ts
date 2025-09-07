import { startLoop } from './renderer/loop';
import { attachPanel } from './ui/panel';

const root = document.getElementById('app')!;
const canvas = document.createElement('canvas');
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
root.replaceChildren(canvas);

startLoop(canvas);
attachPanel(root);

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
