// src/utils/constants.ts

// 棋盘尺寸配置
export const BOARD_CONFIG = {
  ROWS: 10,          // 10行
  COLS: 9,           // 9列
  CELL_SIZE: 60,     // 格子大小（像素）
  PADDING: 30,       // 棋盘边缘padding
  PIECE_RADIUS: 25,  // 棋子半径
};

// 颜色配置
export const COLORS = {
  BOARD_BG: '#eecfa1',           // 棋盘背景（木色）
  GRID: '#5e4018',               // 网格线颜色
  HIGHLIGHT: 'rgba(76, 175, 80, 0.5)',    // 高亮颜色
  SELECTED: 'rgba(255, 235, 59, 0.6)',    // 选中颜色
  POSSIBLE_MOVE: 'rgba(76, 175, 80, 0.8)', // 可走位置
  LAST_MOVE: 'rgba(255, 193, 7, 0.4)',    // 上一步标记
  RIVER_BG: '#d4b896',           // 楚河汉界背景
  TEXT: '#333333',               // 默认文字颜色
};

// 棋子文字映射
export const PIECE_LABELS: Record<string, string> = {
  'general-red': '帅',
  'general-black': '将',
  'advisor-red': '仕',
  'advisor-black': '士',
  'elephant-red': '相',
  'elephant-black': '象',
  'horse-red': '馬',
  'horse-black': '馬',
  'chariot-red': '車',
  'chariot-black': '車',
  'cannon-red': '炮',
  'cannon-black': '炮',
  'soldier-red': '兵',
  'soldier-black': '卒',
};

// 九宫格范围
export const PALACE: Record<string, { rows: number[]; cols: number[] }> = {
  red: { rows: [7, 8, 9], cols: [3, 4, 5] },
  black: { rows: [0, 1, 2], cols: [3, 4, 5] },
};