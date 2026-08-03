import { useEffect, useState } from "react";
import { subscribeMyIncidentReports } from "../../services/incidentService";
import IncidentStatusBadge from "./IncidentStatusBadge";
import LoadingSpinner from "../spiner/LoadingSpinner";

function formatDateTime(ts) {
  if (!ts) return "-";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MyIncidentReportList({ officerId, refreshKey = 0 }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = subscribeMyIncidentReports(
      officerId,
      (list) => {
        setReports(list);
        setLoading(false);
        setError("");
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, [officerId, refreshKey]);

  if (loading) {
    return (
      <div className="py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm py-4">
        Failed to load incident reports: {error}
      </div>
    );
  }

  if (!reports.length) {
    return (
      <div className="text-gray-400 text-sm py-8 text-center">
        No incident reports yet.
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <table className="w-full text-sm text-left bg-white dark:bg-gray-900">
        <thead className="bg-gray-50 dark:bg-gray-800 text-nis-primary font-semibold">
          <tr>
            <th className="px-4 py-3 whitespace-nowrap">Incident Type</th>
            <th className="px-4 py-3 whitespace-nowrap max-w-[280px]">Report</th>
            <th className="px-4 py-3 whitespace-nowrap">Reported At</th>
            <th className="px-4 py-3 whitespace-nowrap">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {reports.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td className="px-4 py-3 whitespace-nowrap">{r.incidentType}</td>
              <td className="px-4 py-3 max-w-[280px] truncate" title={r.report}>
                {r.report}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                {formatDateTime(r.reportedAt)}
              </td>
              <td className="px-4 py-3">
                <IncidentStatusBadge status={r.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
