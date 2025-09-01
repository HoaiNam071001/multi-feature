import { ProvinceData } from "@/services/provinceService";
import { I18n, useI18n } from "@/components/utils/I18n";

interface ProvinceDetailsProps {
  province: ProvinceData;
}

const ProvinceDetails = ({ province }: ProvinceDetailsProps) => {
  const { t } = useI18n();

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        {t('province.details.title', { name: province.tentinh })}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-500">
            <I18n value="province.details.code" />
          </label>
          <p className="text-lg font-semibold">#{province.id}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">
            <I18n value="province.details.admin.code" />
          </label>
          <p className="text-lg font-semibold">{province.mahc}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">
            <I18n value="province.details.area" />
          </label>
          <p className="text-lg font-semibold">{province.dientichkm2} {t('common.area.unit')}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">
            <I18n value="province.details.population" />
          </label>
          <p className="text-lg font-semibold">{province.dansonguoi} {t('common.population.unit')}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">
            <I18n value="province.details.admin.center" />
          </label>
          <p className="text-lg font-semibold">{province.trungtamhc}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">
            <I18n value="province.details.longitude" />
          </label>
          <p className="text-lg font-semibold">{province.kinhdo}{t('common.degree.unit')}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">
            <I18n value="province.details.latitude" />
          </label>
          <p className="text-lg font-semibold">{province.vido}{t('common.degree.unit')}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">
            <I18n value="province.details.subunits" />
          </label>
          <p className="text-lg font-semibold">{province.con}</p>
        </div>
      </div>
      {province.truocsapnhap && province.truocsapnhap !== "không sáp nhập" && (
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <label className="text-sm font-medium text-gray-700">
            <I18n value="province.details.before.merge" />
          </label>
          <p className="text-lg font-semibold text-yellow-800">{province.truocsapnhap}</p>
        </div>
      )}
    </div>
  );
};

export default ProvinceDetails;
