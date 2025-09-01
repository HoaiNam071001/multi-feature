"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Gamepad2, Info, ArrowLeftToLine } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { HEADER_HEIGHT } from "@/models/layout";
import { I18n } from "@/components/utils/I18n";
import { RouterPath } from "@/models/router";
import { appFeatures } from "../feature/home/HomePage";

const sidebarItems = [
  {
    label: "Trang chủ",
    href: RouterPath.HOME,
    icon: <Home/>,
  },
  ...appFeatures.map(e=> ({
    label:e.name,
    href: e.url,
    icon: e.icon,
  }))
];

const SidebarItem = ({
  item,
  isActive,
  isCollapsed = false,
}: {
  item: (typeof sidebarItems)[0];
  isActive: boolean;
  isCollapsed?: boolean;
}) => {
  const IconComponent = item.icon;

  return (
    <Link
      href={item.href || ""}
      className={`flex items-center py-2 text-sm font-medium rounded-md transition-all duration-200 group relative 
          border
        ${
          isActive
            ? "bg-[var(--primary)] text-white shadow-sm"
            : "text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
        } ${isCollapsed ? "justify-center px-2" : " px-3"} 
      `}
      title={isCollapsed ? item.label : undefined}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[[var(--primary)]] rounded-r-full" />
      )}
      {isCollapsed ? (
        item.icon
      ) : (
        <span className="flex-1">
          <I18n value={item.label} />
        </span>
      )}
    </Link>
  );
};

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const isActiveRoute = (href: string) => {
    if (href === RouterPath.HOME) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`${
          isOpen ? "w-64" : "w-16"
        }`}>
      <div
        className={`fixed hidden md:block bg-sidebar text-sidebar-foreground  border-r border-sidebar-border shadow-lg ${
          isOpen ? "w-64" : "w-16"
        }`}
        style={{
          top: HEADER_HEIGHT,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        }}
      >
        <div
          className="p-3 h-full"
        >
          <nav className="space-y-2 mb-4">
            {sidebarItems.map((item, index) => (
              <SidebarItem
                key={index}
                item={item}
                isActive={isActiveRoute(item.href)}
                isCollapsed={!isOpen}
              />
            ))}
          </nav>
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 rounded-lg"
              aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
            >
              {isOpen ? (
                <ArrowLeftToLine className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-6 right-4 z-20 bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border border-sidebar-border shadow-lg"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="bg-sidebar text-sidebar-foreground w-64 p-4 border-r border-sidebar-border"
        >
          <nav className="space-y-1">
            {sidebarItems.map((item, index) => (
              <SidebarItem
                key={index}
                item={item}
                isActive={isActiveRoute(item.href)}
                isCollapsed={false}
              />
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
};
