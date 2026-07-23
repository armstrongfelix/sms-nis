const SEX_COLORS = {
  Male: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Female: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
};

export default function KPICards({ total, formations, zones, sexDist }) {
  const male = sexDist?.find(s => s.sex === "Male")?.count || 0;
  const female = sexDist?.find(s => s.sex === "Female")?.count || 0;
  const totalSex = male + female || 1;

  const cards = [
    <StatCard key="total" label="Total Strength" value={total.toLocaleString()} bg="bg-nis-primary" />,
  ];

  if (formations != null) {
    cards.push(
      <StatCard key="formations" label="Formations" value={formations.toLocaleString()} bg="bg-nis-secondary" />,
    );
  }

  if (zones != null) {
    cards.push(
      <StatCard key="zones" label="Zones" value={zones.toLocaleString()} bg="bg-nis-primary/80" />,
    );
  }

  cards.push(
    <SexCard key="male" label="Male" count={male} percent={Math.round((male / totalSex) * 100)} colors={SEX_COLORS.Male} />,
    <SexCard key="female" label="Female" count={female} percent={Math.round((female / totalSex) * 100)} colors={SEX_COLORS.Female} />,
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards}
    </div>
  );
}

function StatCard({ label, value, bg }) {
  return (
    <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className={`${bg} px-4 py-3`}>
        <p className="text-xs font-medium text-white/80 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
    </div>
  );
}

function SexCard({ label, count, percent, colors }) {
  return (
    <div className="rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-3 h-3 rounded-full ${colors.dot}`} />
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{count.toLocaleString()}</p>
      <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${colors.bg.replace("50", "500")}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">{percent}% of total</p>
    </div>
  );
}
