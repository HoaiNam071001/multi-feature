# Tính Năng Tra Cứu Tỉnh Thành Việt Nam

## 📋 Mô tả

Tính năng tra cứu tỉnh thành Việt Nam được tích hợp vào ứng dụng với khả năng tìm kiếm và hiển thị thông tin chi tiết về 63 tỉnh thành Việt Nam. Dữ liệu được lấy từ nguồn chính thức của [Bộ Nông nghiệp và Môi trường - Nhà xuất bản Tài nguyên Môi trường và Bản đồ Việt Nam](https://sapnhap.bando.com.vn/).

## 🚀 Tính năng chính

### 1. **Tra cứu thông tin tỉnh thành**
- Hiển thị danh sách 63 tỉnh thành Việt Nam
- Thông tin chi tiết: tên, mã, thủ phủ, vùng miền, dân số, diện tích
- Giao diện card đẹp mắt với hover effects

### 2. **Tìm kiếm thông minh**
- Tìm kiếm theo tên tỉnh/thành phố
- Tìm kiếm theo mã tỉnh
- Tìm kiếm theo tên thủ phủ
- Tìm kiếm real-time khi gõ

### 3. **Bộ lọc theo vùng miền**
- Lọc theo 8 vùng miền chính:
  - Đồng bằng sông Hồng
  - Đông Bắc Bộ
  - Tây Bắc Bộ
  - Bắc Trung Bộ
  - Duyên hải Nam Trung Bộ
  - Tây Nguyên
  - Đông Nam Bộ
  - Đồng bằng sông Cửu Long

### 4. **Thống kê trực quan**
- Tổng số tỉnh thành: 63
- Số lượng kết quả tìm kiếm
- Số vùng miền: 8

### 5. **Modal chi tiết**
- Click vào card để xem thông tin chi tiết
- Modal hiển thị đầy đủ thông tin tỉnh
- Link đến trang bản đồ chính thức

## 🛠️ Công nghệ sử dụng

### Frontend
- **Next.js 15** với App Router
- **React 19** với TypeScript
- **Tailwind CSS** cho styling
- **Lucide React** cho icons
- **Axios** cho HTTP requests

### Backend
- **Next.js API Routes** làm proxy server
- **Axios** để gọi API từ sapnhap.bando.com.vn
- **Fallback data** khi API không khả dụng

## 📁 Cấu trúc file

```
src/
├── app/
│   ├── province-lookup/
│   │   └── page.tsx                 # Trang tra cứu tỉnh thành
│   └── api/
│       └── provinces/
│           ├── route.ts             # API route chính
│           └── [id]/
│               └── route.ts         # API route chi tiết tỉnh
├── services/
│   └── provinceService.ts           # Service gọi API
└── components/
    └── feature/
        └── home/
            └── HomePage.tsx         # Cập nhật để thêm tính năng mới
```

## 🔌 API Endpoints

### 1. Lấy danh sách tỉnh thành
```
GET /api/provinces
```

### 2. Tìm kiếm tỉnh thành
```
GET /api/provinces?q={query}
```

### 3. Lấy thông tin chi tiết tỉnh
```
GET /api/provinces/{id}
```

## 📊 Dữ liệu tỉnh thành

Mỗi tỉnh thành bao gồm:
- **id**: Mã số tỉnh
- **name**: Tên tỉnh/thành phố
- **code**: Mã viết tắt
- **region**: Vùng miền
- **population**: Dân số
- **area**: Diện tích (km²)
- **capital**: Thủ phủ

## 🌐 Nguồn dữ liệu

Dữ liệu được lấy từ trang web chính thức:
- **URL**: https://sapnhap.bando.com.vn/
- **Nguồn**: Bộ Nông nghiệp và Môi trường - Nhà xuất bản Tài nguyên Môi trường và Bản đồ Việt Nam
- **Cập nhật**: Thông tin được cập nhật theo dữ liệu mới nhất

## 🔄 Fallback Mechanism

Khi API chính thức không khả dụng:
1. Hệ thống sẽ hiển thị thông báo lỗi
2. Tự động chuyển sang sử dụng dữ liệu offline
3. Đảm bảo tính năng vẫn hoạt động bình thường

## 🎨 Giao diện

### Responsive Design
- **Desktop**: Grid 3 cột
- **Tablet**: Grid 2 cột  
- **Mobile**: Grid 1 cột

### Loading States
- Spinner khi đang tải dữ liệu
- Skeleton loading cho cards
- Error states với thông báo rõ ràng

### Interactive Elements
- Hover effects trên cards
- Click để mở modal chi tiết
- Smooth transitions và animations

## 🚀 Cách sử dụng

1. **Truy cập trang chủ** → Click "Tra Cứu Tỉnh Thành"
2. **Tìm kiếm**: Gõ tên tỉnh, mã hoặc thủ phủ
3. **Lọc**: Chọn vùng miền từ dropdown
4. **Xem chi tiết**: Click vào card để mở modal
5. **Xem bản đồ**: Click "Xem chi tiết trên bản đồ"

## 🔧 Cài đặt và chạy

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build
```

## 📝 Ghi chú

- Dữ liệu được cập nhật theo thông tin chính thức từ Bộ Nông nghiệp và Môi trường
- Tính năng hoạt động offline với dữ liệu fallback
- Giao diện được tối ưu cho trải nghiệm người dùng tốt nhất
- Hỗ trợ đầy đủ tiếng Việt và định dạng số Việt Nam
