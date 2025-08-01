import React from 'react';
import type { Speed } from '../types';
import AnimatedScore from './AnimatedScore';

interface ControlPanelProps {
  score: number;
  highScore: number;
  isRunning: boolean;
  isGameOver: boolean;
  speed: Speed;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: Speed) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  score,
  highScore,
  isRunning,
  isGameOver,
  speed,
  onStart,
  onPause,
  onReset,
  onSpeedChange,
}) => {
  const handlePlayPause = () => {
    if (isGameOver) {
      onReset();
    } else if (isRunning) {
      onPause();
    } else {
      onStart();
    }
  };

  const getPlayPauseText = () => {
    if (isGameOver) return '重新开始';
    return isRunning ? '暂停' : '开始';
  };

  const speedOptions: { value: Speed; label: string }[] = [
    { value: 'slow', label: '慢' },
    { value: 'medium', label: '中' },
    { value: 'fast', label: '快' },
  ];

  return (
    <div className="control-panel">
      <div className="score-section">
        <div className="score-item">
          <span className="score-label">当前分数:</span>
          <AnimatedScore currentScore={score} />
        </div>
        <div className="score-item">
          <span className="score-label">最高分数:</span>
          <span className="score-value">{highScore}</span>
        </div>
      </div>

      <div className="controls-section">
        <button
          className="control-button primary"
          onClick={handlePlayPause}
          aria-pressed={isRunning}
        >
          {getPlayPauseText()}
        </button>

        <button
          className="control-button secondary"
          onClick={onReset}
          disabled={!isGameOver && score === 0}
        >
          重置游戏
        </button>
      </div>

      <div className="speed-section">
        <span className="speed-label">游戏速度:</span>
        <div className="speed-options" role="radiogroup" aria-label="选择游戏速度">
          {speedOptions.map(option => (
            <label key={option.value} className="speed-option">
              <input
                type="radio"
                name="speed"
                value={option.value}
                checked={speed === option.value}
                onChange={() => onSpeedChange(option.value)}
                disabled={isRunning}
                aria-describedby="speed-help"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        <small id="speed-help" className="speed-help">
          {isRunning ? '游戏进行中无法更改速度' : '选择游戏移动速度'}
        </small>
      </div>

      <div className="instructions">
        <h3>操作说明</h3>
        <ul>
          <li><kbd>↑</kbd> <kbd>W</kbd> 向上</li>
          <li><kbd>↓</kbd> <kbd>S</kbd> 向下</li>
          <li><kbd>←</kbd> <kbd>A</kbd> 向左</li>
          <li><kbd>→</kbd> <kbd>D</kbd> 向右</li>
          <li><kbd>空格</kbd> 暂停/继续</li>
          <li><kbd>R</kbd> 重新开始</li>
        </ul>
      </div>
    </div>
  );
};

export default ControlPanel;