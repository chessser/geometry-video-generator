export type Theme =
  | 'sacred-geometry'
  | 'fractals'
  | 'organic'
  | 'minimal'
  | 'flower-of-life'
  | 'seed-of-life'
  | 'metatrons-cube'
  | 'sri-yantra'
  | 'vesica-piscis'
  | 'tree-of-life'
  | 'golden-spiral';

export const THEMES: Record<Theme, string> = {
  'sacred-geometry': 'Sacred Geometry',
  fractals: 'Fractals',
  organic: 'Organic Forms',
  minimal: 'Minimal',
  'flower-of-life': '└ Flower of Life',
  'seed-of-life': '└ Seed of Life',
  'metatrons-cube': "└ Metatron's Cube",
  'sri-yantra': '└ Sri Yantra',
  'vesica-piscis': '└ Vesica Piscis',
  'tree-of-life': '└ Tree of Life',
  'golden-spiral': '└ Golden Spiral',
};

export function getDefaultTheme(): Theme {
  return 'sacred-geometry';
}
