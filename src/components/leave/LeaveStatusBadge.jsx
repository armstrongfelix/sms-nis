const STYLES = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  approved: "bg-green-100 text-green-800 border-green-300",
  rejected: "bg-red-100 text-red-800 border-red-300",
};

export default function LeaveStatusBadge({ status }) {
  const s = (status || "pending").toLowerCase();
  return (
    <span
      className={[
        "inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        STYLES[s] || STYLES.pending,
      ].join(" ")}
    >
      {s.charAt(0).toUpperCase() + s.slice(1)}
    </span>
  );
}
