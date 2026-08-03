const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  attended: "bg-green-50 text-green-700 border-green-200",
};

export default function IncidentStatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${style}`}
    >
      {status || "pending"}
    </span>
  );
}