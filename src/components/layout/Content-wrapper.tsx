"use client";

import { HEADER_HEIGHT } from "@/models/layout";
import { Loader } from "lucide-react";
import { createContext, useContext, useState } from "react";

interface LoadingContextType {
  loading: boolean;
  setLoading: (value: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
};


export const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useLoading();

  return (
    <div
      className="relative m-4 bg-white rounded-sm shadow-sm"
      style={{
        minHeight: `calc(100vh - ${HEADER_HEIGHT}px - 50px)`,
      }}
    >
      {children}

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-50">
          <Loader className="animate-spin w-20 h-20 text-gray-500" />
        </div>
      )}
    </div>
  );
};