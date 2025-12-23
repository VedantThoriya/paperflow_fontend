import type { ReactNode } from "react";

interface SidebarProps {
  children: ReactNode;
  title: string;
}

export const Sidebar = ({ children, title }: SidebarProps) => {
  return (
    <div className="w-full lg:w-[436px] bg-white border-l border-gray-200 h-full flex flex-col lg:shadow-none z-30 flex-shrink-0 relative">
      <div className="py-6 px-8 border-b-2 border-gray-200 bg-white">
        <h2 className="text-3xl font-medium text-[#33333b] text-center tracking-tight">
          {title}
        </h2>
      </div>
      <div className="flex-1 px-4 py-5 lg:overflow-hidden h-full flex flex-col">
        {children}
      </div>
    </div>
  );
};
