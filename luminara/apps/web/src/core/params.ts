import type { Theme } from './themes';

export type Params = {
  theme: Theme;
  symmetry: number;
  angle: number;
  scale: number;
  iter: number;
  paletteIdx: number;
};

import { getDefaultTheme } from './themes';

export function defaultParams(): Params {
  return { 
    theme: getDefaultTheme(),
    symmetry: 6, 
    angle: 0.0, 
    scale: 1.0, 
    iter: 8, 
    paletteIdx: 0 
  };
}