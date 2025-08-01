# React Snake Game

**[中文版](README.md)** | **English**

A Snake game built with React + TypeScript + Vite, using pnpm as package manager.

## Quick Start

Requirements: Node.js (18+) and pnpm (8+) installed.

Install dependencies:
```bash
pnpm install
```

Start development server:
```bash
pnpm dev
```

Build for production:
```bash
pnpm build
```

Preview production build:
```bash
pnpm preview
```

## Game Design

- Board: Default 20 x 20 grid.
- Snake: Moves at fixed intervals; initial length 3; direction controlled by player.
- Controls: Arrow keys (← ↑ → ↓) or WASD to change direction; supports pause/resume; supports restart.
- Food: Randomly appears in unoccupied cells; eating food increases snake length by 1 and score by 1.
- Collision rules: Game ends when hitting walls or snake's own body.
- Speed: Default medium speed, adjustable in control panel (slow/medium/fast).
- High score: Persistently saved in localStorage.
- Optional extensions (future): Edge wrapping, special food, levels/acceleration, touch gestures, sound effects, etc.

## Interface Components (Planned)

- Game Area (GameBoard)
  - Renders grid, snake body, snake head, and food.
  - Uses CSS for sizing, colors, and responsive design.
- Control Panel (ControlPanel)
  - Displays current score and high score.
  - Buttons: start/pause, reset.
  - Speed selector: slow/medium/fast.
- Global Container (App)
  - Combines GameBoard and ControlPanel.
  - Provides keyboard focus management to ensure arrow keys work.

## Key Bindings

- Direction: ↑/W up; ↓/S down; ←/A left; →/D right
- Pause/Resume: Space (or click "Pause/Resume" button)
- Restart: R (or click "Restart" button)

Note: To ensure keyboard events work, click on the game area or any control when first entering the page to gain focus.

## Technical Solution (Planned)

For ease of implementation and maintenance, key abstractions and interfaces are defined here.

### Directory Structure (Planned)

- [`src/types.ts`](src/types.ts): Global type definitions
- [`src/game/useSnakeGame.ts`](src/game/useSnakeGame.ts): Hook for managing game loop and state
- [`src/components/GameBoard.tsx`](src/components/GameBoard.tsx): Board and element rendering
- [`src/components/ControlPanel.tsx`](src/components/ControlPanel.tsx): Control area and score display
- Modify existing files:
  - [`src/App.tsx`](src/App.tsx)
  - [`src/App.css`](src/App.css)

### Type Definitions (Planned)

```ts
// types.ts (planned)
export type Coord = { x: number; y: number };

export enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

export type Speed = 'slow' | 'medium' | 'fast';

export interface GameConfig {
  rows: number; // 20
  cols: number; // 20
  speed: Speed; // 'medium'
  wallIsDead: boolean; // true (hitting wall = death); extensible to wrap mode
}

export interface GameState {
  snake: Coord[]; // Index 0 is snake head
  food: Coord;
  direction: Direction;
  pendingDirection?: Direction; // Debouncing and prevent immediate reverse
  score: number;
  highScore: number;
  isRunning: boolean; // Whether moving (not paused)
  isGameOver: boolean;
}
```

### Hook Design (Planned)

[`src/game/useSnakeGame.ts`](src/game/useSnakeGame.ts) (planned) responsibilities:
- Unified state management (snake, direction, food, score, game running state)
- Timer-driven (`setInterval` or `requestAnimationFrame` + accumulated timing)
- Keyboard event handling (direction, pause, reset)
- Collision detection and food generation
- High score read/write (localStorage)

Core API (planned):
```ts
// useSnakeGame (planned)
function useSnakeGame(initial?: Partial<GameConfig>) {
  // Returns:
  return {
    state,              // GameState
    config,             // GameConfig
    start, pause, reset,
    setSpeed,           // (speed: Speed) => void
    handleKeyDown,      // (e: KeyboardEvent) => void
  };
}
```

Speed and timing (planned):
- slow: 200ms/step
- medium: 120ms/step
- fast: 80ms/step

### Component Responsibilities (Planned)

- [`GameBoard.tsx`](src/components/GameBoard.tsx)
  - Receives board rows/cols, snake, food, renders grid
  - Controls cell size through inline-style or CSS variables
  - Applies different styles and aria-labels to snake head/body/food for accessibility

- [`ControlPanel.tsx`](src/components/ControlPanel.tsx)
  - Displays score and high score
  - Start/pause, reset buttons
  - Speed selector (radio or dropdown)
  - Passes event callbacks upward (start/pause/reset/setSpeed)

- [`App.tsx`](src/App.tsx)
  - Uses `useSnakeGame`
  - Binds `onKeyDown` or document-level events
  - Layouts GameBoard and ControlPanel

### Collision and Movement Rules (Planned)

1. Each tick:
   - If `pendingDirection` exists, check if direction change is allowed (prevent 180° reverse), update `direction` if allowed.
   - Calculate new head coordinates.
   - If `wallIsDead` is true: game ends if head goes out of bounds; otherwise perform edge wrapping (x/y modulo).
   - If new head overlaps with snake body (except tail when not eating food), game ends.
   - If new head equals food coordinates: score +1, snake grows (don't remove tail), generate new food; update high score.
   - Otherwise: add new head to front, remove tail, snake advances.

2. Food generation:
   - Randomly select from empty cells.
   - If grid is full (very rare in small grids with high scores), can declare victory or reset.

## Configurable Parameters (Planned)

- Grid size: Default 20 x 20, later expose input box or slider in ControlPanel.
- Speed: slow/medium/fast.
- Wall collision rule: true (default) or wrapping.

## State Persistence (Planned)

- highScore stored in localStorage: suggested key name `snake.highScore`.
- Optional: remember last speed, grid size preferences.

## Style Suggestions

- High contrast colors: snake body (#16a34a), snake head (#15803d), food (#ef4444), grid background (#0f172a / #111827).
- Responsive: board max width/height adapts to container (min(90vmin, 640px)), cell size auto-calculated through CSS Grid.
- Animation: subtle transitions for better effects (avoid excessive box-shadow affecting performance).

## Accessibility and Usability

- Set `role="application"` or `role="region"` with aria-label for main areas.
- Visible focus styles, ensure keyboard operability.
- Add `aria-pressed`, `aria-live="polite"` to controls for score changes.

## Future Implementation Steps (Suggested)

1. Create type and Hook files, complete core logic and keyboard controls.
2. Write GameBoard rendering, start with simple blocks.
3. Add ControlPanel, connect start/pause/reset/speed.
4. Improve styles, accessibility, mobile touch support (optional).
5. Add unit tests (core logic: movement, collision, food generation).

## License

MIT