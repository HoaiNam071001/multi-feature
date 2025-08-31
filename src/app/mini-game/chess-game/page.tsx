"use client";
import React, { useState } from 'react';
import { I18n } from "@/components/utils/I18n";

interface Position {
  row: number;
  col: number;
}

interface Piece {
  type: string; // 'pawn', 'rook', 'knight', 'bishop', 'queen', 'king'
  color: 'white' | 'black';
}

type Board = (Piece | null)[][];

const ChessGame: React.FC = () => {
  // Initial chess board setup
  const initialBoard: Board = [
    [
      { type: 'rook', color: 'black' },
      { type: 'knight', color: 'black' },
      { type: 'bishop', color: 'black' },
      { type: 'queen', color: 'black' },
      { type: 'king', color: 'black' },
      { type: 'bishop', color: 'black' },
      { type: 'knight', color: 'black' },
      { type: 'rook', color: 'black' },
    ],
    Array(8).fill(null).map(() => ({ type: 'pawn', color: 'black' })),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null).map(() => ({ type: 'pawn', color: 'white' })),
    [
      { type: 'rook', color: 'white' },
      { type: 'knight', color: 'white' },
      { type: 'bishop', color: 'white' },
      { type: 'queen', color: 'white' },
      { type: 'king', color: 'white' },
      { type: 'bishop', color: 'white' },
      { type: 'knight', color: 'white' },
      { type: 'rook', color: 'white' },
    ],
  ];

  const [board, setBoard] = useState<Board>(initialBoard);
  const [selected, setSelected] = useState<Position | null>(null);
  const [turn, setTurn] = useState<'white' | 'black'>('white');
  const [winner, setWinner] = useState<string | null>(null);

  // Piece symbols
  const pieceSymbols: { [key: string]: { white: string; black: string } } = {
    pawn: { white: '♙', black: '♟' },
    rook: { white: '♖', black: '♜' },
    knight: { white: '♘', black: '♞' },
    bishop: { white: '♗', black: '♝' },
    queen: { white: '♕', black: '♛' },
    king: { white: '♔', black: '♚' },
  };

  // Get valid moves for a piece
  const getValidMoves = (row: number, col: number): Position[] => {
    const piece = board[row][col];
    if (!piece) return [];
    const moves: Position[] = [];

    const addMove = (r: number, c: number) => {
      if (r >= 0 && r < 8 && c >= 0 && c < 8 && (!board[r][c] || board[r][c]!.color !== piece.color)) {
        moves.push({ row: r, col: c });
      }
    };

    if (piece.type === 'pawn') {
      const direction = piece.color === 'white' ? -1 : 1;
      const startRow = piece.color === 'white' ? 6 : 1;
      // Move forward
      if (!board[row + direction][col]) {
        addMove(row + direction, col);
        // Double move from start
        if (row === startRow && !board[row + 2 * direction][col]) {
          addMove(row + 2 * direction, col);
        }
      }
      // Capture diagonally
      if (board[row + direction][col - 1]?.color !== piece.color) {
        addMove(row + direction, col - 1);
      }
      if (board[row + direction][col + 1]?.color !== piece.color) {
        addMove(row + direction, col + 1);
      }
    } else if (piece.type === 'rook') {
      for (let i = row + 1; i < 8 && !board[i][col]; i++) addMove(i, col);
      for (let i = row - 1; i >= 0 && !board[i][col]; i--) addMove(i, col);
      for (let j = col + 1; j < 8 && !board[row][j]; j++) addMove(row, j);
      for (let j = col - 1; j >= 0 && !board[row][j]; j--) addMove(row, j);
    } else if (piece.type === 'knight') {
      const knightMoves = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1],
      ];
      knightMoves.forEach(([dr, dc]) => addMove(row + dr, col + dc));
    } else if (piece.type === 'bishop') {
      for (let i = 1; row + i < 8 && col + i < 8 && !board[row + i][col + i]; i++) addMove(row + i, col + i);
      for (let i = 1; row + i < 8 && col - i >= 0 && !board[row + i][col - i]; i++) addMove(row + i, col - i);
      for (let i = 1; row - i >= 0 && col + i < 8 && !board[row - i][col + i]; i++) addMove(row - i, col + i);
      for (let i = 1; row - i >= 0 && col - i >= 0 && !board[row - i][col - i]; i++) addMove(row - i, col - i);
    } else if (piece.type === 'queen') {
      // Combine rook and bishop moves
      for (let i = row + 1; i < 8 && !board[i][col]; i++) addMove(i, col);
      for (let i = row - 1; i >= 0 && !board[i][col]; i--) addMove(i, col);
      for (let j = col + 1; j < 8 && !board[row][j]; j++) addMove(row, j);
      for (let j = col - 1; j >= 0 && !board[row][j]; j--) addMove(row, j);
      for (let i = 1; row + i < 8 && col + i < 8 && !board[row + i][col + i]; i++) addMove(row + i, col + i);
      for (let i = 1; row + i < 8 && col - i >= 0 && !board[row + i][col - i]; i++) addMove(row + i, col - i);
      for (let i = 1; row - i >= 0 && col + i < 8 && !board[row - i][col + i]; i++) addMove(row - i, col + i);
      for (let i = 1; row - i >= 0 && col - i >= 0 && !board[row - i][col - i]; i++) addMove(row - i, col - i);
    } else if (piece.type === 'king') {
      const kingMoves = [
        [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1],
      ];
      kingMoves.forEach(([dr, dc]) => addMove(row + dr, col + dc));
    }

    return moves;
  };

  // Handle cell click
  const handleClick = (row: number, col: number): void => {
    if (winner) return;

    if (selected) {
      const validMoves = getValidMoves(selected.row, selected.col);
      if (validMoves.some(move => move.row === row && move.col === col)) {
        const newBoard = board.map(r => [...r]);
        const targetPiece = newBoard[row][col];
        newBoard[row][col] = newBoard[selected.row][selected.col];
        newBoard[selected.row][selected.col] = null;
        setBoard(newBoard);
        setTurn(turn === 'white' ? 'black' : 'white');
        setSelected(null);

        // Check for win (if king is captured)
        if (targetPiece?.type === 'king') {
          setWinner(turn === 'white' ? 'Trắng' : 'Đen');
        }
      } else {
        setSelected(null);
      }
    } else {
      const piece = board[row][col];
      if (piece && piece.color === turn) {
        setSelected({ row, col });
      }
    }
  };

  // Reset game
  const resetGame = (): void => {
    setBoard(initialBoard.map(row => [...row]));
    setSelected(null);
    setTurn('white');
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center justify-center pt-10 px-4">
      <h2 className="text-4xl font-extrabold text-blue-900 mb-4">
        <I18n value="Cờ Vua 2 Người" />
      </h2>
      <p className="text-lg text-gray-600 mb-6 max-w-md text-center">
        <I18n value="Hai người chơi thay phiên di chuyển quân cờ. Trắng đi trước!" />
      </p>

      {/* Turn and Controls */}
      <div className="flex items-center justify-between w-full max-w-md mb-6">
        <div className="bg-blue-100 text-blue-900 px-4 py-2 rounded-lg font-semibold">
          <I18n value="Lượt" />: {turn === 'white' ? <I18n value="Trắng" /> : <I18n value="Đen" />}
        </div>
        <button
          onClick={resetGame}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transform hover:scale-105 transition-all duration-200"
        >
          <I18n value="Chơi lại" />
        </button>
      </div>

      {/* Chess Board */}
      <div className="grid grid-cols-8 gap-0 w-96 h-96 bg-gray-200 rounded-lg shadow-lg">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const isValidMove =
              selected &&
              getValidMoves(selected.row, selected.col).some(
                move => move.row === rowIndex && move.col === colIndex
              );
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleClick(rowIndex, colIndex)}
                className={`w-12 h-12 flex items-center justify-center text-3xl cursor-pointer transition-all duration-200 ${
                  (rowIndex + colIndex) % 2 === 0 ? 'bg-gray-100' : 'bg-gray-400'
                } ${
                  selected?.row === rowIndex && selected?.col === colIndex
                    ? 'bg-blue-300'
                    : isValidMove
                    ? 'bg-green-200 hover:bg-green-300'
                    : 'hover:bg-gray-300'
                }`}
              >
                {piece ? pieceSymbols[piece.type][piece.color] : ''}
              </div>
            );
          })
        )}
      </div>

      {/* Game Status */}
      {winner && (
        <div className="mt-6 text-lg font-medium text-center text-green-600">
          <I18n value={`Chúc mừng! Người chơi ${winner} thắng! Nhấn "Chơi lại" để tiếp tục.`} />
        </div>
      )}
    </div>
  );
};

export default ChessGame;
