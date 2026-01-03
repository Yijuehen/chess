// src/store/gameStore.ts

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { 
  BoardState, 
  Position, 
  Color, 
  MoveRecord, 
  GamePhase, 
  GameResult 
} from '../types/index';
import { initBoard, copyBoard } from '../utils/initBoard';
import { canMoveTo, isInCheck, isCheckmate, generateNotation } from '../utils/rules';

interface GameState {
  // 棋盘状态
  board: BoardState;
  currentSide: Color;
  phase: GamePhase;
  result: GameResult;
  
  // 交互状态
  selectedPos: Position | null;
  possibleMoves: Position[];
  lastMove: { from: Position; to: Position } | null;
  
  // 历史记录（悔棋用）
  history: Array<{
    board: BoardState;
    currentSide: Color;
  }>;
  
  // _actions
  selectSquare: (row: number, col: number) => void;
  movePiece: (to: Position) => boolean;
  undo: () => void;
  resetGame: () => void;
  getValidMoves: (row: number, col: number) => Position[];
}

export const useGameStore = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    // 初始状态
    board: initBoard(),
    currentSide: 'red',
    phase: 'playing',
    result: null,
    selectedPos: null,
    possibleMoves: [],
    lastMove: null,
    history: [],
    
    // 选择棋子
    selectSquare: (row: number, col: number) => {
      const { board, currentSide, selectedPos } = get();
      const piece = board[row][col];
      
      // 如果已选中棋子
      if (selectedPos) {
        const canMove = canMoveTo(
          board, 
          selectedPos, 
          { row, col }, 
          currentSide
        );
        
        if (canMove) {
          // 执行移动
          get().movePiece({ row, col });
          return;
        }
        
        // 如果点击的是己方棋子，更换选择
        if (piece && piece.color === currentSide) {
          const moves = get().getValidMoves(row, col);
          set({ selectedPos: { row, col }, possibleMoves: moves });
        } else {
          // 点击其他地方，取消选择
          set({ selectedPos: null, possibleMoves: [] });
        }
      } else {
        // 选择棋子
        if (piece && piece.color === currentSide) {
          const moves = get().getValidMoves(row, col);
          set({ selectedPos: { row, col }, possibleMoves: moves });
        }
      }
    },
    
    // 执行移动
    movePiece: (to: Position) => {
      const { board, currentSide, selectedPos, history } = get();
      if (!selectedPos) return false;
      
      const piece = board[selectedPos.row][selectedPos.col];
      if (!piece) return false;
      
      const target = board[to.row][to.col];
      const captured = target || undefined;
      
      // 保存历史
      const newHistory = [...history, {
        board: copyBoard(board),
        currentSide
      }];
      
      // 更新棋盘
      const newBoard = copyBoard(board);
      newBoard[to.row][to.col] = piece;
      newBoard[selectedPos.row][selectedPos.col] = null;
      
      // 检查是否被将军
      const nextSide = currentSide === 'red' ? 'black' : 'red';
      const isNextInCheck = isInCheck(newBoard, nextSide);
      const isCheckmated = isCheckmate(newBoard, nextSide);
      
      // 检查当前方是否走完后被将军（帅走）
      const isSelfInCheck = isInCheck(newBoard, currentSide);
      
      let phase: GamePhase = 'playing';
      let result: GameResult = null;
      
      if (isCheckmated) {
        phase = 'checkmate';
        result = currentSide;
      } else if (isSelfInCheck) {
        phase = 'check';
      } else if (isNextInCheck) {
        phase = 'check';
      }
      
      // 添加走棋记录
      const notation = generateNotation(piece, selectedPos, to, !!captured);
      const moveRecord: MoveRecord = {
        from: selectedPos,
        to,
        piece,
        capturedPiece: captured,
        notation,
        timestamp: Date.now(),
      };
      
      set({
        board: newBoard,
        currentSide: nextSide,
        phase,
        result,
        selectedPos: null,
        possibleMoves: [],
        lastMove: { from: selectedPos, to },
        history: newHistory
      });
      
      return true;
    },
    
    // 悔棋
    undo: () => {
      const { history } = get();
      if (history.length === 0) return;
      
      const lastState = history[history.length - 1];
      set({
        board: copyBoard(lastState.board),
        currentSide: lastState.currentSide,
        phase: 'playing',
        result: null,
        selectedPos: null,
        possibleMoves: [],
        lastMove: null,
        history: history.slice(0, -1)
      });
    },
    
    // 重置游戏
    resetGame: () => {
      set({
        board: initBoard(),
        currentSide: 'red',
        phase: 'playing',
        result: null,
        selectedPos: null,
        possibleMoves: [],
        lastMove: null,
        history: []
      });
    },
    
    // 获取合法走法
    getValidMoves: (row: number, col: number) => {
      const { board } = get();
      return get().possibleMoves.length > 0 && 
             get().selectedPos?.row === row && 
             get().selectedPos?.col === col
        ? get().possibleMoves
        : [];
    }
  }))
);