import { Link } from "react-router-dom";
import { ArrowLeftRight, FileInput, Minimize2 } from "lucide-react";

export const Home = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <div className="text-center py-16 md:py-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#33333b] mb-6 leading-tight tracking-tight">
          Every tool you need to work with PDFs in one place
        </h1>
        <p className="text-lg md:text-xl text-[#47474f] mb-8 leading-relaxed max-w-3xl mx-auto font-light">
          Every tool you need to use PDFs, at your fingertips. All are 100% FREE
          and easy to use! Merge, split, compress, convert, rotate, unlock and
          watermark PDFs with just a few clicks.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="w-full max-w-7xl px-4 md:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Merge PDF */}
          <Link
            to="/merge"
            className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-transparent hover:border-gray-200 group flex flex-col h-full"
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-50 rounded-lg flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform duration-300">
                <ArrowLeftRight size={32} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3 transition-all duration-200">
              Merge PDF
            </h3>
            <p className="text-gray-600 leading-relaxed transition-all duration-200">
              Combine PDFs in the order you want with the easiest PDF merger
              available.
            </p>
          </Link>

          {/* Split PDF */}
          <Link
            to="/split"
            className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-transparent hover:border-gray-200 group flex flex-col h-full"
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-50 rounded-lg flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform duration-300">
                <FileInput size={32} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3 transition-all duration-200">
              Split PDF
            </h3>
            <p className="text-gray-600 leading-relaxed transition-all duration-200">
              Separate one page or a whole set for easy conversion into
              independent PDF files.
            </p>
          </Link>

          {/* Compress PDF */}
          <Link
            to="/compress"
            className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-transparent hover:border-gray-200 group flex flex-col h-full"
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-50 rounded-lg flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform duration-300">
                <Minimize2 size={32} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3 transition-all duration-200">
              Compress PDF
            </h3>
            <p className="text-gray-600 leading-relaxed transition-all duration-200">
              Reduce file size while optimizing for maximal PDF quality.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};
