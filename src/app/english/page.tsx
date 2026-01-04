// src/app/english/page.tsx (hoặc đường dẫn file của bạn)
"use client";

import UniversalIframe from "@/components/common/UniversalIframe"; // Nhớ import đúng đường dẫn
import React from "react";

const EnglishPage: React.FC = () => {
  return (
    <UniversalIframe
      src="https://niz-vocabulary.vercel.app/"
      title="Học Tiếng Anh"
    />
  );
};

export default EnglishPage;
