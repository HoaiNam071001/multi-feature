"use client";

import { HEADER_HEIGHT } from "@/models/layout";

export const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="m-4 bg-white rounded-sm shadow-sm"
      style={{
        minHeight:  `calc(100vh - ${HEADER_HEIGHT}px - 50px)`,
      }}
    >
      {children}
    </div>
  );
};
