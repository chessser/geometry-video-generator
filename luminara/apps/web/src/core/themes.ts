export type Theme = 'sacred-geometry' | 'fractals' | 'organic' | 'minimal';

export const THEMES: Record<Theme, string> = {
  'sacred-geometry': 'Sacred Geometry',
  fractals: 'Fractals',
  organic: 'Organic Forms',
  minimal: 'Minimal',
};

export function getDefaultTheme(): Theme {
  return 'sacred-geometry';
}
