"use client";

import React from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

// Default Layout
const DefaultLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-white font-sans">
    <Header />
    <div className="flex">
      <Sidebar />
      <main
        className="flex-1 duration-300"
        style={{ marginLeft: "0", width: `calc(100vw - 100px)` }}
      >
        {children}
      </main>
    </div>
  </div>
);

export default DefaultLayout;
