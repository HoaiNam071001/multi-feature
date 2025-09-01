import { MapPin, ExternalLink } from "lucide-react";
import { I18n } from "@/components/utils/I18n";

const ProvinceHeader = () => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              <I18n value="province.lookup.title" />
            </h1>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            <I18n value="province.lookup.description" />
          </p>
          <a 
            href="https://sapnhap.bando.com.vn/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <I18n value="province.lookup.source" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProvinceHeader;
