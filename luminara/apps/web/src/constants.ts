// Application constants
export const APP_CONFIG = {
  PATTERN_DURATION: 20,
  FADE_DURATION: 3,
  DEFAULT_CANVAS_SIZE: { width: 800, height: 600 },
} as const;

export const ANIMATION_CONFIG = {
  TARGET_FPS: 60,
  FRAME_TIME: 1000 / 60,
} as const;
