import React from "react";
import FeatureCard, { FeatureItem } from "./FeatureCard";
import { I18n } from "../utils/I18n";

interface FeatureGridProps {
  features: FeatureItem[];
  title?: string;
}

const FeatureGrid: React.FC<FeatureGridProps> = ({ features, title }) => {
  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              <I18n value={title}/>
            </h2>
            <div className="w-24 h-1 bg-[var(--primary)] mx-auto rounded-full"></div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} item={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
