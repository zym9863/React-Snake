import React, { useState, useEffect } from 'react';

interface AnimatedScoreProps {
  currentScore: number;
  className?: string;
}

const AnimatedScore: React.FC<AnimatedScoreProps> = ({ currentScore, className = '' }) => {
  const [displayScore, setDisplayScore] = useState(currentScore);
  const [isAnimating, setIsAnimating] = useState(false);
  const [scoreIncrease, setScoreIncrease] = useState<number | null>(null);

  useEffect(() => {
    if (currentScore !== displayScore) {
      const increase = currentScore - displayScore;
      if (increase > 0) {
        setScoreIncrease(increase);
        setIsAnimating(true);
        
        // 显示增量动画
        setTimeout(() => {
          setScoreIncrease(null);
        }, 1000);
        
        // 更新分数
        setTimeout(() => {
          setDisplayScore(currentScore);
          setIsAnimating(false);
        }, 150);
      } else {
        setDisplayScore(currentScore);
      }
    }
  }, [currentScore, displayScore]);

  return (
    <div className={`animated-score ${className}`}>
      <span className={`score-value ${isAnimating ? 'score-bounce' : ''}`}>
        {displayScore}
      </span>
      {scoreIncrease && (
        <span className="score-increase">
          +{scoreIncrease}
        </span>
      )}
    </div>
  );
};

export default AnimatedScore;