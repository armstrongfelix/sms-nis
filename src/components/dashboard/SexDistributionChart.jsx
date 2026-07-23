import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const COLORS = ["#006636", "#D4A76A"];

function DonutTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { sex, count } = payload[0].payload;
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-3 py-2 text-xs">
      <p className="font-semibold text-gray-900">{sex}</p>
      <p className="text-gray-600">{count.toLocaleString()} staff</p>
    </div>
  );
}

function renderLegend({ payload }) {
  if (!payload) return null;
  return (
    <div className="flex items-center justify-center gap-6 mt-2">
      {payload.map((entry, i) => (
        <div key={entry.value} className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: COLORS[i % COLORS.length] }}
          />
          <span className="text-xs text-gray-500">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function SexDistributionChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        No sex distribution data available
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-nis-primary mb-4">
        Sex Distribution
      </h3>
      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data.map(d => ({ ...d, sex: d.sex }))}
              dataKey="count"
              nameKey="sex"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
            >
              {data.map((entry, i) => (
                <Cell
                  key={entry.sex}
                  fill={COLORS[i % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<DonutTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-400 mt-1">
          {total.toLocaleString()} total staff
        </p>
      </div>
    </div>
  );
}
