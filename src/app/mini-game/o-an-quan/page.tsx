"use client";
import { I18n } from '@/components/utils/I18n';
import React, { useState } from 'react';

interface Cell {
  stones: number;
  isQuan: boolean; // true for quan cells
  owner: number | null; // 1 for Player 1, 2 for Player 2, null for dân cells
}

const OAnQuan: React.FC = () => {
  // Initial board: 2 quan cells (0 stones) + 10 dân cells (5 stones each)
  const initialBoard: Cell[] = [
    { stones: 0, isQuan: true, owner: 1 }, // Quan Player 1 (index 0)
    { stones: 5, isQuan: false, owner: null }, // Dân
    { stones: 5, isQuan: false, owner: null },
    { stones: 5, isQuan: false, owner: null },
    { stones: 5, isQuan: false, owner: null },
    { stones: 5, isQuan: false, owner: null },
    { stones: 0, isQuan: true, owner: 2 }, // Quan Player 2 (index 6)
    { stones: 5, isQuan: false, owner: null }, // Dân
    { stones: 5, isQuan: false, owner: null },
    { stones: 5, isQuan: false, owner: null },
    { stones: 5, isQuan: false, owner: null },
    { stones: 5, isQuan: false, owner: null },
  ];

  const [board, setBoard] = useState<Cell[]>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<number>(1);
  const [winner, setWinner] = useState<string | null>(null);
  const [animating, setAnimating] = useState<boolean>(false);
  const [animationPath, setAnimationPath] = useState<number[]>([]);

  // Check if game is over
  const checkGameOver = (newBoard: Cell[]): boolean => {
    const player1Cells = [1, 2, 3, 4, 5];
    const player2Cells = [7, 8, 9, 10, 11];
    const player1HasStones = player1Cells.some(index => newBoard[index].stones > 0);
    const player2HasStones = player2Cells.some(index => newBoard[index].stones > 0);
    return !player1HasStones || !player2HasStones;
  };

  // Handle move
  const handleMove = async (index: number, direction: 'left' | 'right'): Promise<void> => {
    if (animating || winner) return;
    if (board[index].isQuan || board[index].stones === 0) return;
    if (currentPlayer === 1 && ![1, 2, 3, 4, 5].includes(index)) return;
    if (currentPlayer === 2 && ![7, 8, 9, 10, 11].includes(index)) return;

    setAnimating(true);
    const newBoard = [...board];
    const stones = newBoard[index].stones;
    newBoard[index].stones = 0;
    setBoard([...newBoard]);

    // Animation path for stones
    const path: number[] = [];
    let currentIndex = index;
    for (let i = 0; i < stones; i++) {
      currentIndex = direction === 'right' ? (currentIndex + 1) % 12 : (currentIndex - 1 + 12) % 12;
      path.push(currentIndex);
    }

    setAnimationPath(path);

    // Animate stone distribution
    for (let i = 0; i < path.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500)); // 0.5s per stone
      newBoard[path[i]].stones += 1;
      setBoard([...newBoard]);
    }

    // Handle capture
    let nextIndex = direction === 'right' ? (path[path.length - 1] + 1) % 12 : (path[path.length - 1] - 1 + 12) % 12;
    const quanIndex = currentPlayer === 1 ? 0 : 6;

    while (newBoard[nextIndex].stones === 0 && !newBoard[nextIndex].isQuan) {
      const captureIndex = direction === 'right' ? (nextIndex + 1) % 12 : (nextIndex - 1 + 12) % 12;
      if (newBoard[captureIndex].stones > 0 && !newBoard[captureIndex].isQuan) {
        newBoard[quanIndex].stones += newBoard[captureIndex].stones;
        newBoard[captureIndex].stones = 0;
        setBoard([...newBoard]);
        await new Promise(resolve => setTimeout(resolve, 500)); // Animation delay
      }
      nextIndex = direction === 'right' ? (captureIndex + 1) % 12 : (captureIndex - 1 + 12) % 12;
    }

    setAnimationPath([]);
    setAnimating(false);

    // Check game over
    if (checkGameOver(newBoard)) {
      const player1Score = newBoard[0].stones;
      const player2Score = newBoard[6].stones;
      if (player1Score > player2Score) setWinner('Người 1');
      else if (player2Score > player1Score) setWinner('Người 2');
      else setWinner('Hòa');
    } else {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  };

  // Reset game
  const resetGame = (): void => {
    setBoard(initialBoard.map(cell => ({ ...cell })));
    setCurrentPlayer(1);
    setWinner(null);
    setAnimating(false);
    setAnimationPath([]);
  };

  return (
    <div className="flex flex-col items-center justify-center pt-10 px-4">
      <h2 className="text-4xl font-extrabold text-blue-900 mb-4">Ô Ăn Quan</h2>
      <p className="text-lg text-gray-600 mb-6 max-w-md text-center">
        Hai người chơi thay phiên rải đá và ăn quan. Người 1 bắt đầu!
      </p>

      {/* Turn and Controls */}
      <div className="flex items-center justify-between w-full max-w-md mb-6">
        <div className="bg-blue-100 text-blue-900 px-4 py-2 rounded-lg font-semibold">
          Lượt: Người {currentPlayer}
        </div>
        <button
          onClick={resetGame}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transform hover:scale-105 transition-all duration-200"
        >
          Chơi lại
        </button>
      </div>

      {/* Game Board */}
      <div className="relative flex flex-col items-center gap-4 bg-gray-200 p-6 rounded-lg shadow-lg">
        {/* Player 1 Quan */}
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold bg-yellow-300 border-2 border-yellow-500 transition-all duration-200 ${
            animationPath.includes(0) ? 'scale-110' : ''
          }`}
        >
          {board[0].stones}
        </div>

        {/* Dân Cells */}
        <div className="grid grid-cols-5 gap-4">
          {board.slice(1, 6).map((cell, i) => (
            <div
              key={i + 1}
              className="relative w-16 h-16 rounded-lg flex items-center justify-center text-xl font-semibold bg-white border-2 border-gray-300 group transition-all duration-200"
            >
              <span className={`${animationPath.includes(i + 1) ? 'scale-110' : ''}`}>
                {cell.stones}
              </span>
              {/* Hover Buttons */}
              {cell.stones > 0 && currentPlayer === 1 && !animating && !winner && (
                <div className="absolute inset-0 flex items-center justify-between px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleMove(i + 1, 'left')}
                    className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => handleMove(i + 1, 'right')}
                    className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-4">
          {board.slice(7, 12).map((cell, i) => (
            <div
              key={i + 7}
              className="relative w-16 h-16 rounded-lg flex items-center justify-center text-xl font-semibold bg-white border-2 border-gray-300 group transition-all duration-200"
            >
              <span className={`${animationPath.includes(i + 7) ? 'scale-110' : ''}`}>
                {cell.stones}
              </span>
              {/* Hover Buttons */}
              {cell.stones > 0 && currentPlayer === 2 && !animating && !winner && (
                <div className="absolute inset-0 flex items-center justify-between px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleMove(i + 7, 'left')}
                    className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => handleMove(i + 7, 'right')}
                    className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Player 2 Quan */}
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold bg-yellow-300 border-2 border-yellow-500 transition-all duration-200 ${
            animationPath.includes(6) ? 'scale-110' : ''
          }`}
        >
          {board[6].stones}
        </div>
      </div>

      {/* Game Status */}
      {winner && (
        <div className="mt-6 text-lg font-medium text-center text-green-600">
          {winner === 'Hòa' ? 'Trò chơi hòa!' : `Chúc mừng! ${winner} thắng!`} 
          
          <I18n value="Nhấn Chơi lại để tiếp tục." />
        </div>
      )}
    </div>
  );
};

export default OAnQuan;
