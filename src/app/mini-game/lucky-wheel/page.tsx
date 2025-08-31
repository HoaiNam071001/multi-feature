"use client";
import React, { useState, useRef } from 'react';

const defaultOptions = ['100 Điểm', 'Quà Bí Mật', 'Thử Lại', '50 Điểm', 'Trúng Lớn!', 'Không Trúng'];

const colors: string[] = [
  'bg-green-500',
  'bg-purple-500',
  'bg-gray-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-red-500',
];

const LuckyWheel: React.FC = () => {
  const [input, setInput] = useState<string>(defaultOptions.join('\n'));
  const [options, setOptions] = useState<string[] | null>(null);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [result, setResult] = useState<string | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  // Xử lý bắt đầu với options mới
  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const opts = input
      .split('\n')
      .map(opt => opt.trim())
      .filter(opt => opt.length > 0);
    if (opts.length < 2) {
      alert('Vui lòng nhập ít nhất 2 phần thưởng!');
      return;
    }
    setOptions(opts);
    setResult(null);
    setRotation(0);
    setSpinning(false);
  };

  // Đổi lại phần thưởng
  const handleChangeOptions = () => {
    setOptions(null);
    setResult(null);
    setRotation(0);
    setSpinning(false);
  };

  // Quay vòng
  const spinWheel = (): void => {
    if (!options || spinning) return;
    setSpinning(true);
    setResult(null);
    const segmentAngle = 360 / options.length;
    const randomSpins = 3 + Math.random() * 2;
    const randomSegment = Math.floor(Math.random() * options.length);
    const finalRotation = randomSpins * 360 + randomSegment * segmentAngle;
    setRotation(finalRotation);
    setTimeout(() => {
      const resultIndex = Math.floor((360 - (finalRotation % 360)) / segmentAngle) % options.length;
      setResult(options[resultIndex]);
      setSpinning(false);
    }, 4000);
  };

  // Reset game
  const resetGame = (): void => {
    setRotation(0);
    setResult(null);
    setSpinning(false);
  };

  // Render wheel segments
  const renderWheel = () => {
    if (!options) return null;
    const segmentAngle = 360 / options.length;
    return options.map((label, index) => {
      const rotate = index * segmentAngle;
      return (
        <div
          key={index}
          className={`absolute w-full h-full ${colors[index % colors.length]} flex items-start justify-center`}
          style={{
            transform: `rotate(${rotate}deg)`,
            clipPath: 'polygon(50% 50%, 100% 0, 100% 50%)',
          }}
        >
          <span
            className="text-white font-semibold text-sm transform -rotate-[45deg] translate-x-16 translate-y-4"
          >
            {label}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col items-center justify-center pt-10 px-4">
      <h2 className="text-4xl font-extrabold text-blue-900 mb-4">Vòng Quay May Mắn</h2>
      <p className="text-lg text-gray-600 mb-6 max-w-md text-center">
        Quay vòng để nhận phần thưởng bất ngờ! Chúc bạn may mắn!
      </p>
      {/* Nhập option */}
      {!options && (
        <form onSubmit={handleStart} className="w-full max-w-md bg-white rounded-lg shadow p-6 mb-8">
          <label className="block text-blue-800 font-semibold mb-2">Nhập danh sách phần thưởng (mỗi dòng 1 phần):</label>
          <textarea
            className="w-full border border-blue-300 rounded p-2 mb-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={"Ví dụ:\n100 Điểm\nQuà Bí Mật\nThử Lại"}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 w-full"
          >
            Bắt đầu
          </button>
        </form>
      )}
      {/* Vòng quay */}
      {options && (
        <>
          <div className="relative flex items-center justify-center mb-8">
            <div
              ref={wheelRef}
              className={`w-80 h-80 rounded-full overflow-hidden shadow-xl border-4 border-blue-300 transition-transform duration-[4000ms] ease-out ${spinning ? 'transform' : ''}`}
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {renderWheel()}
            </div>
            {/* Pointer */}
            <div className="absolute w-0 h-0 border-l-10 border-r-10 border-b-20 border-l-transparent border-r-transparent border-b-red-600 top-0 -mt-4 z-10" />
          </div>
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={spinWheel}
              disabled={spinning}
              className={`bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 ${spinning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Quay
            </button>
            <button
              onClick={resetGame}
              className="bg-gray-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transform hover:scale-105 transition-all duration-200"
            >
              Chơi lại
            </button>
            <button
              onClick={handleChangeOptions}
              className="bg-yellow-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transform hover:scale-105 transition-all duration-200"
            >
              Đổi phần thưởng
            </button>
            {result && (
              <div className="text-lg font-medium text-center text-green-600">
                Bạn đã trúng: {result}!
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LuckyWheel;
