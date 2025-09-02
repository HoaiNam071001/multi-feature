// Header Component

import { HEADER_HEIGHT } from "@/models/layout";
import { VenetianMask } from "lucide-react";

export const Header = () => (
  <header
    className={`bg-white flex items-center px-4 sticky top-0 z-10 shadow-lg transition-all duration-300 border-b`}
    style={{ height: HEADER_HEIGHT }}  
  >
    <div className="max-w-7xl w-full flex justify-between items-center">
      <h1 className="text-3xl font-extrabold tracking-tight">
      <VenetianMask />
      </h1>

    </div>
  </header>
);
