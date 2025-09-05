"use client";
import { I18n } from "@/components/utils/I18n";
import React, { useEffect, useState } from 'react';

interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryMatch: React.FC = () => {
  // Initial card values (8 pairs of emojis)
  const cardValues: string[] = ['🍎', '🍎', '🍋', '🍋', '🍇', '🍇', '🍉', '🍉', '🍒', '🍒', '🍓', '🍓', '🍑', '🍑', '🍐', '🍐'];

  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [gameWon, setGameWon] = useState<boolean>(false);

  // Shuffle and initialize cards
  const initializeGame = (): void => {
    const shuffledValues = [...cardValues].sort(() => Math.random() - 0.5);
    const newCards: Card[] = shuffledValues.map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(newCards);
    setFlippedCards([]);
    setMoves(0);
    setGameWon(false);
  };

  // Handle card click
  const handleCardClick = (card: Card): void => {
    if (flippedCards.length === 2 || card.isFlipped || card.isMatched || gameWon) return;

    const newCards = cards.map(c =>
      c.id === card.id ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);
    setFlippedCards([...flippedCards, card]);

    if (flippedCards.length === 1) {
      // Check for match
      if (flippedCards[0].value === card.value) {
        setCards(newCards.map(c =>
          c.value === card.value ? { ...c, isMatched: true } : c
        ));
        setFlippedCards([]);
        setMoves(prev => prev + 1);
        // Check for win
        if (newCards.every(c => c.isMatched || c.id === card.id)) {
          setGameWon(true);
        }
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          setCards(newCards.map(c =>
            c.id === card.id || c.id === flippedCards[0].id
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedCards([]);
          setMoves(prev => prev + 1);
        }, 1000);
      }
    }
  };

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  });

  return (
    <div className="flex flex-col items-center justify-center pt-10 px-4">
      <h2 className="text-4xl font-extrabold text-blue-900 mb-4">
        <I18n value="Lật Bài May Mắn" />
      </h2>
      <p className="text-lg text-gray-600 mb-6 max-w-md text-center">
        <I18n value="Lật hai thẻ mỗi lượt để tìm cặp giống nhau. Hoàn thành với ít lượt nhất!" />
      </p>

      {/* Score and Controls */}
      <div className="flex items-center justify-between w-full max-w-md mb-6">
        <div className="bg-blue-100 text-blue-900 px-4 py-2 rounded-lg font-semibold">
          <I18n value="Lượt" />: {moves}
        </div>
        <button
          onClick={initializeGame}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transform hover:scale-105 transition-all duration-200"
        >
          <I18n value="Chơi lại" />
        </button>
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-4 gap-2 bg-gray-200 p-4 rounded-lg shadow-lg w-80">
        {cards.map(card => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card)}
            className={`w-16 h-16 flex items-center justify-center rounded-md text-2xl font-bold cursor-pointer transition-transform duration-300 transform ${
              card.isFlipped || card.isMatched
                ? 'bg-white text-blue-600 scale-100'
                : 'bg-blue-400 text-transparent scale-95 hover:scale-100'
            } ${card.isMatched ? 'border-2 border-green-500' : ''}`}
          >
            {card.isFlipped || card.isMatched ? card.value : '?'}
          </div>
        ))}
      </div>

      {/* Game Status */}
      {gameWon && (
        <div className="mt-6 text-lg font-medium text-center text-green-600">
          <I18n value={`Chúc mừng! Bạn đã thắng trong ${moves} lượt! Nhấn "Chơi lại" để thử lại.`} />
        </div>
      )}
    </div>
  );
};

export default MemoryMatch;
