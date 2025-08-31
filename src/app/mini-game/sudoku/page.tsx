"use client";
import React, { useState } from "react";
import { I18n } from "@/components/utils/I18n";

const Sudoku = () => {
  // Initial board (0 represents empty cells)
  const initialBoard = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ];

  const [board, setBoard] = useState(initialBoard);
  const [error, setError] = useState("");

  // Handle cell input
  const handleInputChange = (row: number, col: number, value: string) => {
    if (
      value === "" ||
      (/^[1-9]$/.test(value) && isValidMove(row, col, parseInt(value)))
    ) {
      const newBoard = board.map((r, i) =>
        r.map((c, j) =>
          i === row && j === col ? (value === "" ? 0 : parseInt(value)) : c
        )
      );
      setBoard(newBoard);
      setError("");
    } else {
      setError("Số không hợp lệ! Vui lòng nhập số từ 1-9 phù hợp.");
    }
  };

  // Check if move is valid
  const isValidMove = (row: number, col: number, num: number) => {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num) return false;
    }
    // Check column
    for (let x = 0; x < 9; x++) {
      if (board[x][col] === num) return false;
    }
    // Check 3x3 box
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i + startRow][j + startCol] === num) return false;
      }
    }
    return true;
  };

  // Reset board
  const resetBoard = () => {
    setBoard(initialBoard.map((row) => [...row]));
    setError("");
  };

  // Check if board is solved
  const checkSolution = () => {
    const isComplete = board.every((row) => row.every((cell) => cell !== 0));
    if (!isComplete) {
      setError("Vui lòng điền tất cả các ô!");
      return;
    }
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (!isValidMove(row, col, board[row][col])) {
          setError("Lời giải không đúng! Vui lòng kiểm tra lại.");
          return;
        }
      }
    }
    setError("Chúc mừng! Bạn đã giải đúng Sudoku!");
  };

  return (
    <div className="flex flex-col items-center justify-center pt-10 px-4">
      <h2 className="text-4xl font-extrabold text-blue-900 mb-6">
        <I18n value="Sudoku" />
      </h2>
      <p className="text-lg text-gray-600 mb-8 max-w-md text-center">
        <I18n value="Điền số từ 1-9 vào lưới sao cho mỗi hàng, cột và vùng 3x3 không trùng số." />
      </p>

      {/* Sudoku Grid */}
      <div className="grid grid-cols-9 gap-0 bg-white shadow-lg rounded-lg p-2 border-2 border-blue-200">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="text"
              value={cell === 0 ? "" : cell}
              onChange={(e) =>
                handleInputChange(rowIndex, colIndex, e.target.value)
              }
              disabled={initialBoard[rowIndex][colIndex] !== 0}
              className={`w-12 h-12 text-center text-lg font-semibold border ${
                initialBoard[rowIndex][colIndex] !== 0
                  ? "bg-gray-100 text-gray-800"
                  : "bg-white text-blue-600"
              } ${
                colIndex % 3 === 2 && colIndex !== 8
                  ? "border-r-2 border-blue-300"
                  : ""
              } ${
                rowIndex % 3 === 2 && rowIndex !== 8
                  ? "border-b-2 border-blue-300"
                  : ""
              } focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-blue-50 transition-colors duration-200`}
            />
          ))
        )}
      </div>

      {/* Error/Success Message */}
      {error && (
        <p
          className={`mt-4 text-lg font-medium ${
            error.includes("Chúc mừng") ? "text-green-600" : "text-red-600"
          }`}
        >
          <I18n value={error} />
        </p>
      )}

      {/* Buttons */}
      <div className="mt-6 flex space-x-4">
        <button
          onClick={resetBoard}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transform hover:scale-105 transition-all duration-200"
        >
          <I18n value="Reset" />
        </button>
        <button
          onClick={checkSolution}
          className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transform hover:scale-105 transition-all duration-200"
        >
          <I18n value="Kiểm tra" />
        </button>
      </div>
    </div>
  );
};

export default Sudoku;
