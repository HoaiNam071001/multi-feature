import React from "react";
import Link from "next/link";
import { I18n } from "@/components/utils/I18n";

export interface FeatureItem {
  name: string;
  url: string;
  icon: React.ReactNode;
  description: string;
}

interface FeatureCardProps {
  item: FeatureItem;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ item }) => {
  const description = item.description;

  return (
    <Link href={item.url}>
      <div className="group bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 cursor-pointer">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 mb-4 flex items-center justify-center text-3xl text-primary group-hover:text-blue-700 transition-colors duration-300">
            {item.icon}
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors duration-300">
            <I18n value={item.name} />
          </h3>
          <p 
            className="text-gray-600 text-sm line-clamp-2"
            title={description}
          >
            <I18n value={description} />
          </p>
        </div>
      </div>
    </Link>
  );
};

export default FeatureCard;