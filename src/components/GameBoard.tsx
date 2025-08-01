import React from 'react';
import type { Coord, Direction } from '../types';

interface GameBoardProps {
  rows: number;
  cols: number;
  snake: Coord[];
  food: Coord;
  isGameOver: boolean;
  direction: Direction;
}

const GameBoard: React.FC<GameBoardProps> = ({ rows, cols, snake, food, isGameOver, direction }) => {
  const getDirectionClass = (direction: Direction): string => {
    switch (direction) {
      case 'UP':
        return 'direction-up';
      case 'DOWN':
        return 'direction-down';
      case 'LEFT':
        return 'direction-left';
      case 'RIGHT':
        return 'direction-right';
      default:
        return 'direction-right';
    }
  };

  const getCellType = (x: number, y: number): 'empty' | 'snake-head' | 'snake-body' | 'food' => {
    if (snake.length > 0 && snake[0].x === x && snake[0].y === y) {
      return 'snake-head';
    }
    
    if (snake.slice(1).some(segment => segment.x === x && segment.y === y)) {
      return 'snake-body';
    }
    
    if (food.x === x && food.y === y) {
      return 'food';
    }
    
    return 'empty';
  };

  const getCellAriaLabel = (x: number, y: number): string => {
    const cellType = getCellType(x, y);
    switch (cellType) {
      case 'snake-head':
        return '蛇头';
      case 'snake-body':
        return '蛇身';
      case 'food':
        return '食物';
      default:
        return `空格子 ${x + 1}, ${y + 1}`;
    }
  };

  return (
    <div 
      className={`game-board ${isGameOver ? 'game-over' : ''}`}
      role="application"
      aria-label="贪吃蛇游戏棋盘"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: rows }, (_, y) =>
        Array.from({ length: cols }, (_, x) => {
          const cellType = getCellType(x, y);
          const isSnakeHead = cellType === 'snake-head';
          const directionClass = isSnakeHead ? getDirectionClass(direction) : '';
          
          return (
            <div
              key={`${x}-${y}`}
              className={`cell ${cellType} ${directionClass}`.trim()}
              aria-label={getCellAriaLabel(x, y)}
            />
          );
        })
      )}
    </div>
  );
};

export default GameBoard;