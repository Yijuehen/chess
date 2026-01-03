// src/types/index.ts

// 棋方颜色
export type Color = 'red' | 'black';

// 棋子类型
export type PieceType = 
  | 'general'   // 将/帅
  | 'advisor'   // 士/仕
  | 'elephant'  // 象/相
  | 'horse'     // 马
  | 'chariot'   // 车
  | 'cannon'    // 炮
  | 'soldier';  // 兵/卒

// 位置坐标
export interface Position {
  row: number;  // 0-9 (行)
  col: number;  // 0-8 (列)
}

// 棋子信息
export interface Piece {
  type: PieceType;
  color: Color;
  id: string;   // 唯一标识
}

// 棋盘状态（10行 x 9列）
export type BoardState = (Piece | null)[][];

// 走棋记录
export interface MoveRecord {
  from: Position;
  to: Position;
  piece: Piece;
  capturedPiece?: Piece;
  notation: string; // 棋谱记法
  timestamp: number;
}

// 游戏状态
export type GamePhase = 'idle' | 'playing' | 'check' | 'checkmate' | 'draw';

// 游戏结果
export type GameResult = Color | 'draw' | null;