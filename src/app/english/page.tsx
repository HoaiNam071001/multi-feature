"use client";

import React from "react";

const EnglishPage: React.FC = () => {
  return (
    // Điều chỉnh '64px' thành chiều cao Header thực tế của project A để vừa khít màn hình
    <div className="w-full h-[calc(100vh-64px)] overflow-hidden bg-white">
      <iframe
        src="https://english-app-gray-one.vercel.app/"
        title="Học Tiếng Anh"
        className="w-full h-full border-0"
        // Cấp quyền: Micro (để luyện nói), Clipboard (để copy), Fullscreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; microphone"
        allowFullScreen
      />
    </div>
  );
};

export default EnglishPage;
