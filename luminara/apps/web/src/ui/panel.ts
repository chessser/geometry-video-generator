import { THEMES } from '../core/themes';

export function attachPanel(root: HTMLElement, onThemeChange?: (theme: string) => void) {
  const panel = document.createElement('div');
  panel.style.cssText =
    'position:fixed;top:20px;left:20px;background:rgba(0,0,0,0.8);color:white;padding:15px;border-radius:8px;font-family:system-ui';

  const title = document.createElement('h3');
  title.textContent = 'Luminara';
  title.style.margin = '0 0 10px 0';
  panel.appendChild(title);

  const themeLabel = document.createElement('label');
  themeLabel.textContent = 'Theme: ';
  const themeSelect = document.createElement('select');

  Object.entries(THEMES).forEach(([key, name]) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = name;
    if (key === 'sacred-geometry') option.selected = true;
    themeSelect.appendChild(option);
  });

  themeSelect.addEventListener('change', (e) => {
    const target = e.target as HTMLSelectElement;
    if (onThemeChange) {
      onThemeChange(target.value);
    }
  });

  themeLabel.appendChild(themeSelect);
  panel.appendChild(themeLabel);

  root.appendChild(panel);
}
