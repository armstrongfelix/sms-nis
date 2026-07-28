import { FiDownload, FiFileText, FiTable } from "react-icons/fi";
import { exportToExcel, exportToCSV, exportToPDF } from "../../utils/exportStaff";

export default function ExportButtons({ data = [], filename = "staff" }) {
  if (data.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => exportToExcel(data, filename)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-green-300 text-green-700 text-xs font-medium hover:bg-green-50 transition-colors cursor-pointer"
        title="Export to Excel"
      >
        <FiTable size={14} />
        Excel
      </button>
      <button
        onClick={() => exportToCSV(data, filename)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-blue-300 text-blue-700 text-xs font-medium hover:bg-blue-50 transition-colors cursor-pointer"
        title="Export to CSV"
      >
        <FiDownload size={14} />
        CSV
      </button>
      <button
        onClick={() => exportToPDF(data, filename)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-300 text-red-700 text-xs font-medium hover:bg-red-50 transition-colors cursor-pointer"
        title="Export to PDF"
      >
        <FiFileText size={14} />
        PDF
      </button>
    </div>
  );
}