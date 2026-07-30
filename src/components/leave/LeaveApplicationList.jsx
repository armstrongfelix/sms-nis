import { useMyLeaveApplications } from "../../hooks/useLeaveApplications";
import LeaveStatusBadge from "./LeaveStatusBadge";
import LoadingSpinner from "../spiner/LoadingSpinner";

function formatDate(ts) {
  if (!ts) return "-";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function LeaveApplicationList({ officerId }) {
  const { applications, loading, error } = useMyLeaveApplications(officerId);

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
        Failed to load leave applications: {error}
      </div>
    );
  }

  if (!applications.length) {
    return (
      <div className="text-gray-400 text-sm py-8 text-center">
        No leave applications yet.
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <table className="w-full text-sm text-left bg-white dark:bg-gray-900">
        <thead className="bg-gray-50 dark:bg-gray-800 text-nis-primary font-semibold">
          <tr>
            <th className="px-4 py-3 whitespace-nowrap">Leave Type</th>
            <th className="px-4 py-3 whitespace-nowrap">Start Date</th>
            <th className="px-4 py-3 whitespace-nowrap">End Date</th>
            <th className="px-4 py-3 whitespace-nowrap">Days</th>
            <th className="px-4 py-3 whitespace-nowrap">Status</th>
            <th className="px-4 py-3 whitespace-nowrap">Admin Comment</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td className="px-4 py-3">{app.leaveType}</td>
              <td className="px-4 py-3 whitespace-nowrap">{formatDate(app.startDate)}</td>
              <td className="px-4 py-3 whitespace-nowrap">{formatDate(app.endDate)}</td>
              <td className="px-4 py-3">{app.numberOfDays}</td>
              <td className="px-4 py-3">
                <LeaveStatusBadge status={app.status} />
              </td>
              <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">
                {app.adminComment || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
