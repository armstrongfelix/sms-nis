import { useState } from "react";
import LeaveStatusBadge from "./LeaveStatusBadge";
import LoadingSpinner from "../spiner/LoadingSpinner";
import Button from "../buttons/Button";
import { FiCheck, FiX, FiSearch, FiXCircle } from "react-icons/fi";

function formatDate(ts) {
  if (!ts) return "-";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const STATUS_FILTERS = ["All", "Pending", "Approved", "Rejected"];

export default function AdminLeaveDashboard({
  applications,
  loading,
  error,
  onApprove,
  onReject,
  title = "Leave Applications",
}) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectComment, setRejectComment] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 text-sm">
        Error: {error}
      </div>
    );
  }

  const filtered = applications.filter((app) => {
    if (statusFilter !== "All" && app.status !== statusFilter.toLowerCase()) return false;
    if (search) {
      const q = search.toLowerCase();
      const vals = [app.surname, app.firstName, app.serviceNo, app.rank, app.leaveType];
      if (!vals.some((v) => v && v.toLowerCase().includes(q))) return false;
    }
    return true;
  });

  function openRejectModal(app) {
    setRejectModal(app);
    setRejectComment("");
  }

  async function handleReject() {
    if (!rejectModal) return;
    await onReject(rejectModal.id, rejectComment);
    setRejectModal(null);
    setRejectComment("");
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="text-2xl font-bold text-nis-primary">{title}</h1>

      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, service no, rank, leave type..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-nis-primary/30 focus:border-nis-primary"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={[
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                statusFilter === f
                  ? "bg-nis-primary text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700",
              ].join(" ")}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {!filtered.length ? (
        <div className="text-gray-400 text-sm py-8 text-center">
          {applications.length === 0
            ? "No leave applications found."
            : "No applications match your filters."}
        </div>
      ) : (
        <div className="overflow-auto max-h-[calc(100vh-280px)] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <table className="w-full text-sm text-left bg-white dark:bg-gray-900">
            <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800 text-nis-primary font-semibold">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap sticky left-0 z-20 bg-gray-50 dark:bg-gray-800 min-w-[50px]">S/N</th>
                <th className="px-4 py-3 whitespace-nowrap sticky left-[50px] z-20 bg-gray-50 dark:bg-gray-800 min-w-[160px]">Officer Name</th>
                <th className="px-4 py-3 whitespace-nowrap">Service No</th>
                <th className="px-4 py-3 whitespace-nowrap">Rank</th>
                <th className="px-4 py-3 whitespace-nowrap">Leave Type</th>
                <th className="px-4 py-3 whitespace-nowrap">Start Date</th>
                <th className="px-4 py-3 whitespace-nowrap">End Date</th>
                <th className="px-4 py-3 whitespace-nowrap">Days</th>
                <th className="px-4 py-3 whitespace-nowrap max-w-[200px]">Reason</th>
                <th className="px-4 py-3 whitespace-nowrap">Status</th>
                <th className="px-4 py-3 whitespace-nowrap">Reviewed By</th>
                <th className="px-4 py-3 whitespace-nowrap">Reviewed At</th>
                <th className="px-4 py-3 whitespace-nowrap">Comment</th>
                <th className="px-4 py-3 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((app, i) => (
                <tr
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                >
                  <td className="px-4 py-3 sticky left-0 z-10 bg-white dark:bg-gray-900">{i + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap sticky left-[50px] z-10 bg-white dark:bg-gray-900">
                    {app.surname} {app.firstName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{app.serviceNo}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{app.rank}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{app.leaveType}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatDate(app.startDate)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatDate(app.endDate)}</td>
                  <td className="px-4 py-3">{app.numberOfDays}</td>
                  <td className="px-4 py-3 max-w-[200px] truncate" title={app.reason}>
                    {app.reason}
                  </td>
                  <td className="px-4 py-3">
                    <LeaveStatusBadge status={app.status} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                    {app.reviewedByName || "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                    {formatDate(app.reviewedAt)}
                  </td>
                  <td className="px-4 py-3 max-w-[150px] truncate text-gray-500" title={app.adminComment}>
                    {app.adminComment || "-"}
                  </td>
                  <td className="px-4 py-3">
                    {app.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); onApprove(app.id); }}
                          className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors cursor-pointer"
                          title="Approve"
                        >
                          <FiCheck size={16} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); openRejectModal(app); }}
                          className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors cursor-pointer"
                          title="Reject"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => setRejectModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 z-10">
            <h3 className="text-lg font-bold text-nis-primary mb-2">Reject Leave Application</h3>
            <p className="text-sm text-gray-500 mb-4">
              {rejectModal.surname} {rejectModal.firstName} &mdash; {rejectModal.leaveType}
            </p>
            <div className="flex flex-col gap-1.5 mb-4">
              <label className="text-sm font-medium text-nis-primary">
                Comment (optional)
              </label>
              <textarea
                rows={3}
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)}
                placeholder="Reason for rejection..."
                className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-nis-primary/30 focus:border-nis-primary"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setRejectModal(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleReject}>
                Reject
              </Button>
            </div>
          </div>
        </div>
      )}

      {selectedApp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setSelectedApp(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
            >
              <FiXCircle size={20} />
            </button>

            <h2 className="text-xl font-bold text-nis-primary mb-6">
              Leave Application Details
            </h2>

            <div className="space-y-5">
              <fieldset className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <legend className="text-sm font-semibold text-nis-primary px-2">Officer Information</legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-gray-500 uppercase">Full Name</span>
                    <span className="text-sm text-nis-primary font-medium">{selectedApp.surname} {selectedApp.firstName} {selectedApp.middleName || ""}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-gray-500 uppercase">Service No</span>
                    <span className="text-sm text-nis-primary font-medium">{selectedApp.serviceNo}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-gray-500 uppercase">Rank</span>
                    <span className="text-sm text-nis-primary font-medium">{selectedApp.rank}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-gray-500 uppercase">Email</span>
                    <span className="text-sm text-nis-primary font-medium">{selectedApp.email}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-gray-500 uppercase">Zone</span>
                    <span className="text-sm text-nis-primary font-medium">{selectedApp.zone || "-"}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-gray-500 uppercase">Formation</span>
                    <span className="text-sm text-nis-primary font-medium">{selectedApp.formation || "-"}</span>
                  </div>
                </div>
              </fieldset>

              <fieldset className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <legend className="text-sm font-semibold text-nis-primary px-2">Leave Details</legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-gray-500 uppercase">Leave Type</span>
                    <span className="text-sm text-nis-primary font-medium">{selectedApp.leaveType}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-gray-500 uppercase">Start Date</span>
                    <span className="text-sm text-nis-primary font-medium">{formatDate(selectedApp.startDate)}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-gray-500 uppercase">End Date</span>
                    <span className="text-sm text-nis-primary font-medium">{formatDate(selectedApp.endDate)}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-gray-500 uppercase">Number of Days</span>
                    <span className="text-sm text-nis-primary font-medium">{selectedApp.numberOfDays}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 md:col-span-2">
                    <span className="text-xs font-medium text-gray-500 uppercase">Reason</span>
                    <span className="text-sm text-nis-primary font-medium">{selectedApp.reason}</span>
                  </div>
                </div>
              </fieldset>

              <fieldset className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <legend className="text-sm font-semibold text-nis-primary px-2">Status & Review</legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-gray-500 uppercase">Status</span>
                    <span><LeaveStatusBadge status={selectedApp.status} /></span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-gray-500 uppercase">Reviewed By</span>
                    <span className="text-sm text-nis-primary font-medium">{selectedApp.reviewedByName || "-"}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-gray-500 uppercase">Reviewed At</span>
                    <span className="text-sm text-nis-primary font-medium">{formatDate(selectedApp.reviewedAt)}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 md:col-span-3">
                    <span className="text-xs font-medium text-gray-500 uppercase">Admin Comment</span>
                    <span className="text-sm text-nis-primary font-medium">{selectedApp.adminComment || "-"}</span>
                  </div>
                </div>
                {selectedApp.status === "pending" && (
                  <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<FiCheck />}
                      onClick={() => { onApprove(selectedApp.id); setSelectedApp(null); }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<FiX />}
                      onClick={() => { setSelectedApp(null); openRejectModal(selectedApp); }}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </fieldset>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
