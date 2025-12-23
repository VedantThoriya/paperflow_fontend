import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-[60px] bg-white border-b border-gray-200 z-50 flex items-center px-4 shadow-sm font-sans">
      <div className="flex items-center w-full">
        <Link to="/" replace className="flex items-center gap-2 mr-12">
          <img src="/ilovepdf.svg" alt="iLovePDF" className="h-5 md:h-8" />
        </Link>
        <nav className="hidden md:flex items-center gap-12">
          <Link
            to="/merge"
            className="text-gray-900 hover:text-red-500 font-medium text-sm lg:text-base uppercase transition-colors"
          >
            Merge PDF
          </Link>
          <Link
            to="/split"
            className="text-gray-900 hover:text-red-500 font-medium text-sm lg:text-base uppercase transition-colors"
          >
            Split PDF
          </Link>
          <Link
            to="/compress"
            className="text-gray-900 hover:text-red-500 font-medium text-sm lg:text-base uppercase transition-colors"
          >
            Compress PDF
          </Link>
        </nav>
      </div>
    </header>
  );
};
