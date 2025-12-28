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
  const [hasMoved, setHasMoved] = useState(false);

  const dragRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(null);
  // Không cần containerRef nữa vì dùng Overlay
  // const containerRef = useRef<HTMLDivElement>(null);

  // Khởi tạo vị trí ban đầu
  useEffect(() => {
    if (typeof window !== "undefined") {
        setPosition({ x: window.innerWidth - 100, y: window.innerHeight - 150 });
    }
  }, []);

  /* ĐÃ XÓA: useEffect handleClickOutside cũ.
     Lý do: Không bắt được sự kiện click khi chuột nằm trong vùng iframe.
  */

  // Xử lý Logic Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
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

      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        setHasMoved(true);
      }

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
      {/* Overlay 1: Khi đang Drag
         Để tránh iframe nuốt sự kiện chuột lúc kéo
      */}
      {isDragging && <div className="absolute inset-0 z-[60] cursor-move" />}

      {/* Overlay 2 (MỚI): Khi Menu đang mở (Click Outside handler)
         - fixed inset-0: Phủ toàn màn hình
         - z-[9998]: Cao hơn mọi thứ, nhưng thấp hơn Controller (z-[9999])
         - bg-transparent: Trong suốt người dùng không thấy
         - onClick: Đóng menu
      */}
      {menuOpen && (
        <div
            className="fixed inset-0 z-[9998] bg-transparent"
            onClick={() => setMenuOpen(false)}
        />
      )}

      <iframe
        src={src}
        title={title}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; microphone"
        allowFullScreen
      />

      {/* Controller Container */}
      <div
        // ref={containerRef} // Không cần ref này nữa
        className="fixed z-[9999]" // Z-index cao nhất, cao hơn Overlay 2
        style={{
          left: position.x,
          top: position.y,
          touchAction: 'none'
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
            // Ngăn sự kiện click trong menu lan ra overlay (dù controller z-index cao hơn nhưng cẩn thận vẫn tốt)
            onClick={(e) => e.stopPropagation()}
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
            <Settings size={24} className="transition-transform duration-500 group-hover:rotate-180" />
          )}
        </button>
      </div>
    </div>
  );
};

export default UniversalIframe;
