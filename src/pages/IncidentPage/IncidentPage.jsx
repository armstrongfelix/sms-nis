import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import useIncidentStore from "../../stores/incident-store/incidentStore";
import LoadingSpinner from "../../components/spiner/LoadingSpinner";
import Button from "../../components/buttons/Button";
import IncidentStatusBadge from "../../components/incident/IncidentStatusBadge";
import { FiSearch, FiXCircle, FiCheckCircle, FiTrash2 } from "react-icons/fi";

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

export default function IncidentPage() {
  const { adminData } = useAuth();
  const { reports, loading, error, subscribe, cleanup, markAttended, clearReport } =
    useIncidentStore();
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [confirmClear, setConfirmClear] = useState(null);

  useEffect(() => {
    subscribe();
    return cleanup;
  }, []);

  const zone = adminData?.zone || "";
  const formation = adminData?.formation || "";

  const filtered = reports.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const vals = [
      r.surname,
      r.firstName,
      r.serviceNo,
      r.rank,
      r.incidentType,
      r.zone,
      r.formation,
      r.report,
    ];
    return vals.some((v) => v && v.toLowerCase().includes(q));
  });

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500 text-sm">Error: {error}</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-nis-primary">
            Incident Reports
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {zone === "SHQ" && formation === "SHQ"
              ? "All incident reports across the Service"
              : zone === formation
                ? `Incident reports from ${zone} Zone`
                : `Incident reports from ${formation} Formation`}
          </p>
        </div>
        <div className="relative w-full md:max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by officer, service no, type, report..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-nis-primary/30 focus:border-nis-primary"
          />
        </div>
      </div>

      {!filtered.length ? (
        <div className="text-gray-400 text-sm py-8 text-center">
          {reports.length === 0
            ? "No incident reports found."
            : "No reports match your search."}
        </div>
      ) : (
        <div className="overflow-auto max-h-[calc(100vh-220px)] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <table className="w-full text-sm text-left bg-white dark:bg-gray-900">
            <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800 text-nis-primary font-semibold">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap sticky left-0 z-20 bg-gray-50 dark:bg-gray-800 min-w-[50px]">S/N</th>
                <th className="px-4 py-3 whitespace-nowrap sticky left-[50px] z-20 bg-gray-50 dark:bg-gray-800 min-w-[160px]">Reporting Officer</th>
                <th className="px-4 py-3 whitespace-nowrap">Service No</th>
                <th className="px-4 py-3 whitespace-nowrap">Rank</th>
                <th className="px-4 py-3 whitespace-nowrap">Zone</th>
                <th className="px-4 py-3 whitespace-nowrap">Formation</th>
                <th className="px-4 py-3 whitespace-nowrap">Incident Type</th>
                <th className="px-4 py-3 whitespace-nowrap max-w-[220px]">Report</th>
                <th className="px-4 py-3 whitespace-nowrap">Reported At</th>
                <th className="px-4 py-3 whitespace-nowrap">Status</th>
                <th className="px-4 py-3 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((r, i) => (
                <tr
                  key={r.id}
                  onClick={() => setSelectedReport(r)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                >
                  <td className="px-4 py-3 sticky left-0 z-10 bg-white dark:bg-gray-900">{i + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap sticky left-[50px] z-10 bg-white dark:bg-gray-900">
                    {r.surname} {r.firstName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.serviceNo}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.rank}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.zone || "-"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.formation || "-"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                      {r.incidentType}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-[220px] truncate" title={r.report}>
                    {r.report}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                    {formatDateTime(r.reportedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <IncidentStatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {r.status !== "attended" && (
                        <button
                          onClick={(e) => { e.stopPropagation(); markAttended(r.id); }}
                          className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors cursor-pointer"
                          title="Mark as attended"
                        >
                          <FiCheckCircle size={16} />
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmClear(r); }}
                        className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors cursor-pointer"
                        title="Clear report"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
            >
              <FiXCircle size={20} />
            </button>

            <h2 className="text-xl font-bold text-nis-primary mb-6">
              Incident Report Details
            </h2>

            <div className="space-y-5">
              <fieldset className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <legend className="text-sm font-semibold text-nis-primary px-2">
                  Reporting Officer
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-gray-500 uppercase">Full Name</span>
                    <span className="text-sm text-nis-primary font-medium">
                      {selectedReport.surname} {selectedReport.firstName}{" "}
                      {selectedReport.middleName || ""}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-gray-500 uppercase">Service No</span>
                    <span className="text-sm text-nis-primary font-medium">{selectedReport.serviceNo}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-gray-500 uppercase">Rank</span>
                    <span className="text-sm text-nis-primary font-medium">{selectedReport.rank}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-gray-500 uppercase">Email</span>
                    <span className="text-sm text-nis-primary font-medium">{selectedReport.email || "-"}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-gray-500 uppercase">Zone</span>
                    <span className="text-sm text-nis-primary font-medium">{selectedReport.zone || "-"}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-gray-500 uppercase">Formation</span>
                    <span className="text-sm text-nis-primary font-medium">{selectedReport.formation || "-"}</span>
                  </div>
                </div>
              </fieldset>

              <fieldset className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <legend className="text-sm font-semibold text-nis-primary px-2">
                  Incident Details
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-gray-500 uppercase">Incident Type</span>
                    <span className="text-sm text-nis-primary font-medium">{selectedReport.incidentType}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-gray-500 uppercase">Reported At</span>
                    <span className="text-sm text-nis-primary font-medium">{formatDateTime(selectedReport.reportedAt)}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-gray-500 uppercase">Status</span>
                    <span><IncidentStatusBadge status={selectedReport.status} /></span>
                  </div>
                  <div className="flex flex-col gap-0.5 md:col-span-3">
                    <span className="text-xs font-medium text-gray-500 uppercase">Report</span>
                    <p className="text-sm text-nis-primary font-medium whitespace-pre-wrap">
                      {selectedReport.report}
                    </p>
                  </div>
                </div>
              </fieldset>

              <div className="flex gap-3 justify-between pt-2">
                <Button variant="ghost" onClick={() => setSelectedReport(null)}>
                  Close
                </Button>
                <div className="flex gap-2">
                  {selectedReport.status !== "attended" && (
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<FiCheckCircle />}
                      onClick={() => {
                        markAttended(selectedReport.id);
                        setSelectedReport(null);
                      }}
                    >
                      Mark Attended
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<FiTrash2 />}
                    onClick={() => {
                      setConfirmClear(selectedReport);
                      setSelectedReport(null);
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => setConfirmClear(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 z-10">
            <h3 className="text-lg font-bold text-nis-primary mb-2">Clear Incident Report</h3>
            <p className="text-sm text-gray-500 mb-4">
              {confirmClear.surname} {confirmClear.firstName} &mdash; {confirmClear.incidentType}
            </p>
            <p className="text-sm text-gray-600 mb-6">
              This will permanently remove this report from the list. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setConfirmClear(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  clearReport(confirmClear.id);
                  setConfirmClear(null);
                }}
              >
                Clear Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
