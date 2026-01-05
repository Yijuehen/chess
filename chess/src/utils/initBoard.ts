// src/utils/initBoard.ts

import type { BoardState, Piece } from '../types/index';

export const createEmptyBoard = (): BoardState => {
  return Array(10).fill(null).map(() => Array(9).fill(null));
};

export const initBoard = (): BoardState => {
  const board = createEmptyBoard();
  
  // 黑方棋子 (0-2行)
  board[0][0] = { type: 'chariot', color: 'black', id: 'b_chariot_0' };
  board[0][1] = { type: 'horse', color: 'black', id: 'b_horse_0' };
  board[0][2] = { type: 'elephant', color: 'black', id: 'b_elephant_0' };
  board[0][3] = { type: 'advisor', color: 'black', id: 'b_advisor_0' };
  board[0][4] = { type: 'general', color: 'black', id: 'b_general_0' };
  board[0][5] = { type: 'advisor', color: 'black', id: 'b_advisor_1' };
  board[0][6] = { type: 'elephant', color: 'black', id: 'b_elephant_1' };
  board[0][7] = { type: 'horse', color: 'black', id: 'b_horse_1' };
  board[0][8] = { type: 'chariot', color: 'black', id: 'b_chariot_1' };
  
  board[2][1] = { type: 'cannon', color: 'black', id: 'b_cannon_0' };
  board[2][7] = { type: 'cannon', color: 'black', id: 'b_cannon_1' };
  
  board[3][0] = { type: 'soldier', color: 'black', id: 'b_soldier_0' };
  board[3][2] = { type: 'soldier', color: 'black', id: 'b_soldier_1' };
  board[3][4] = { type: 'soldier', color: 'black', id: 'b_soldier_2' };
  board[3][6] = { type: 'soldier', color: 'black', id: 'b_soldier_3' };
  board[3][8] = { type: 'soldier', color: 'black', id: 'b_soldier_4' };
  
  // 红方棋子 (7-9行)
  board[9][0] = { type: 'chariot', color: 'red', id: 'r_chariot_0' };
  board[9][1] = { type: 'horse', color: 'red', id: 'r_horse_0' };
  board[9][2] = { type: 'elephant', color: 'red', id: 'r_elephant_0' };
  board[9][3] = { type: 'advisor', color: 'red', id: 'r_advisor_0' };
  board[9][4] = { type: 'general', color: 'red', id: 'r_general_0' };
  board[9][5] = { type: 'advisor', color: 'red', id: 'r_advisor_1' };
  board[9][6] = { type: 'elephant', color: 'red', id: 'r_elephant_1' };
  board[9][7] = { type: 'horse', color: 'red', id: 'r_horse_1' };
  board[9][8] = { type: 'chariot', color: 'red', id: 'r_chariot_1' };
  
  board[7][1] = { type: 'cannon', color: 'red', id: 'r_cannon_0' };
  board[7][7] = { type: 'cannon', color: 'red', id: 'r_cannon_1' };
  
  board[6][0] = { type: 'soldier', color: 'red', id: 'r_soldier_0' };
  board[6][2] = { type: 'soldier', color: 'red', id: 'r_soldier_1' };
  board[6][4] = { type: 'soldier', color: 'red', id: 'r_soldier_2' };
  board[6][6] = { type: 'soldier', color: 'red', id: 'r_soldier_3' };
  board[6][8] = { type: 'soldier', color: 'red', id: 'r_soldier_4' };
  
  return board;
};

// 复制棋盘
export const copyBoard = (board: BoardState): BoardState => {
  return board.map(row => row.map(cell => cell ? { ...cell } : null));
};