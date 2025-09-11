import { FeatureItem } from "@/components/common/FeatureCard";
import FeatureGrid from "@/components/common/FeatureGrid";
import { RouterPath } from "@/models/router";
import { FileImage, FileText, Gamepad2, MapPin } from "lucide-react";

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
  {
    name: "Xử Lý Văn Bản",
    url: RouterPath.TEXT_PROCESSOR,
    icon: <FileText />,
    description:
      "Xử lý văn bản với các tính năng như chuyển đổi thường xuyên, xóa ký tự đặc biệt, cắt ngắn văn bản, và nhiều hơn nữa",
  },
  {
    name: "Quản Lý Trang PDF",
    url: RouterPath.PDF,
    icon: <FileImage />,
    description:
      "Dễ dàng ghép, nối hoặc tách các trang trong tệp PDF với giao diện thân thiện, thao tác nhanh chóng và bảo mật ngay trên trình duyệt.",
  },
  {
    name: "So Sánh Văn Bản",
    url: RouterPath.TEXT_COMPARE,
    icon: <FileText />,
    description:
      "So sánh hai đoạn văn bản để nhanh chóng nhận diện sự khác biệt, hỗ trợ phân biệt chữ hoa/thường và sử dụng regex, trực tiếp trên trình duyệt.",
  },
  {
    name: "Crop Ảnh",
    url: RouterPath.IMAGE_CROPPER,
    icon: <FileImage />,
    description:
      "Cắt, xoay, lật, phóng to/thu nhỏ ảnh dễ dàng. Hỗ trợ xem trước, xuất ảnh và tùy chọn tỷ lệ cắt cho avatar, cover hoặc tự do.",
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
            Khám phá các tính năng thú vị và đa dạng
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
