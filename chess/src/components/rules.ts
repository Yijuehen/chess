// src/utils/rules.ts

import { BoardState, Position, Piece, Color, PieceType } from '../types/index';
import { PALACE } from './constants';

// 验证位置是否在棋盘内
export const isValidPosition = (row: number, col: number): boolean => {
  return row >= 0 && row < 10 && col >= 0 && col < 9;
};

// 验证棋子能否移动到目标位置
export const canMoveTo = (
  board: BoardState,
  from: Position,
  to: Position,
  color: Color
): boolean => {
  const piece = board[from.row][from.col];
  if (!piece || piece.color !== color) return false;
  
  const target = board[to.row][to.col];
  if (target && target.color === color) return false;
  
  return validatePieceMove(piece.type, from, to, board, color);
};

// 验证各类棋子的走法
const validatePieceMove = (
  type: PieceType,
  from: Position,
  to: Position,
  board: BoardState,
  color: Color
): boolean => {
  const rowDiff = Math.abs(to.row - from.row);
  const colDiff = Math.abs(to.col - from.col);
  
  switch (type) {
    case 'chariot': // 車：直线移动
      if (rowDiff === 0 || colDiff === 0) {
        return isPathClear(board, from.row, from.col, to.row, to.col);
      }
      return false;
      
    case 'horse': // 马：日字形，可能蹩马腿
      if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) {
        return !isHorseBlocked(from, to, board);
      }
      return false;
      
    case 'elephant': // 象：田字形，不能过河
      if (rowDiff === 2 && colDiff === 2) {
        if (!isInPalace(to.row, to.col, color) && isAcrossRiver(to.row, color)) {
          return false;
        }
        const midRow = (from.row + to.row) / 2;
        const midCol = (from.col + to.col) / 2;
        return board[midRow][midCol] === null;
      }
      return false;
      
    case 'advisor': // 士：斜走一格，只能在九宫
      if (rowDiff === 1 && colDiff === 1) {
        return isInPalace(to.row, to.col, color);
      }
      return false;
      
    case 'general': // 将/帅：直线一格，只能在九宫，或直接对面
      if (rowDiff + colDiff === 1) {
        return isInPalace(to.row, to.col, color);
      }
      // 将帅对面
      if (colDiff === 0 && rowDiff > 0) {
        return !isGeneralFacing(from, to, board, color);
      }
      return false;
      
    case 'cannon': // 炮：直线移动，吃子时只隔一个子
      if (rowDiff === 0 || colDiff === 0) {
        return validateCannonMove(board, from, to);
      }
      return false;
      
    case 'soldier': // 兵：过河前只能向前，过河后可平移
      if (rowDiff + colDiff !== 1) return false;
      
      if (color === 'red') {
        if (from.row >= 5) {
          return to.row === from.row - 1 && to.col === from.col;
        } else {
          return (to.row === from.row - 1 && to.col === from.col) ||
                 (to.row === from.row && Math.abs(to.col - from.col) === 1);
        }
      } else {
        if (from.row <= 4) {
          return to.row === from.row + 1 && to.col === from.col;
        } else {
          return (to.row === from.row + 1 && to.col === from.col) ||
                 (to.row === from.row && Math.abs(to.col - from.col) === 1);
        }
      }
      
    default:
      return false;
  }
};

// 检查路径是否有阻挡
const isPathClear = (
  board: BoardState,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
): boolean => {
  if (fromRow === toRow) {
    const step = toCol > fromCol ? 1 : -1;
    for (let col = fromCol + step; col !== toCol; col += step) {
      if (board[fromRow][col] !== null) return false;
    }
  } else if (fromCol === toCol) {
    const step = toRow > fromRow ? 1 : -1;
    for (let row = fromRow + step; row !== toRow; row += step) {
      if (board[row][fromCol] !== null) return false;
    }
  }
  return true;
};

// 检查马是否被蹩腿
const isHorseBlocked = (from: Position, to: Position, board: BoardState): boolean => {
  if (Math.abs(to.row - from.row) === 2) {
    const midRow = (from.row + to.row) / 2;
    return board[midRow][from.col] !== null;
  } else {
    const midCol = (from.col + to.col) / 2;
    return board[from.row][midCol] !== null;
  }
};

