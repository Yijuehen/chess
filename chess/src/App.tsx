// src/App.tsx

import React from 'react';
import ChessBoard from './components/ChessBoard';
import GameControls from './components/GameControls';
import MoveHistory from './components/MoveHistory';
import './App.scss';

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>中国象棋</h1>
        <p className="subtitle">单机对弈</p>
      </header>
      
      <main className="app-main">
        <div className="game-area">
          <ChessBoard />
          <GameControls />
        </div>
        
        <aside className="sidebar">
          <MoveHistory />
        </aside>
      </main>
    </div>
  );
};

export default App;