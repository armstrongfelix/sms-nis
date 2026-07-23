import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const MALE_COLOR = "#006636";
const FEMALE_COLOR = "#D4A76A";

function formatPyramidTick(value) {
  return Math.abs(value).toLocaleString();
}

function PyramidTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const maleVal = payload.find(p => p.dataKey === "male")?.value || 0;
  const femaleVal = payload.find(p => p.dataKey === "female")?.value || 0;
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-3 py-2 text-xs">
      <p className="font-semibold text-gray-900 mb-1">{label}</p>
      <p className="text-emerald-700">Male: {Math.abs(maleVal).toLocaleString()}</p>
      <p className="text-amber-700">Female: {femaleVal.toLocaleString()}</p>
    </div>
  );
}

export default function RankPyramidChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        No rank data available
      </div>
    );
  }

  const chartData = data.map(d => ({
    rank: d.rank,
    male: -Math.abs(d.male),
    female: d.female,
  }));

  const maxVal = Math.max(
    ...data.map(d => Math.max(d.male, d.female)),
    1,
  );
  const tickCount = 5;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-nis-primary mb-4">
        Rank Distribution by Sex (Pyramid)
      </h3>
      <ResponsiveContainer width="100%" height={Math.max(250, data.length * 28)}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ left: 50, right: 50, top: 8, bottom: 8 }}
          stackOffset="sign"
          barSize={14}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={formatPyramidTick}
            tick={{ fontSize: 11, fill: "#6B7280" }}
            axisLine={{ stroke: "#E5E7EB" }}
            tickLine={false}
            domain={[-maxVal * 1.15, maxVal * 1.15]}
            ticks={generateTicks(maxVal, tickCount)}
          />
          <YAxis
            type="category"
            dataKey="rank"
            tick={{ fontSize: 10, fill: "#6B7280" }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<PyramidTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
          <Bar
            dataKey="male"
            fill={MALE_COLOR}
            radius={[4, 0, 0, 4]}
            stackId="stack"
          />
          <Bar
            dataKey="female"
            fill={FEMALE_COLOR}
            radius={[0, 4, 4, 0]}
            stackId="stack"
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-6 mt-2">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: MALE_COLOR }} />
          <span className="text-xs text-gray-500">Male</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: FEMALE_COLOR }} />
          <span className="text-xs text-gray-500">Female</span>
        </div>
      </div>
    </div>
  );
}

function generateTicks(max, count) {
  const step = Math.ceil(max / count / 10) * 10 || 10;
  const ticks = [];
  for (let i = -max; i <= max; i += step) {
    ticks.push(i);
  }
  if (!ticks.includes(0)) ticks.push(0);
  return ticks.sort((a, b) => a - b);
}
