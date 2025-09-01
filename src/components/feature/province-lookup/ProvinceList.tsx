import { Loader2, ChevronRight } from "lucide-react";
import { ProvinceData } from "@/services/provinceService";
import { I18n, useI18n } from "@/components/utils/I18n";
import SearchInput from "@/components/utils/SearchInput";

interface ProvinceListProps {
  provinces: ProvinceData[];
  filteredProvinces: ProvinceData[];
  loading: boolean;
  selectedProvince: ProvinceData | null;
  searchTerm: string;
  oldNameSearchTerm: string;
  onSearchChange: (value: string) => void;
  onOldNameSearchChange: (value: string) => void;
  onProvinceClick: (province: ProvinceData) => void;
}

const ProvinceList = ({
  provinces,
  filteredProvinces,
  loading,
  selectedProvince,
  searchTerm,
  oldNameSearchTerm,
  onSearchChange,
  onOldNameSearchChange,
  onProvinceClick,
}: ProvinceListProps) => {
  const { t } = useI18n();

  return (
    <div className="bg-white border shadow-md h-[600px] flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          <I18n value="province.list.title" />
        </h2>

        <div className="flex items-center mb-3 gap-2">
          {/* Province Search - Tên hiện tại */}
          <div className="flex-1">
            <SearchInput
              placeholder={t("province.search.placeholder")}
              value={searchTerm}
              onChange={onSearchChange}
              debounceTime={300}
            />
          </div>

          {/* Province Search - Tên trước sát nhập */}
          <div className="flex-1">
            <SearchInput
              placeholder={t("province.search.oldname.placeholder")}
              value={oldNameSearchTerm}
              onChange={onOldNameSearchChange}
              debounceTime={300}
            />
          </div>
        </div>

        {/* Province Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{t("province.total", { count: provinces.length })}</span>
          <span>
            {t("province.results", { count: filteredProvinces.length })}
          </span>
        </div>
      </div>

      {/* Province List */}
      <div className="flex-1 overflow-y-auto">
        {loading && provinces.length === 0 ? (
          <div className="p-6 text-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-gray-600">
              <I18n value="province.loading" />
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredProvinces.map((province) => (
              <div
                key={province.id}
                onClick={() => onProvinceClick(province)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedProvince?.id === province.id
                    ? "bg-blue-50 border-r-4 border-blue-500"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-500">
                        #{province.id}
                      </span>
                      <h3 className="font-semibold text-gray-900">
                        {province.tentinh}
                      </h3>
                    </div>
                    {province.truocsapnhap &&
                      province.truocsapnhap !== "không sáp nhập" && (
                        <p className="text-sm text-gray-600 italic">
                          {t("common.before.merge", {
                            text: province.truocsapnhap,
                          })}
                        </p>
                      )}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span>
                        {t("common.admin.code", { value: province.mahc })}
                      </span>
                      <span>
                        {t("common.area", { value: province.dientichkm2 })}
                      </span>
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
  );
};

export default ProvinceList;
