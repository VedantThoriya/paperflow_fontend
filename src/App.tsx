import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout/Layout";
import { MergePdf } from "@/pages/MergePdf";
import { SplitPdf } from "@/pages/SplitPdf";
import { CompressPdf } from "@/pages/CompressPdf";
import { Home } from "@/pages/Home";
import { DownloadPage } from "@/pages/DownloadPage";
import { ProcessingPage } from "@/pages/ProcessingPage";
import { UploadingPage } from "@/pages/UploadingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/processing" element={<ProcessingPage />} />
        <Route path="/uploading" element={<UploadingPage />} />
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/merge" element={<MergePdf />} />
                <Route path="/split" element={<SplitPdf />} />
                <Route path="/compress" element={<CompressPdf />} />
                <Route path="/download" element={<DownloadPage />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
