import { Link } from "react-router-dom";
import { useState } from "react";
import compressIcon from "@/assets/compress.svg";
import protectIcon from "@/assets/protect.svg";
import mergeIcon from "@/assets/merge.svg";
import splitIcon from "@/assets/split.svg";
import unlockIcon from "@/assets/unlock.svg";

export const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Organize PDF", "Optimize PDF", "PDF Security"];

  const tools = [
    {
      to: "/merge",
      icon: (
        <img src={mergeIcon} alt="Merge PDF" className="w-[40px] h-[40px]" />
      ),
      title: "Merge PDF",
      desc: "Combine PDFs in the order you want with the easiest PDF merger available.",
      category: "Organize PDF",
      color: "#E5322D",
    },
    {
      to: "/split",
      icon: (
        <img src={splitIcon} alt="Split PDF" className="w-[40px] h-[40px]" />
      ),
      title: "Split PDF",
      desc: "Separate one page or a whole set for easy conversion into independent PDF files.",
      category: "Organize PDF",
      color: "#E5322D", // Orange/Red
    },
    {
      to: "/compress",
      icon: (
        <img
          src={compressIcon}
          alt="Compress PDF"
          className="w-[40px] h-[40px]"
        />
      ),
      title: "Compress PDF",
      desc: "Reduce file size while optimizing for maximal PDF quality.",
      category: "Optimize PDF",
      color: "#00b96b",
    },
    {
      to: "/protect",
      icon: (
        <img
          src={protectIcon}
          alt="Protect PDF"
          className="w-[40px] h-[40px]"
        />
      ),
      title: "Protect PDF",
      desc: "Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.",
      category: "PDF Security",
      color: "#3b82f6", // Blue
    },
    {
      to: "/unlock",
      icon: (
        <img src={unlockIcon} alt="Unlock PDF" className="w-[40px] h-[40px]" />
      ),
      title: "Unlock PDF",
      desc: "Remove PDF password security, giving you the freedom to use your PDFs as you want.",
      category: "PDF Security",
      color: "#3b82f6", // Blue
    },
  ];

  const filteredTools =
    selectedCategory === "All"
      ? tools
      : tools.filter((t) => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      {/* Hero Section */}
      <div className="bg-[#F4F7FB] pt-20 pb-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[#383E45] mb-6">
          Every tool you need to work with PDFs in one place
        </h1>
        <p className="text-xl text-[#47505E] max-w-3xl mx-auto leading-relaxed mb-8">
          Every tool you need to use PDFs, at your fingertips. All are 100% FREE
          and easy to use! Merge, split, compress, convert, rotate, unlock and
          watermark PDFs with just a few clicks.
        </p>

        {/* Category Chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                selectedCategory === cat
                  ? "bg-[#383E45] text-white border-[#383E45] shadow-md transform scale-105"
                  : "bg-white text-[#383E45] border-gray-200 hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTools.map((tool) => (
            <Link
              key={tool.title}
              to={tool.to}
              className="bg-white p-8 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 group flex flex-col items-start text-left h-full border border-transparent hover:border-gray-100"
            >
              <div
                className="mb-6 transform group-hover:scale-110 transition-transform duration-300"
                style={{ color: tool.color }}
              >
                {tool.icon}
              </div>
              <h3
                className="text-xl font-bold text-[#383E45] mb-3 transition-colors"
                style={{
                  color: undefined, // Default color handled by class, hover by standard css or style
                }}
              >
                <span className="group-hover:text-[#383E45]">{tool.title}</span>
              </h3>
              <p className="text-[#47505E] leading-relaxed text-[15px]">
                {tool.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
