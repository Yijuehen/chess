// src/components/ChessBoard.tsx

import React, { useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { BOARD_CONFIG, COLORS, PIECE_LABELS } from '../utils/constants';
import './ChessBoard.scss';

const ChessBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { 
    board, 
    selectedPos, 
    possibleMoves, 
    lastMove,
    selectSquare 
  } = useGameStore();
  
  const { CELL_SIZE, PADDING, PIECE_RADIUS } = BOARD_CONFIG;
  const canvasWidth = CELL_SIZE * 8 + PADDING * 2;
  const canvasHeight = CELL_SIZE * 9 + PADDING * 2;
  
  // 绘制棋盘网格
  const drawBoard = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = COLORS.BOARD_BG;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    ctx.strokeStyle = COLORS.GRID;
    ctx.lineWidth = 1;
    
    // 横线
    for (let i = 0; i < 10; i++) {
      const y = PADDING + i * CELL_SIZE;
      ctx.beginPath();
      ctx.moveTo(PADDING, y);
      ctx.lineTo(PADDING + 8 * CELL_SIZE, y);
      ctx.stroke();
    }
    
    // 竖线（上部分）
    for (let i = 0; i < 9; i++) {
      const x = PADDING + i * CELL_SIZE;
      ctx.beginPath();
      ctx.moveTo(x, PADDING);
      ctx.lineTo(x, PADDING + 4 * CELL_SIZE);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(x, PADDING + 5 * CELL_SIZE);
      ctx.lineTo(x, PADDING + 9 * CELL_SIZE);
      ctx.stroke();
    }
    
    // 九宫格斜线
    ctx.beginPath();
    ctx.moveTo(PADDING + 3 * CELL_SIZE, PADDING);
    ctx.lineTo(PADDING + 5 * CELL_SIZE, PADDING + 2 * CELL_SIZE);
    ctx.moveTo(PADDING + 3 * CELL_SIZE, PADDING + 2 * CELL_SIZE);
    ctx.lineTo(PADDING + 5 * CELL_SIZE, PADDING);
    ctx.moveTo(PADDING + 3 * CELL_SIZE, PADDING + 9 * CELL_SIZE);
    ctx.lineTo(PADDING + 5 * CELL_SIZE, PADDING + 7 * CELL_SIZE);
    ctx.moveTo(PADDING + 3 * CELL_SIZE, PADDING + 7 * CELL_SIZE);
    ctx.lineTo(PADDING + 5 * CELL_SIZE, PADDING + 9 * CELL_SIZE);
    ctx.stroke();
    
    // 楚河汉界
    ctx.fillStyle = COLORS.RIVER_BG;
    ctx.fillRect(PADDING, PADDING + 4 * CELL_SIZE, 8 * CELL_SIZE, CELL_SIZE);
    
    ctx.fillStyle = COLORS.GRID;
    ctx.font = 'bold 24px KaiTi';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('楚 河', PADDING + 1.5 * CELL_SIZE, PADDING + 4.5 * CELL_SIZE);
    ctx.fillText('汉 界', PADDING + 6.5 * CELL_SIZE, PADDING + 4.5 * CELL_SIZE);
    
    // 起始位置标记（十字星）
    const crossPositions = [
      [3, 0], [3, 2], [3, 7], [3, 9],
      [6, 0], [6, 2], [6, 7], [6, 9],
      [0, 3], [2, 3], [7, 3], [9, 3],
      [0, 6], [2, 6], [7, 6], [9, 6]
    ];
    
    crossPositions.forEach(([row, col]) => {
      const x = PADDING + col * CELL_SIZE;
      const y = PADDING + row * CELL_SIZE;
      
      const markSize = 3;
      ctx.beginPath();
      ctx.moveTo(x - markSize, y - markSize);
      ctx.lineTo(x + markSize, y + markSize);
      ctx.moveTo(x + markSize, y - markSize);
      ctx.lineTo(x - markSize, y + markSize);
      ctx.stroke();
    });
  }, [canvasWidth, canvasHeight, PADDING, CELL_SIZE]);
  
  // 绘制棋子
  const drawPieces = useCallback((ctx: CanvasRenderingContext2D) => {
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 9; col++) {
        const piece = board[row][col];
        if (!piece) continue;
        
        const x = PADDING + col * CELL_SIZE;
        const y = PADDING + row * CELL_SIZE;
        
        // 棋子阴影
        ctx.beginPath();
        ctx.arc(x + 2, y + 2, PIECE_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fill();
        
        // 棋子背景
        ctx.beginPath();
        ctx.arc(x, y, PIECE_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = '#f7e5b3';
        ctx.fill();
        ctx.strokeStyle = COLORS.GRID;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // 棋子文字
        const label = PIECE_LABELS[`${piece.type}-${piece.color}`];
        ctx.font = 'bold 22px KaiTi';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = piece.color === 'red' ? '#c81b1b' : '#111111';
        ctx.fillText(label, x, y);
        
        // 选中状态
        if (selectedPos?.row === row && selectedPos?.col === col) {
          ctx.beginPath();
          ctx.arc(x, y, PIECE_RADIUS + 3, 0, Math.PI * 2);
          ctx.strokeStyle = COLORS.SELECTED;
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      }
    }
  }, [board, selectedPos, PADDING, CELL_SIZE, PIECE_RADIUS]);
  
  // 绘制可走位置
  const drawPossibleMoves = useCallback((ctx: CanvasRenderingContext2D) => {
    possibleMoves.forEach(pos => {
      const x = PADDING + pos.col * CELL_SIZE;
      const y = PADDING + pos.row * CELL_SIZE;
      
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.POSSIBLE_MOVE;
      ctx.fill();
      
      // 如果目标位置有棋子，画圈提示
      if (board[pos.row][pos.col]) {
        ctx.beginPath();
        ctx.arc(x, y, PIECE_RADIUS, 0, Math.PI * 2);
        ctx.strokeStyle = COLORS.POSSIBLE_MOVE;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  }, [possibleMoves, board, PADDING, CELL_SIZE, PIECE_RADIUS]);
  
  // 绘制上一步
  const drawLastMove = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!lastMove) return;
    
    [lastMove.from, lastMove.to].forEach(pos => {
      const x = PADDING + pos.col * CELL_SIZE;
      const y = PADDING + pos.row * CELL_SIZE;
      
      ctx.fillStyle = COLORS.LAST_MOVE;
      ctx.fillRect(
        x - PIECE_RADIUS, 
        y - PIECE_RADIUS, 
        PIECE_RADIUS * 2, 
        PIECE_RADIUS * 2
      );
    });
  }, [lastMove, PADDING, CELL_SIZE, PIECE_RADIUS]);
  
  // 主渲染函数
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawBoard(ctx);
    drawLastMove(ctx);
    drawPieces(ctx);
    drawPossibleMoves(ctx);
  }, [canvasWidth, canvasHeight, drawBoard, drawPieces, drawPossibleMoves, drawLastMove]);
  
  // 监听状态变化重新渲染
  useEffect(() => {
    render();
  }, [render]);
  
  // 点击处理
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    const col = Math.round((x - PADDING) / CELL_SIZE);
    const row = Math.round((y - PADDING) / CELL_SIZE);
    
    if (row >= 0 && row < 10 && col >= 0 && col < 9) {
      selectSquare(row, col);
    }
  };
  
  return (
    <div className="chess-board-container">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onClick={handleClick}
        className="chess-board"
        style={{ 
          width: '100%', 
          height: 'auto', 
          maxWidth: `${canvasWidth}px`,
          cursor: 'pointer'
        }}
      />
    </div>
  );
};

export default ChessBoard;