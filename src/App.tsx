import { useEffect } from 'react';
import { useSnakeGame } from './game/useSnakeGame';
import GameBoard from './components/GameBoard';
import ControlPanel from './components/ControlPanel';
import AnimatedBackground from './components/AnimatedBackground';
import './App.css';

function App() {
  const { state, config, start, pause, reset, setSpeed, handleKeyDown } = useSnakeGame();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      handleKeyDown(e);
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyDown]);

  return (
    <div className="app" tabIndex={0}>
      <AnimatedBackground />
      <header className="app-header">
        <h1>React 贪吃蛇</h1>
        {state.isGameOver && (
          <div className="game-over-message" role="alert">
            游戏结束！最终得分: {state.score}
          </div>
        )}
      </header>

      <main className="app-main">
        <div className="game-container">
          <GameBoard
            rows={config.rows}
            cols={config.cols}
            snake={state.snake}
            food={state.food}
            isGameOver={state.isGameOver}
            direction={state.direction}
          />
        </div>

        <div className="control-container">
          <ControlPanel
            score={state.score}
            highScore={state.highScore}
            isRunning={state.isRunning}
            isGameOver={state.isGameOver}
            speed={config.speed}
            onStart={start}
            onPause={pause}
            onReset={reset}
            onSpeedChange={setSpeed}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>点击游戏区域或控制面板以确保键盘控制生效</p>
      </footer>
    </div>
  );
}

export default App;
