// Header Component

import { HEADER_HEIGHT } from "@/models/layout";
import Image from "next/image";

export const Header = () => (
  <header
    className={`bg-white flex items-center px-4 sticky top-0 z-10 shadow-lg transition-all duration-300 border-b`}
    style={{ height: HEADER_HEIGHT }}  
  >
    <div className="max-w-7xl w-full flex justify-between items-center">
      <h1 className="text-3xl font-extrabold tracking-tight">
        <Image src="/logo.svg" alt="Logo" width={30} height={40} />
      </h1>

    </div>
  </header>
);
