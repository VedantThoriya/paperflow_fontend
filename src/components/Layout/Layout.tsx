import { useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div
      className={`bg-white flex flex-col font-sans ${
        isHome ? "min-h-screen" : "h-screen overflow-hidden"
      }`}
    >
      <Header />
      <main
        className={`flex-1 w-full ${
          isHome
            ? "max-w-7xl mx-auto pt-[60px] px-4 md:px-8 pb-12"
            : "pt-[60px] h-full"
        }`}
      >
        {children}
      </main>
      {isHome && (
        <footer className="bg-gray-100 py-6 text-center text-gray-500 text-sm border-t border-gray-200">
          &copy; {new Date().getFullYear()} PDF Util. All rights reserved.
        </footer>
      )}
    </div>
  );
};
