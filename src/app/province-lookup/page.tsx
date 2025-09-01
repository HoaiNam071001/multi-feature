"use client";

import { useState, useMemo, useEffect } from "react";
import {
  provinceService,
  ProvinceData,
  DistrictData,
} from "@/services/provinceService";
import ProvinceHeader from "@/components/feature/province-lookup/ProvinceHeader";
import ProvinceList from "@/components/feature/province-lookup/ProvinceList";
import DistrictList from "@/components/feature/province-lookup/DistrictList";
import ProvinceDetails from "@/components/feature/province-lookup/ProvinceDetails";
import ErrorMessage from "@/components/feature/province-lookup/ErrorMessage";
import { filterDistricts, filterProvinces } from "@/helpers";

const ProvinceLookupPage = () => {
  const [provinces, setProvinces] = useState<ProvinceData[]>([]);
  const [districts, setDistricts] = useState<DistrictData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<ProvinceData | null>(
    null
  );

  // Search states
  const [provinceSearchTerm, setProvinceSearchTerm] = useState("");
  const [provinceOldNameSearchTerm, setProvinceOldNameSearchTerm] =
    useState("");
  const [districtSearchTerm, setDistrictSearchTerm] = useState("");
  const [districtOldNameSearchTerm, setDistrictOldNameSearchTerm] =
    useState("");

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
        const data = await provinceService.getDistrictsByProvince(
          selectedProvince.id
        );
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

  // Filter provinces based on both search terms
  const filteredProvinces = useMemo(() => {
    return filterProvinces(
      provinces,
      provinceSearchTerm,
      provinceOldNameSearchTerm
    );
  }, [provinces, provinceSearchTerm, provinceOldNameSearchTerm]);

  // Filter districts based on both search terms
  const filteredDistricts = useMemo(() => {
    return filterDistricts(
      districts,
      districtSearchTerm,
      districtOldNameSearchTerm
    );
  }, [districts, districtSearchTerm, districtOldNameSearchTerm]);

  const handleProvinceClick = (province: ProvinceData) => {
    setSelectedProvince(province);
    setDistrictSearchTerm(""); // Reset district search when selecting new province
    setDistrictOldNameSearchTerm(""); // Reset district old name search
  };

  const handleClose = () => {
    setSelectedProvince(null);
    setDistricts([]);
    setDistrictSearchTerm("");
    setDistrictOldNameSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <ProvinceHeader />

      <div className="max-w-7xl mx-auto py-4">
        {/* Error Message */}
        {error && <ErrorMessage message={error} />}

        {/* Main Content - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column - Provinces */}
          <ProvinceList
            provinces={provinces}
            filteredProvinces={filteredProvinces}
            loading={loading}
            selectedProvince={selectedProvince}
            searchTerm={provinceSearchTerm}
            oldNameSearchTerm={provinceOldNameSearchTerm}
            onSearchChange={(val) => {
              setProvinceSearchTerm(val);
              setProvinceOldNameSearchTerm("");
            }}
            onOldNameSearchChange={(val) => {
              setProvinceSearchTerm("");
              setProvinceOldNameSearchTerm(val);
            }}
            onProvinceClick={handleProvinceClick}
          />

          {/* Right Column - Districts */}
          <DistrictList
            districts={districts}
            filteredDistricts={filteredDistricts}
            loading={loading}
            selectedProvince={selectedProvince}
            searchTerm={districtSearchTerm}
            oldNameSearchTerm={districtOldNameSearchTerm}
            onSearchChange={(val) => {
              setDistrictSearchTerm(val);
              setDistrictOldNameSearchTerm("");
            }}
            onOldNameSearchChange={(val) => {
              setDistrictSearchTerm("");
              setDistrictOldNameSearchTerm(val);
            }}
            onClose={handleClose}
          />
        </div>

        {/* Selected Province Details */}
        {selectedProvince && <ProvinceDetails province={selectedProvince} />}
      </div>
    </div>
  );
};

export default ProvinceLookupPage;