// 检查是否在九宫内
const isInPalace = (row: number, col: number, color: Color): boolean => {
  const palace = PALACE[color];
  return palace.rows.includes(row) && palace.cols.includes(col);
};

// 检查象是否过河
const isAcrossRiver = (row: number, color: Color): boolean => {
  return color === 'red' ? row < 5 : row > 4;
};

// 检查将帅是否对面
const isGeneralFacing = (
  from: Position,
  to: Position,
  board: BoardState,
  color: Color
): boolean => {
  const step = to.row > from.row ? 1 : -1;
  for (let row = from.row + step; row !== to.row; row += step) {
    if (board[row][from.col] !== null) return false;
  }
  return true;
};

// 验证炮的走法
const validateCannonMove = (
  board: BoardState,
  from: Position,
  to: Position
): boolean => {
  const target = board[to.row][to.col];
  let count = 0;
  
  if (from.row === to.row) {
    const step = to.col > from.col ? 1 : -1;
    for (let col = from.col + step; col !== to.col; col += step) {
      if (board[from.row][col] !== null) count++;
    }
  } else {
    const step = to.row > from.row ? 1 : -1;
    for (let row = from.row + step; row !== to.row; row += step) {
      if (board[row][from.col] !== null) count++;
    }
  }
  
  if (target) {
    return count === 1; // 吃子时必须正好隔一个子
  }
  return count === 0; // 移动时不能有子阻挡
};

// 获取棋子的所有合法走法
export const getValidMoves = (
  board: BoardState,
  row: number,
  col: number
): Position[] => {
  const piece = board[row][col];
  if (!piece) return [];
  
  const moves: Position[] = [];
  
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      if (canMoveTo(board, { row: r, col: c }, { row, col }, piece.color)) {
        moves.push({ row: r, col: c });
      }
    }
  }
  
  return moves;
};

// 检查是否被将军
export const isInCheck = (board: BoardState, color: Color): boolean => {
  let generalPos: Position | null = null;
  
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c];
      if (piece && piece.type === 'general' && piece.color === color) {
        generalPos = { row: r, col: c };
        break;
      }
    }
    if (generalPos) break;
  }
  
  if (!generalPos) return false;
  
  const oppositeColor = color === 'red' ? 'black' : 'red';
  
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c];
      if (piece && piece.color === oppositeColor) {
        if (canMoveTo(board, { row: r, col: c }, generalPos!, oppositeColor)) {
          return true;
        }
      }
    }
  }
  
  return false;
};

// 检查是否将死
export const isCheckmate = (board: BoardState, color: Color): boolean => {
  if (!isInCheck(board, color)) return false;
  
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c];
      if (piece && piece.color === color) {
        const moves = getValidMoves(board, r, c);
        for (const move of moves) {
          const newBoard = copyBoard(board);
          newBoard[move.row][move.col] = newBoard[r][c];
          newBoard[r][c] = null;
          
          if (!isInCheck(newBoard, color)) {
            return false;
          }
        }
      }
    }
  }
  
  return true;
};

// 生成棋谱记法
export const generateNotation = (
  piece: Piece,
  from: Position,
  to: Position,
  captured: boolean
): string => {
  const labels: Record<PieceType, string> = {
    general: '将',
    advisor: '士',
    elephant: '象',
    horse: '馬',
    chariot: '車',
    cannon: '炮',
    soldier: '兵',
  };
  
  const colLabels = '一二三四五六七八九';
  const rowLabels = '1234567890';
  
  const fromCol = colLabels[from.col];
  const toCol = colLabels[to.col];
  
  // 判断是进、退、平
  let direction = '';
  if (piece.color === 'red') {
    if (to.row < from.row) direction = '进';
    else if (to.row > from.row) direction = '退';
    else direction = '平';
  } else {
    if (to.row > from.row) direction = '进';
    else if (to.row < from.row) direction = '退';
    else direction = '平';
  }
  
  return `${labels[piece.type]}${fromCol}${direction}${toCol}${captured ? '吃' : ''}`;
};