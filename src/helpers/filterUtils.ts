import { ProvinceData, DistrictData } from "@/services/provinceService";

export const filterProvinces = (
  provinces: ProvinceData[],
  provinceSearchTerm: string,
  provinceOldNameSearchTerm: string
) => {
  let filtered = provinces;

  // Filter by current name
  if (provinceSearchTerm.trim()) {
    const lowerSearchTerm = provinceSearchTerm.toLowerCase();
    filtered = filtered.filter(
      (province) =>
        province.tentinh.toLowerCase().includes(lowerSearchTerm) ||
        province.id.toString().includes(lowerSearchTerm) ||
        province.mahc.toString().includes(lowerSearchTerm)
    );
  }

  // Filter by old name (before merger)
  if (provinceOldNameSearchTerm.trim()) {
    const lowerOldNameSearchTerm = provinceOldNameSearchTerm.toLowerCase();
    filtered = filtered.filter((province) =>
      province.truocsapnhap.toLowerCase().includes(lowerOldNameSearchTerm)
    );
  }

  return filtered;
};

export const filterDistricts = (
  districts: DistrictData[],
  districtSearchTerm: string,
  districtOldNameSearchTerm: string
) => {
  let filtered = districts;

  // Filter by current name
  if (districtSearchTerm.trim()) {
    const lowerSearchTerm = districtSearchTerm.toLowerCase();
    filtered = filtered.filter(
      (district) =>
        district.tenhc.toLowerCase().includes(lowerSearchTerm) ||
        district.ma.toLowerCase().includes(lowerSearchTerm) ||
        district.loai.toLowerCase().includes(lowerSearchTerm)
    );
  }

  // Filter by old name (before merger)
  if (districtOldNameSearchTerm.trim()) {
    const lowerOldNameSearchTerm = districtOldNameSearchTerm.toLowerCase();
    filtered = filtered.filter((district) =>
      district.truocsapnhap.toLowerCase().includes(lowerOldNameSearchTerm)
    );
  }

  return filtered;
};