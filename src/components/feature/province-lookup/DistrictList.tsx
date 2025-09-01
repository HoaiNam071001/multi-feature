import { Loader2, MapPin, X } from "lucide-react";
import { ProvinceData, DistrictData } from "@/services/provinceService";
import { I18n, useI18n } from "@/components/utils/I18n";
import SearchInput from "@/components/utils/SearchInput";

interface DistrictListProps {
  districts: DistrictData[];
  filteredDistricts: DistrictData[];
  loading: boolean;
  selectedProvince: ProvinceData | null;
  searchTerm: string;
  oldNameSearchTerm: string;
  onSearchChange: (value: string) => void;
  onOldNameSearchChange: (value: string) => void;
  onClose: () => void;
}

const DistrictList = ({
  districts,
  filteredDistricts,
  loading,
  selectedProvince,
  searchTerm,
  oldNameSearchTerm,
  onSearchChange,
  onOldNameSearchChange,
  onClose,
}: DistrictListProps) => {
  const { t } = useI18n();

  return (
    <div className="bg-white shadow-md border h-[600px] flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-gray-900">
            <I18n value="district.list.title" />
            {selectedProvince && (
              <span className="text-lg font-normal text-gray-600 ml-2">
                - {selectedProvince.tentinh}
              </span>
            )}
          </h2>
          {selectedProvince && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              title={t("district.close")}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {selectedProvince ? (
          <>
            <div className="flex items-center mb-3 gap-2">
              {/* District Search - Tên hiện tại */}
              <div className="flex-1">
                <SearchInput
                  placeholder={t("district.search.placeholder")}
                  value={searchTerm}
                  onChange={onSearchChange}
                  debounceTime={300}
                />
              </div>

              {/* District Search - Tên trước sát nhập */}
              <div className="flex-1">
                <SearchInput
                  placeholder={t("district.search.oldname.placeholder")}
                  value={oldNameSearchTerm}
                  onChange={onOldNameSearchChange}
                  debounceTime={300}
                />
              </div>
            </div>

            {/* District Stats */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{t("district.total", { count: districts.length })}</span>
              <span>
                {t("district.results", { count: filteredDistricts.length })}
              </span>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">
              <I18n value="district.select.province" />
            </p>
          </div>
        )}
      </div>

      {/* District List */}
      {selectedProvince && (
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="p-6 text-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
              <p className="text-gray-600">
                <I18n value="district.loading" />
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredDistricts.length > 0 ? (
                filteredDistricts.map((district) => (
                  <div key={district.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-500">
                        #{district.ma}
                      </span>
                      <h3 className="font-semibold text-gray-900">
                        {district.tenhc}
                      </h3>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {district.loai}
                      </span>
                    </div>
                    {district.truocsapnhap &&
                      district.truocsapnhap !== "giữ nguyên" && (
                        <p className="text-sm text-gray-600 italic">
                          {t("common.before.merge", {
                            text: district.truocsapnhap,
                          })}
                        </p>
                      )}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span>
                        {t("common.area", { value: district.dientichkm2 })}
                      </span>
                      <span>
                        {t("common.population", { value: district.dansonguoi })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-600">
                    {searchTerm || oldNameSearchTerm
                      ? t("district.no.results")
                      : t("district.no.data")}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DistrictList;
