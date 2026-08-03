import { useState } from "react";
import { FiClock, FiX, FiArrowRight } from "react-icons/fi";

function formatDateTime(ts) {
  if (!ts) return "Pending";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toMillis(ts) {
  if (!ts) return 0;
  if (ts.toMillis) return ts.toMillis();
  if (typeof ts.seconds === "number") return ts.seconds * 1000;
  return new Date(ts).getTime();
}

export function DeploymentTimeline({ history = [] }) {
  if (!history || history.length === 0) {
    return <p className="text-sm text-gray-400">No deployment records.</p>;
  }

  const sorted = [...history].sort((a, b) => toMillis(b.deployedAt) - toMillis(a.deployedAt));

  return (
    <ol className="relative space-y-5 pl-1">
      {sorted.map((h, i) => (
        <li key={i} className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-700">
          <span className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-nis-secondary ring-2 ring-white dark:ring-gray-900" />
          <div className="flex items-center gap-2 text-sm font-medium text-nis-primary">
            <span>{h.fromFormation || "-"}</span>
            <FiArrowRight size={14} className="text-gray-400 shrink-0" />
            <span>{h.toFormation || "-"}</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {h.fromZone || ""}
            {h.fromZone && h.toZone && h.fromZone !== h.toZone ? " → " : ""}
            {h.toZone && h.toZone !== h.fromZone ? h.toZone : ""}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {formatDateTime(h.deployedAt)}
            {h.deployedBy ? ` · by ${h.deployedBy}` : ""}
          </p>
        </li>
      ))}
    </ol>
  );
}

export default function DeploymentHistory({ history = [] }) {
  const [open, setOpen] = useState(false);

  if (!history || history.length === 0) {
    return <span className="text-xs text-gray-400">No deployments</span>;
  }

  return (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-nis-secondary/10 text-nis-secondary text-xs font-medium hover:bg-nis-secondary/20 transition-colors cursor-pointer"
        title="View deployment history"
      >
        <FiClock size={14} />
        {history.length} deployment{history.length > 1 ? "s" : ""}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
            >
              <FiX size={20} />
            </button>

            <h2 className="text-xl font-bold text-nis-primary mb-6">
              Deployment History
            </h2>

            <DeploymentTimeline history={history} />
          </div>
        </div>
      )}
    </>
  );
}
