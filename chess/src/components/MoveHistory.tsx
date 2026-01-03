// src/components/MoveHistory.tsx

import React from 'react';
import { useGameStore } from '../store/gameStore';
import './MoveHistory.scss';

const MoveHistory: React.FC = () => {
  const { board, history } = useGameStore();
  
  // 计算当前步数
  const moveNumber = history.length + 1;
  
  return (
    <div className="move-history">
      <h3>走棋记录</h3>
      <div className="moves-list">
        {history.length === 0 ? (
          <p className="empty-message">暂无走棋记录</p>
        ) : (
          history.map((state, index) => {
            const moveIndex = Math.floor(index / 2);
            const isRedMove = index % 2 === 0;
            
            return (
              <div key={index} className="move-item">
                <span className="move-number">{moveNumber}.</span>
                <span className={`move-side ${isRedMove ? 'red' : 'black'}`}>
                  {isRedMove ? '红方' : '黑方'}
                </span>
                <span className="move-notation">
                  {/* 这里可以显示实际走棋记录 */}
                  第{index + 1}步
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MoveHistory;