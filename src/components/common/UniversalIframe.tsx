"use client";

import { ExternalLink, Maximize2, Minimize2, Settings, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface UniversalIframeProps {
  src: string;
  title?: string;
  className?: string;
}

const UniversalIframe: React.FC<UniversalIframeProps> = ({
  src,
  title = "Embedded Content",
  className = "w-full h-[calc(100vh-100px)]",
}) => {
  const [isFullView, setIsFullView] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Vị trí mặc định: Góc dưới phải
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false); // Để kiểm tra xem người dùng có thực sự kéo không

  const dragRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Khởi tạo vị trí ban đầu (chạy 1 lần sau khi mount để lấy window size)
  useEffect(() => {
    setPosition({ x: 80, y: 80 });
  }, []);

  // Xử lý Click Outside để đóng menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Xử lý Logic Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn chặn bôi đen text
    setIsDragging(true);
    setHasMoved(false);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: position.x,
      initY: position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return;

      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;

      // Nếu di chuyển quá 5px thì mới tính là đang drag (tránh nhầm lẫn với click run tay)
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        setHasMoved(true);
      }

      // Giới hạn kéo thả trong màn hình (trừ đi kích thước nút ~60px)
      const newX = Math.min(Math.max(0, dragRef.current.initX + deltaX), window.innerWidth - 60);
      const newY = Math.min(Math.max(0, dragRef.current.initY + deltaY), window.innerHeight - 60);

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleButtonClick = () => {
    // Nếu không phải là hành động kéo thả thì mới toggle menu
    if (!hasMoved) {
      setMenuOpen((prev) => !prev);
    }
  };

  const toggleFullView = () => {
    setIsFullView(!isFullView);
    setMenuOpen(false);
  };

  const openNewTab = () => {
    window.open(src, "_blank");
    setMenuOpen(false);
  };

  // Tính toán vị trí hiển thị menu (Smart Positioning)
  // Chia màn hình làm 4 phần, nút đang ở phần nào thì menu mở về phía ngược lại
  const isRightSide = typeof window !== 'undefined' ? position.x > window.innerWidth / 2 : true;
  const isBottomSide = typeof window !== 'undefined' ? position.y > window.innerHeight / 2 : true;

  const menuPositionClass = `
    absolute 
    ${isBottomSide ? "bottom-full mb-3" : "top-full mt-3"} 
    ${isRightSide ? "right-0" : "left-0"}
  `;
  
  const menuOriginClass = `
    origin-${isBottomSide ? "bottom" : "top"}-${isRightSide ? "right" : "left"}
  `;

  return (
    <div
      className={`transition-all duration-300 ease-in-out bg-white ${
        isFullView ? "fixed inset-0 z-[50] w-screen h-screen" : `relative ${className}`
      }`}
    >
      {/* Lớp overlay trong suốt khi drag để tránh iframe nuốt sự kiện chuột */}
      {isDragging && <div className="absolute inset-0 z-[60] cursor-move" />}

      <iframe
        src={src}
        title={title}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; microphone"
        allowFullScreen
      />

      {/* Controller Container */}
      <div
        ref={containerRef}
        className="fixed z-[9999]"
        style={{ 
          left: position.x, 
          top: position.y,
          touchAction: 'none' // Ngăn scroll trên mobile khi drag nút
        }}
      >
        {/* Menu Options */}
        {menuOpen && (
          <div 
            className={`
              w-48 bg-white rounded-xl shadow-2xl border border-gray-100 p-1.5 flex flex-col gap-1
              ${menuPositionClass}
              animate-in fade-in zoom-in-95 duration-200 ${menuOriginClass}
            `}
          >
            <button
              onClick={toggleFullView}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-100 hover:text-primary rounded-lg transition-colors w-full text-left"
            >
              {isFullView ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              {isFullView ? "Thu nhỏ" : "Toàn màn hình"}
            </button>
            <button
              onClick={openNewTab}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-100 hover:text-primary rounded-lg transition-colors w-full text-left"
            >
              <ExternalLink size={18} />
              Mở tab mới
            </button>
          </div>
        )}

        {/* Main Button (Draggable) */}
        <button
          onMouseDown={handleMouseDown}
          onClick={handleButtonClick}
          className={`
            group flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-200
            ${menuOpen ? "bg-primary text-white rotate-90" : "bg-primary text-white hover:opacity-60 hover:scale-105 active:scale-95"}
            ${isDragging ? "cursor-grabbing ring-4 ring-blue-300/50 scale-100" : "cursor-grab"}
          `}
          title="Kéo để di chuyển, Click để mở menu"
        >
          {menuOpen ? (
            <X size={24} />
          ) : (
            // Icon Settings với hiệu ứng hover xoay nhẹ
            <Settings size={24} className="transition-transform duration-500 group-hover:rotate-180" />
          )}
        </button>
      </div>
    </div>
  );
};

export default UniversalIframe;