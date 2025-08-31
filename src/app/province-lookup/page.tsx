"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, MapPin, Users, Building2, Loader2, ExternalLink, Globe, ChevronRight } from "lucide-react";
import { provinceService, ProvinceData, DistrictData } from "@/services/provinceService";

const ProvinceLookupPage = () => {
  const [provinces, setProvinces] = useState<ProvinceData[]>([]);
  const [districts, setDistricts] = useState<DistrictData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<ProvinceData | null>(null);
  
  // Search states
  const [provinceSearchTerm, setProvinceSearchTerm] = useState("");
  const [districtSearchTerm, setDistrictSearchTerm] = useState("");

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await provinceService.getAllProvinces();
        setProvinces(data);
      } catch (err) {
        setError("Không thể tải dữ liệu từ API. Đang sử dụng dữ liệu offline.");
        console.error("Error fetching provinces:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  // Fetch districts when province is selected
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedProvince) {
        setDistricts([]);
        return;
      }

      try {
        setLoading(true);
        const data = await provinceService.getDistrictsByProvince(selectedProvince.id);
        setDistricts(data);
      } catch (err) {
        console.error("Error fetching districts:", err);
        setDistricts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, [selectedProvince]);

  // Filter provinces based on search
  const filteredProvinces = useMemo(() => {
    return provinceService.searchProvinces(provinces, provinceSearchTerm);
  }, [provinces, provinceSearchTerm]);

  // Filter districts based on search
  const filteredDistricts = useMemo(() => {
    return provinceService.searchDistricts(districts, districtSearchTerm);
  }, [districts, districtSearchTerm]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const handleProvinceClick = (province: ProvinceData) => {
    setSelectedProvince(province);
    setDistrictSearchTerm(""); // Reset district search when selecting new province
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Tra Cứu Thông Tin Hành Chính Việt Nam</h1>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">Tra cứu thông tin 34 tỉnh/thành phố và 3321 đơn vị hành chính cấp xã mới</p>
            <a 
              href="https://sapnhap.bando.com.vn/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Nguồn dữ liệu chính thức
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Main Content - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Provinces */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Danh Sách Tỉnh/Thành Phố</h2>
              
              {/* Province Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tỉnh/thành phố..."
                  value={provinceSearchTerm}
                  onChange={(e) => setProvinceSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Province Stats */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Tổng: {provinces.length} tỉnh/thành phố</span>
                <span>Kết quả: {filteredProvinces.length}</span>
              </div>
            </div>

            {/* Province List */}
            <div className="max-h-96 overflow-y-auto">
              {loading && provinces.length === 0 ? (
                <div className="p-6 text-center">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
                  <p className="text-gray-600">Đang tải danh sách tỉnh...</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredProvinces.map(province => (
                    <div
                      key={province.id}
                      onClick={() => handleProvinceClick(province)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedProvince?.id === province.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-500">#{province.id}</span>
                            <h3 className="font-semibold text-gray-900">{province.tentinh}</h3>
                          </div>
                          {province.truocsapnhap && province.truocsapnhap !== "không sáp nhập" && (
                            <p className="text-sm text-gray-600 italic">
                              Trước sát nhập: {province.truocsapnhap}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <span>Mã HC: {province.mahc}</span>
                            <span>Diện tích: {province.dientichkm2} km²</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Districts */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Đơn Vị Hành Chính Cấp Nhỏ Hơn
                {selectedProvince && (
                  <span className="text-lg font-normal text-gray-600 ml-2">
                    - {selectedProvince.tentinh}
                  </span>
                )}
              </h2>
              
              {selectedProvince ? (
                <>
                  {/* District Search */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm quận/huyện/xã..."
                      value={districtSearchTerm}
                      onChange={(e) => setDistrictSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* District Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Tổng: {districts.length} đơn vị</span>
                    <span>Kết quả: {filteredDistricts.length}</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Chọn một tỉnh/thành phố để xem danh sách đơn vị hành chính</p>
                </div>
              )}
            </div>

            {/* District List */}
            {selectedProvince && (
              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-6 text-center">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
                    <p className="text-gray-600">Đang tải danh sách đơn vị...</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredDistricts.length > 0 ? (
                      filteredDistricts.map(district => (
                        <div key={district.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-500">#{district.ma}</span>
                            <h3 className="font-semibold text-gray-900">{district.tenhc}</h3>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {district.loai}
                            </span>
                          </div>
                          {district.truocsapnhap && district.truocsapnhap !== "giữ nguyên" && (
                            <p className="text-sm text-gray-600 italic">
                              Trước sát nhập: {district.truocsapnhap}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <span>Diện tích: {district.dientichkm2} km²</span>
                            <span>Dân số: {district.dansonguoi}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center">
                        <p className="text-gray-600">
                          {districtSearchTerm ? 'Không tìm thấy kết quả' : 'Không có dữ liệu đơn vị hành chính'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Selected Province Details */}
        {selectedProvince && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Thông Tin Chi Tiết: {selectedProvince.tentinh}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Mã tỉnh</label>
                <p className="text-lg font-semibold">#{selectedProvince.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Mã hành chính</label>
                <p className="text-lg font-semibold">{selectedProvince.mahc}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Diện tích</label>
                <p className="text-lg font-semibold">{selectedProvince.dientichkm2} km²</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Dân số</label>
                <p className="text-lg font-semibold">{selectedProvince.dansonguoi} người</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Trung tâm hành chính</label>
                <p className="text-lg font-semibold">{selectedProvince.trungtamhc}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Kinh độ</label>
                <p className="text-lg font-semibold">{selectedProvince.kinhdo}°</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Vĩ độ</label>
                <p className="text-lg font-semibold">{selectedProvince.vido}°</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Đơn vị con</label>
                <p className="text-lg font-semibold">{selectedProvince.con}</p>
              </div>
            </div>
            {selectedProvince.truocsapnhap && selectedProvince.truocsapnhap !== "không sáp nhập" && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <label className="text-sm font-medium text-gray-700">Tên trước sát nhập</label>
                <p className="text-lg font-semibold text-yellow-800">{selectedProvince.truocsapnhap}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProvinceLookupPage;
