"use client";
import { I18n } from "@/components/utils/I18n";
import React, { useEffect, useState } from 'react';

type Board = number[][];

const Game2048: React.FC = () => {
  const initialBoard: Board = Array(4).fill(0).map(() => Array(4).fill(0));

  const [board, setBoard] = useState<Board>(initialBoard);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);

  // Initialize board with two random tiles
  const initializeBoard = (): void => {
    const newBoard = initialBoard.map(row => [...row]);
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  // Add a random tile (2 or 4)
  const addRandomTile = (board: Board): void => {
    const emptyCells: [number, number][] = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) emptyCells.push([i, j]);
      }
    }
    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  // Handle key press for movement
  const handleKeyPress = (e: KeyboardEvent): void => {
    if (gameOver || won) return;
    let newBoard = board.map(row => [...row]);
    let moved = false;
    let scoreIncrement = 0;

    if (e.key === 'ArrowUp') {
      [newBoard, moved, scoreIncrement] = moveUp(newBoard);
    } else if (e.key === 'ArrowDown') {
      [newBoard, moved, scoreIncrement] = moveDown(newBoard);
    } else if (e.key === 'ArrowLeft') {
      [newBoard, moved, scoreIncrement] = moveLeft(newBoard);
    } else if (e.key === 'ArrowRight') {
      [newBoard, moved, scoreIncrement] = moveRight(newBoard);
    }

    if (moved) {
      addRandomTile(newBoard);
      setBoard(newBoard);
      setScore(prevScore => prevScore + scoreIncrement);
      if (checkWin(newBoard)) setWon(true);
      if (!canMove(newBoard)) setGameOver(true);
    }
  };

  // Move tiles left
  const moveLeft = (board: Board): [Board, boolean, number] => {
    let moved = false;
    let scoreIncrement = 0;
    const newBoard = board.map(row => {
      const newRow = row.filter(val => val !== 0);
      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          scoreIncrement += newRow[i];
          newRow.splice(i + 1, 1);
          moved = true;
        }
      }
      while (newRow.length < 4) newRow.push(0);
      if (newRow.some((val, idx) => val !== row[idx])) moved = true;
      return newRow;
    });
    return [newBoard, moved, scoreIncrement];
  };

  // Move tiles right
  const moveRight = (board: Board): [Board, boolean, number] => {
    const reversedBoard = board.map(row => [...row].reverse());
    const [newBoard, moved, scoreIncrement] = moveLeft(reversedBoard);
    return [newBoard.map(row => [...row].reverse()), moved, scoreIncrement];
  };

  // Move tiles up
  const moveUp = (board: Board): [Board, boolean, number] => {
    const transposed = transpose(board);
    const [newBoard, moved, scoreIncrement] = moveLeft(transposed);
    return [transpose(newBoard), moved, scoreIncrement];
  };

  // Move tiles down
  const moveDown = (board: Board): [Board, boolean, number] => {
    const transposed = transpose(board);
    const reversedBoard = transposed.map(row => [...row].reverse());
    const [newBoard, moved, scoreIncrement] = moveLeft(reversedBoard);
    return [transpose(newBoard.map(row => [...row].reverse())), moved, scoreIncrement];
  };

  // Transpose matrix for up/down movements
  const transpose = (board: Board): Board => {
    return board[0].map((_, colIndex) => board.map(row => row[colIndex]));
  };

  // Check if player has won (reached 2048)
  const checkWin = (board: Board): boolean => {
    return board.some(row => row.includes(2048));
  };

  // Check if no moves are possible
  const canMove = (board: Board): boolean => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) return true;
        if (j < 3 && board[i][j] === board[i][j + 1]) return true;
        if (i < 3 && board[i][j] === board[i + 1][j]) return true;
      }
    }
    return false;
  };

  // Reset game
  const resetGame = (): void => {
    initializeBoard();
  };

  // Initialize on mount and add keypress listener
  useEffect(() => {
    initializeBoard();
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tile color mapping
  const tileColors: { [key: number]: string } = {
    0: 'bg-gray-100',
    2: 'bg-yellow-100',
    4: 'bg-yellow-200',
    8: 'bg-orange-200',
    16: 'bg-orange-300',
    32: 'bg-orange-400',
    64: 'bg-red-300',
    128: 'bg-red-400',
    256: 'bg-red-500',
    512: 'bg-purple-400',
    1024: 'bg-purple-500',
    2048: 'bg-green-500',
  };

  return (
    <div className="flex flex-col items-center justify-center pt-10 px-4">
      <h2 className="text-4xl font-extrabold text-blue-900 mb-4">
        <I18n value="2048" />
      </h2>
      <p className="text-lg text-gray-600 mb-6 max-w-md text-center">
        <I18n value="Di chuyển các ô số bằng phím mũi tên để gộp chúng và đạt được ô 2048!" />
      </p>

      {/* Score and Controls */}
      <div className="flex items-center justify-between w-full max-w-md mb-6">
        <div className="bg-blue-100 text-blue-900 px-4 py-2 rounded-lg font-semibold">
          <I18n value="Điểm" />: {score}
        </div>
        <button
          onClick={resetGame}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transform hover:scale-105 transition-all duration-200"
        >
          <I18n value="Chơi lại" />
        </button>
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-4 gap-2 bg-gray-300 p-4 rounded-lg shadow-lg w-80 h-80">
        {board.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-16 h-16 flex items-center justify-center rounded-md text-white font-bold text-xl transition-all duration-200 ${
                tileColors[tile] || 'bg-blue-600'
              } ${tile === 0 ? 'opacity-0' : 'opacity-100'}`}
            >
              {tile !== 0 && tile}
            </div>
          ))
        )}
      </div>

      {/* Game Status */}
      {(gameOver || won) && (
        <div className="mt-6 text-lg font-medium text-center">
          {won && (
            <p className="text-green-600">
              <I18n value="Chúc mừng! Bạn đã đạt 2048! Nhấn 'Chơi lại' để tiếp tục." />
            </p>
          )}
          {gameOver && !won && (
            <p className="text-red-600">
              <I18n value="Hết lượt đi! Nhấn 'Chơi lại' để thử lại." />
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Game2048;
