import { useState } from "react";
import { useJobStore } from "@/store/useJobStore";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import secureIcon from "@/assets/secure.svg";

export const UnlockPassword = () => {
  const { files } = useJobStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [passwords, setPasswords] = useState<{ [key: string]: string }>({});
  const [showPasswords, setShowPasswords] = useState<{
    [key: string]: boolean;
  }>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePasswordChange = (id: string, value: string) => {
    setPasswords((prev) => ({ ...prev, [id]: value }));
  };

  const toggleShowPassword = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSend = async () => {
    setIsProcessing(true);
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    navigate("/processing", {
      state: {
        tool: "unlock",
        jobType: "unlock",
        password: passwords[files[0].id],
        filesWithPasswords: passwords,
        fileIds: (location as any).state?.fileIds, // Pass fileIds through
      },
      replace: true,
    });
  };

  if (files.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-xl text-gray-600">No files selected.</p>
        <button
          onClick={() => navigate("/unlock")}
          className="mt-4 text-[#e5322d] font-bold hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] pt-20 pb-20 px-4">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <h1 className="text-3xl font-bold text-[#383E45] mb-12 text-center">
          Some files require password
        </h1>

        <div className="w-full max-w-[500px] space-y-6">
          {files.map((file) => (
            <div key={file.id} className="w-full">
              <label className="block text-m text-[#383E45] font-medium mb-2 truncate">
                {file.name}
              </label>
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
                    type={showPasswords[file.id] ? "text" : "password"}
                    value={passwords[file.id] || ""}
                    onChange={(e) =>
                      handlePasswordChange(file.id, e.target.value)
                    }
                    placeholder="Type password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:border-black hover:border-black focus:bg-white bg-white transition-colors text-[16px] font-normal placeholder-grey h-[48px]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => toggleShowPassword(file.id)}
                  className={`inline-flex items-center px-4 text-white rounded-r-md cursor-pointer transition-colors h-[48px] ${
                    showPasswords[file.id]
                      ? "bg-[#d6201b]"
                      : "bg-[#E5322D] hover:bg-[#d6201b]"
                  }`}
                >
                  {showPasswords[file.id] ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              onClick={handleSend}
              disabled={isProcessing}
              className="bg-[#E5322D] hover:bg-[#d6201b] text-white font-bold py-2 px-6 rounded-md transition-all shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
