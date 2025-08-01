export type Coord = { x: number; y: number };

export const Direction = {
  Up: 'UP',
  Down: 'DOWN',
  Left: 'LEFT',
  Right: 'RIGHT',
} as const;

export type Direction = typeof Direction[keyof typeof Direction];

export type Speed = 'slow' | 'medium' | 'fast';

export interface GameConfig {
  rows: number;
  cols: number;
  speed: Speed;
  wallIsDead: boolean;
}

export interface GameState {
  snake: Coord[];
  food: Coord;
  direction: Direction;
  pendingDirection?: Direction;
  score: number;
  highScore: number;
  isRunning: boolean;
  isGameOver: boolean;
}