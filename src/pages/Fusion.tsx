import { Routes, Route } from "react-router-dom";
import { FusionList } from "@/components/fusion/FusionList";
import { FusionForm } from "@/components/fusion/FusionForm";
import { FusionReport } from "@/components/fusion/FusionReport";

const Fusion = () => (
  <div className="p-4 sm:p-6 overflow-y-auto h-full">
    <Routes>
      <Route index element={<FusionList />} />
      <Route path="new" element={<FusionForm />} />
      <Route path="report/:id" element={<FusionReport />} />
    </Routes>
  </div>
);

export default Fusion;
