"use client"

import { useState } from 'react';

// Định nghĩa các ngôn ngữ hỗ trợ
type Language = 'vi' | 'en';

// Định nghĩa các bản dịch
const translations = {
  vi: {
    // Header
    'province.lookup.title': 'Tra Cứu Thông Tin Hành Chính Việt Nam',
    'province.lookup.description': 'Tra cứu thông tin 34 tỉnh/thành phố và 3321 đơn vị hành chính cấp xã mới',
    'province.lookup.source': 'Nguồn dữ liệu chính thức',
    
    // Province List
    'province.list.title': 'Danh Sách Tỉnh/Thành Phố',
    'province.search.placeholder': 'Tìm kiếm tỉnh/thành phố...',
    'province.search.oldname.placeholder': 'Tìm kiếm theo tên trước sát nhập...',
    'province.total': 'Tổng: {count} tỉnh/thành phố',
    'province.results': 'Kết quả: {count}',
    'province.loading': 'Đang tải danh sách tỉnh...',
    
    // District List
    'district.list.title': 'Đơn Vị Hành Chính Cấp Phường/Xã',
    'district.search.placeholder': 'Tìm kiếm quận/huyện/xã...',
    'district.search.oldname.placeholder': 'Tìm kiếm theo tên trước sát nhập...',
    'district.total': 'Tổng: {count} đơn vị',
    'district.results': 'Kết quả: {count}',
    'district.loading': 'Đang tải danh sách đơn vị...',
    'district.select.province': 'Chọn một tỉnh/thành phố để xem danh sách đơn vị hành chính',
    'district.no.results': 'Không tìm thấy kết quả',
    'district.no.data': 'Không có dữ liệu đơn vị hành chính',
    'district.close': 'Bỏ chọn tỉnh',
    
    // Province Details
    'province.details.title': 'Thông Tin Chi Tiết: {name}',
    'province.details.code': 'Mã tỉnh',
    'province.details.admin.code': 'Mã hành chính',
    'province.details.area': 'Diện tích',
    'province.details.population': 'Dân số',
    'province.details.admin.center': 'Trung tâm hành chính',
    'province.details.longitude': 'Kinh độ',
    'province.details.latitude': 'Vĩ độ',
    'province.details.subunits': 'Đơn vị con',
    'province.details.before.merge': 'Tên trước sát nhập',
    
    // Common
    'common.area.unit': 'km²',
    'common.population.unit': 'người',
    'common.degree.unit': '°',
    'common.before.merge': 'Trước sát nhập: {text}',
    'common.area': 'Diện tích: {value} km²',
    'common.population': 'Dân số: {value}',
    'common.admin.code': 'Mã HC: {value}',
    
    // Error
    'error.api.failed': 'Không thể tải dữ liệu từ API. Đang sử dụng dữ liệu offline.',
  },
  en: {
    // Header
    'province.lookup.title': 'Vietnam Administrative Information Lookup',
    'province.lookup.description': 'Look up information on 34 provinces/cities and 3321 administrative units',
    'province.lookup.source': 'Official Data Source',
    
    // Province List
    'province.list.title': 'Province/City List',
    'province.search.placeholder': 'Search provinces/cities...',
    'province.search.oldname.placeholder': 'Search by name before merger...',
    'province.total': 'Total: {count} provinces/cities',
    'province.results': 'Results: {count}',
    'province.loading': 'Loading province list...',
    
    // District List
    'district.list.title': 'Ward/commune level administrative units',
    'district.search.placeholder': 'Search districts/wards...',
    'district.search.oldname.placeholder': 'Search by old name...',
    'district.total': 'Total: {count} units',
    'district.results': 'Results: {count}',
    'district.loading': 'Loading unit list...',
    'district.select.province': 'Select a province/city to view administrative units',
    'district.no.results': 'No results found',
    'district.no.data': 'No administrative unit data',
    'district.close': 'Deselect province',
    
    // Province Details
    'province.details.title': 'Detailed Information: {name}',
    'province.details.code': 'Province Code',
    'province.details.admin.code': 'Administrative Code',
    'province.details.area': 'Area',
    'province.details.population': 'Population',
    'province.details.admin.center': 'Administrative Center',
    'province.details.longitude': 'Longitude',
    'province.details.latitude': 'Latitude',
    'province.details.subunits': 'Subunits',
    'province.details.before.merge': 'Name Before Merger',
    
    // Common
    'common.area.unit': 'km²',
    'common.population.unit': 'people',
    'common.degree.unit': '°',
    'common.before.merge': 'Before merger: {text}',
    'common.area': 'Area: {value} km²',
    'common.population': 'Population: {value}',
    'common.admin.code': 'Admin Code: {value}',
    
    // Error
    'error.api.failed': 'Unable to load data from API. Using offline data.',
  }
};

// Context để quản lý ngôn ngữ
interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

// Hook để sử dụng I18n
export const useI18n = (): I18nContextType => {
  const [language, setLanguage] = useState<Language>('vi');

  const t = (key: string, params?: Record<string, string | number>): string => {
    const translation = translations[language][key as keyof typeof translations[typeof language]] || key;
    
    if (params) {
      return Object.entries(params).reduce((str, [param, value]) => {
        return str.replace(new RegExp(`{${param}}`, 'g'), String(value));
      }, translation);
    }
    
    return translation;
  };

  return { language, setLanguage, t };
};

// Component I18n để hiển thị text đã dịch
interface I18nProps {
  value: string;
  params?: Record<string, string | number>;
}

export const I18n = ({ value, params }: I18nProps) => {
  const { t } = useI18n();
  return <span>{t(value, params)}</span>;
};

// Component Language Switcher
export const LanguageSwitcher = () => {
  const { language, setLanguage } = useI18n();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLanguage('vi')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          language === 'vi' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        VI
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          language === 'en' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default I18n;
    