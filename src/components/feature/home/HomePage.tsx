import { ContentWrapper } from "@/components/layout/Content-wrapper";
import FeatureGrid from "@/components/common/FeatureGrid";
import React from "react";
import { FeatureItem } from "@/components/common/FeatureCard";
import { RouterPath } from "@/models/router";
import { Gamepad2, MapPin } from "lucide-react";

export const appFeatures: FeatureItem[] = [
  {
    name: "Mini Game",
    url: RouterPath.MINI_GAME,
    icon: <Gamepad2 />,
    description:
      "Bộ sưu tập các trò chơi trí tuệ thú vị giúp rèn luyện tư duy và giải trí",
  },
  {
    name: "Tra Cứu Tỉnh Thành",
    url: RouterPath.PROVINCE_LOOKUP,
    icon: <MapPin />,
    description:
      "Tìm kiếm thông tin chi tiết về 63 tỉnh thành Việt Nam với dữ liệu từ Bộ Nông nghiệp và Môi trường",
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-[var(--primary)] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Chào mừng đến với Trang Chủ
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Khám phá các tính năng thú vị và trò chơi trí tuệ đa dạng
          </p>
          <div className="w-32 h-1 bg-white mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Features Section */}
      <FeatureGrid features={appFeatures} title="Các Tính Năng Nổi Bật" />
    </div>
  );
};

export default HomePage;
