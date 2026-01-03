// src/components/GameControls.tsx

import React from 'react';
import { useGameStore } from '../store/gameStore';
import './GameControls.scss';

const GameControls: React.FC = () => {
  const { undo, resetGame, phase, result, currentSide } = useGameStore();
  
  return (
    <div className="game-controls">
      <div className="game-status">
        {phase === 'checkmate' ? (
          <span className="status checkmate">
            游戏结束 - {result === 'red' ? '红方' : '黑方'} 获胜
          </span>
        ) : phase === 'check' ? (
          <span className="status check">
            {currentSide === 'red' ? '红方' : '黑方'} 被将军！
          </span>
        ) : (
          <span className="status normal">
            {currentSide === 'red' ? '红方' : '黑方'} 走棋
          </span>
        )}
      </div>
      
      <div className="control-buttons">
        <button 
          className="btn btn-undo" 
          onClick={undo}
          disabled={phase !== 'playing'}
        >
          悔棋
        </button>
        <button 
          className="btn btn-restart" 
          onClick={resetGame}
        >
          重新开始
        </button>
      </div>
    </div>
  );
};

export default GameControls;