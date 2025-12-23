import { useState, useEffect } from "react";
import { WorkspaceLayout } from "@/components/Workspace/WorkspaceLayout";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useJobStore } from "@/store/useJobStore";
import { useNavigate } from "react-router-dom";
import secureIcon from "@/assets/secure.svg";

export const ProtectPdf = () => {
  const { files, reset } = useJobStore();
  const navigate = useNavigate();

  // State
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  // Reset on mount
  useEffect(() => {
    reset();
  }, [reset]);

  const passwordsMatch = password === repeatPassword && password.length > 0;
  const canProtect = files.length > 0 && passwordsMatch;

  const handleProtect = () => {
    if (!canProtect) return;

    navigate("/uploading", {
      state: {
        jobType: "protect",
        password, // Pass password to uploading/processing
      },
    });
  };

  return (
    <WorkspaceLayout
      title="Protect PDF"
      description="Encrypt your PDF with a password to keep sensitive data confidential."
      showAddMore={false} // Requirement: Remove add more icon
      sidebarContent={
        <div className="w-full px-2 pt-2">
          <p className="text-[16px] text-[#383E45] font-medium text-left mb-8">
            Set a password to protect your PDF file
          </p>

          <div className="space-y-4">
            {/* Password Input Group */}
            <div className="flex rounded-md shadow-sm">
              <div className="relative flex-grow focus-within:z-10">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <img
                    src={secureIcon}
                    alt="security"
                    className="w-[20px] h-[20px] opacity-60"
                  />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Type password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:border-black hover:border-black focus:bg-[#F4F7FB] transition-colors text-[16px] font-normal placeholder-gray-500 h-[48px]"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`inline-flex items-center px-4 text-white rounded-r-md cursor-pointer transition-colors h-[48px] ${
                  showPassword
                    ? "bg-[#d6201b]"
                    : "bg-[#E5322D] hover:bg-[#d6201b]"
                }`}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Repeat Password Input Group */}
            <div className="flex rounded-md shadow-sm">
              <div className="relative flex-grow focus-within:z-10">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <img
                    src={secureIcon}
                    alt="security"
                    className="w-[20px] h-[20px] opacity-60"
                  />
                </div>

                <input
                  type={showRepeatPassword ? "text" : "password"}
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:border-black hover:border-black focus:bg-[#F4F7FB] transition-colors text-[16px] font-normal placeholder-gray-500 h-[48px]"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                className={`inline-flex items-center px-4 text-white rounded-r-md cursor-pointer transition-colors h-[48px] ${
                  showRepeatPassword
                    ? "bg-[#d6201b]"
                    : "bg-[#E5322D] hover:bg-[#d6201b]"
                }`}
              >
                {showRepeatPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>
      }
      actionButton={
        <div className="relative group w-full">
          <button
            onClick={handleProtect}
            disabled={!canProtect}
            className={`w-full text-white text-xl font-bold py-4 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-3
                            ${
                              canProtect
                                ? "bg-[#e5322D] hover:bg-[#d6201b] hover:scale-105 cursor-pointer"
                                : "bg-[#f49c9a] cursor-default shadow-none pointer-events-none opacity-90" // Adjusted disabled color to match screenshot potential
                            }
                        `}
          >
            <span>Protect PDF</span>
            <ArrowRight size={24} />
          </button>
          {!canProtect && files.length > 0 && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 whitespace-nowrap bg-[#383e45] text-white text-[13px] font-bold text-center py-2 px-4 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[6px] after:border-transparent after:border-t-[#383e45]">
              {files.length === 0
                ? "Please select a PDF file"
                : "Protect PDF requires two matching passwords."}
            </div>
          )}
        </div>
      }
    />
  );
};
