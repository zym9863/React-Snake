import { useState, useEffect, useCallback, useRef } from 'react';
import { Direction } from '../types';
import type { GameConfig, GameState, Speed, Coord } from '../types';

const SPEED_MAP: Record<Speed, number> = {
  slow: 200,
  medium: 120,
  fast: 80,
};

const INITIAL_SNAKE: Coord[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

const INITIAL_CONFIG: GameConfig = {
  rows: 20,
  cols: 20,
  speed: 'medium',
  wallIsDead: true,
};

const getHighScore = (): number => {
  const saved = localStorage.getItem('snake.highScore');
  return saved ? parseInt(saved, 10) : 0;
};

const setHighScore = (score: number): void => {
  localStorage.setItem('snake.highScore', score.toString());
};

const getRandomFood = (snake: Coord[], rows: number, cols: number): Coord => {
  const occupiedCells = new Set(snake.map(cell => `${cell.x},${cell.y}`));
  const emptyCells: Coord[] = [];
  
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      if (!occupiedCells.has(`${x},${y}`)) {
        emptyCells.push({ x, y });
      }
    }
  }
  
  if (emptyCells.length === 0) {
    return { x: 0, y: 0 };
  }
  
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

const isValidDirection = (current: Direction, next: Direction): boolean => {
  const opposites = {
    [Direction.Up]: Direction.Down,
    [Direction.Down]: Direction.Up,
    [Direction.Left]: Direction.Right,
    [Direction.Right]: Direction.Left,
  };
  return opposites[current] !== next;
};

const getNextPosition = (head: Coord, direction: Direction): Coord => {
  switch (direction) {
    case Direction.Up:
      return { x: head.x, y: head.y - 1 };
    case Direction.Down:
      return { x: head.x, y: head.y + 1 };
    case Direction.Left:
      return { x: head.x - 1, y: head.y };
    case Direction.Right:
      return { x: head.x + 1, y: head.y };
    default:
      return head;
  }
};

const isCollision = (head: Coord, snake: Coord[]): boolean => {
  return snake.some(segment => segment.x === head.x && segment.y === head.y);
};

const isOutOfBounds = (head: Coord, rows: number, cols: number): boolean => {
  return head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows;
};

export function useSnakeGame(initialConfig?: Partial<GameConfig>) {
  const config = { ...INITIAL_CONFIG, ...initialConfig };
  const intervalRef = useRef<number | null>(null);
  
  const [state, setState] = useState<GameState>(() => ({
    snake: INITIAL_SNAKE,
    food: getRandomFood(INITIAL_SNAKE, config.rows, config.cols),
    direction: Direction.Right,
    score: 0,
    highScore: getHighScore(),
    isRunning: false,
    isGameOver: false,
  }));

  const moveSnake = useCallback(() => {
    setState(prevState => {
      if (prevState.isGameOver || !prevState.isRunning) {
        return prevState;
      }

      const currentDirection = prevState.pendingDirection && 
        isValidDirection(prevState.direction, prevState.pendingDirection)
        ? prevState.pendingDirection
        : prevState.direction;

      const head = prevState.snake[0];
      const newHead = getNextPosition(head, currentDirection);

      if (config.wallIsDead && isOutOfBounds(newHead, config.rows, config.cols)) {
        return {
          ...prevState,
          isGameOver: true,
          isRunning: false,
        };
      }

      if (!config.wallIsDead) {
        newHead.x = ((newHead.x % config.cols) + config.cols) % config.cols;
        newHead.y = ((newHead.y % config.rows) + config.rows) % config.rows;
      }

      if (isCollision(newHead, prevState.snake)) {
        return {
          ...prevState,
          isGameOver: true,
          isRunning: false,
        };
      }

      const newSnake = [newHead, ...prevState.snake];
      let newFood = prevState.food;
      let newScore = prevState.score;
      let newHighScore = prevState.highScore;

      if (newHead.x === prevState.food.x && newHead.y === prevState.food.y) {
        newScore += 1;
        newFood = getRandomFood(newSnake, config.rows, config.cols);
        if (newScore > newHighScore) {
          newHighScore = newScore;
          setHighScore(newHighScore);
        }
      } else {
        newSnake.pop();
      }

      return {
        ...prevState,
        snake: newSnake,
        food: newFood,
        direction: currentDirection,
        pendingDirection: undefined,
        score: newScore,
        highScore: newHighScore,
      };
    });
  }, [config]);

  useEffect(() => {
    if (state.isRunning && !state.isGameOver) {
      intervalRef.current = setInterval(moveSnake, SPEED_MAP[config.speed]) as unknown as number;
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, state.isGameOver, moveSnake, config.speed]);

  const start = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      isRunning: true,
    }));
  }, []);

  const pause = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      isRunning: false,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      snake: INITIAL_SNAKE,
      food: getRandomFood(INITIAL_SNAKE, config.rows, config.cols),
      direction: Direction.Right,
      score: 0,
      highScore: getHighScore(),
      isRunning: false,
      isGameOver: false,
    });
  }, [config.rows, config.cols]);

  const setSpeed = useCallback((speed: Speed) => {
    config.speed = speed;
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key.toLowerCase()) {
      case 'arrowup':
      case 'w':
        e.preventDefault();
        setState(prevState => ({
          ...prevState,
          pendingDirection: Direction.Up,
        }));
        break;
      case 'arrowdown':
      case 's':
        e.preventDefault();
        setState(prevState => ({
          ...prevState,
          pendingDirection: Direction.Down,
        }));
        break;
      case 'arrowleft':
      case 'a':
        e.preventDefault();
        setState(prevState => ({
          ...prevState,
          pendingDirection: Direction.Left,
        }));
        break;
      case 'arrowright':
      case 'd':
        e.preventDefault();
        setState(prevState => ({
          ...prevState,
          pendingDirection: Direction.Right,
        }));
        break;
      case ' ':
        e.preventDefault();
        if (state.isGameOver) {
          reset();
        } else if (state.isRunning) {
          pause();
        } else {
          start();
        }
        break;
      case 'r':
        e.preventDefault();
        reset();
        break;
    }
  }, [state.isGameOver, state.isRunning, start, pause, reset]);

  return {
    state,
    config,
    start,
    pause,
    reset,
    setSpeed,
    handleKeyDown,
  };
}