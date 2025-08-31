import axios from 'axios';

// Interface cho dữ liệu tỉnh từ API /pcotinh
export interface ProvinceData {
  id: number;
  mahc: number;
  tentinh: string;
  dientichkm2: string;
  dansonguoi: string;
  trungtamhc: string;
  kinhdo: number;
  vido: number;
  truocsapnhap: string;
  con: string;
}

// Interface cho dữ liệu đơn vị hành chính từ API /ptracuu
export interface DistrictData {
  id: number;
  matinh: number;
  ma: string;
  tentinh: string;
  loai: string;
  tenhc: string;
  cay: string;
  dientichkm2: number;
  dansonguoi: string;
  trungtamhc: string;
  kinhdo: number;
  vido: number;
  truocsapnhap: string;
  maxa: number;
  khoa: string;
}

// Tạo axios instance để gọi trực tiếp API
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'application/json',
    'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8',
  },
});

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const provinceService = {
  // Get all provinces from /pcotinh
  async getAllProvinces(): Promise<ProvinceData[]> {
    try {
      const response = await apiClient.post('https://sapnhap.bando.com.vn/pcotinh', {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching provinces:', error);
      // Return fallback data if API fails
      return getFallbackProvinces();
    }
  },

  // Get districts by province ID from /ptracuu
  async getDistrictsByProvince(provinceId: number): Promise<DistrictData[]> {
    try {
      const formData = new URLSearchParams();
      formData.append('id', provinceId.toString());
      
      const response = await apiClient.post('https://sapnhap.bando.com.vn/ptracuu', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching districts:', error);
      return getFallbackDistricts(provinceId);
    }
  },

  // Search provinces locally
  searchProvinces(provinces: ProvinceData[], query: string): ProvinceData[] {
    if (!query.trim()) return provinces;
    
    const lowerQuery = query.toLowerCase();
    return provinces.filter(province => 
      province.tentinh.toLowerCase().includes(lowerQuery) ||
      province.truocsapnhap.toLowerCase().includes(lowerQuery) ||
      province.id.toString().includes(lowerQuery) ||
      province.mahc.toString().includes(lowerQuery)
    );
  },

  // Search districts locally
  searchDistricts(districts: DistrictData[], query: string): DistrictData[] {
    if (!query.trim()) return districts;
    
    const lowerQuery = query.toLowerCase();
    return districts.filter(district => 
      district.tenhc.toLowerCase().includes(lowerQuery) ||
      district.truocsapnhap.toLowerCase().includes(lowerQuery) ||
      district.ma.toLowerCase().includes(lowerQuery) ||
      district.loai.toLowerCase().includes(lowerQuery)
    );
  },
};

// Fallback data when API is not available
const getFallbackProvinces = (): ProvinceData[] => {
  return [
    {
      id: 1,
      mahc: 1,
      tentinh: "Thủ đô Hà Nội",
      dientichkm2: "3.359,80",
      dansonguoi: "8.718.000",
      trungtamhc: "giữ nguyên",
      kinhdo: 105.698,
      vido: 21.0001,
      truocsapnhap: "không sáp nhập",
      con: "126 ĐVHC (51 phường và 75 xã)"
    },
    {
      id: 2,
      mahc: 2,
      tentinh: "TP. Hồ Chí Minh",
      dientichkm2: "2.095,00",
      dansonguoi: "9.300.000",
      trungtamhc: "giữ nguyên",
      kinhdo: 106.6297,
      vido: 10.8231,
      truocsapnhap: "không sáp nhập",
      con: "312 ĐVHC (249 phường và 63 xã)"
    },
    {
      id: 3,
      mahc: 3,
      tentinh: "Hải Phòng",
      dientichkm2: "1.522,00",
      dansonguoi: "2.035.000",
      trungtamhc: "giữ nguyên",
      kinhdo: 106.7242,
      vido: 20.8449,
      truocsapnhap: "không sáp nhập",
      con: "220 ĐVHC (177 phường và 43 xã)"
    }
  ];
};

// Fallback districts data
const getFallbackDistricts = (provinceId: number): DistrictData[] => {
  const districtsData = {
    1: [ // Hà Nội
      {
        id: 1,
        matinh: 1,
        ma: "0001",
        tentinh: "Thủ đô Hà Nội",
        loai: "quận",
        tenhc: "Ba Đình",
        cay: "0001.0001",
        dientichkm2: 9.21,
        dansonguoi: "247000",
        trungtamhc: "Phường Phúc Xá, quận Ba Đình",
        kinhdo: 105.8234,
        vido: 21.0352,
        truocsapnhap: "giữ nguyên",
        maxa: 1,
        khoa: "1Ba Đình"
      },
      {
        id: 2,
        matinh: 1,
        ma: "0002",
        tentinh: "Thủ đô Hà Nội",
        loai: "quận",
        tenhc: "Hoàn Kiếm",
        cay: "0001.0002",
        dientichkm2: 5.29,
        dansonguoi: "178000",
        trungtamhc: "Phường Hàng Trống, quận Hoàn Kiếm",
        kinhdo: 105.8514,
        vido: 21.0245,
        truocsapnhap: "giữ nguyên",
        maxa: 2,
        khoa: "1Hoàn Kiếm"
      },
      {
        id: 3,
        matinh: 1,
        ma: "0003",
        tentinh: "Thủ đô Hà Nội",
        loai: "quận",
        tenhc: "Hai Bà Trưng",
        cay: "0001.0003",
        dientichkm2: 9.96,
        dansonguoi: "318000",
        trungtamhc: "Phường Bạch Đằng, quận Hai Bà Trưng",
        kinhdo: 105.8614,
        vido: 21.0123,
        truocsapnhap: "giữ nguyên",
        maxa: 3,
        khoa: "1Hai Bà Trưng"
      }
    ],
    2: [ // TP. Hồ Chí Minh
      {
        id: 100,
        matinh: 2,
        ma: "7601",
        tentinh: "TP. Hồ Chí Minh",
        loai: "quận",
        tenhc: "Quận 1",
        cay: "7601.7601",
        dientichkm2: 7.73,
        dansonguoi: "142000",
        trungtamhc: "Phường Bến Nghé, quận 1",
        kinhdo: 106.6983,
        vido: 10.7769,
        truocsapnhap: "giữ nguyên",
        maxa: 7601,
        khoa: "2Quận 1"
      },
      {
        id: 101,
        matinh: 2,
        ma: "7602",
        tentinh: "TP. Hồ Chí Minh",
        loai: "quận",
        tenhc: "Quận 2",
        cay: "7601.7602",
        dientichkm2: 49.74,
        dansonguoi: "147000",
        trungtamhc: "Phường Thủ Thiêm, quận 2",
        kinhdo: 106.7328,
        vido: 10.7872,
        truocsapnhap: "giữ nguyên",
        maxa: 7602,
        khoa: "2Quận 2"
      }
    ]
  };
  
  return districtsData[provinceId as keyof typeof districtsData] || [];
};

export default provinceService;
