import { RANKS, ZONES } from "../../selectors/staffStats";

const selectClass = [
  "px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white",
  "focus:outline-none focus:ring-2 focus:ring-nis-primary/30 focus:border-nis-primary",
  "hover:border-gray-400 transition-colors duration-200",
].join(" ");

export default function DashboardFilters({
  filters,
  onFilterChange,
  availableFormations,
  showZone = true,
}) {
  const handleChange = (key, value) => {
    const next = { ...filters, [key]: value || "" };
    if (key === "zone") next.formation = "";
    onFilterChange(next);
  };

  const hasAnyFilter = filters.formation || filters.rank || filters.sex;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div className="flex flex-wrap items-end gap-3">
        {showZone && (
          <FilterGroup label="Zone">
            <select
              className={selectClass}
              value={filters.zone}
              onChange={e => handleChange("zone", e.target.value)}
            >
              <option value="">All Zones</option>
              {ZONES.map(z => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </FilterGroup>
        )}

        <FilterGroup label="Formation">
          <select
            className={selectClass}
            value={filters.formation}
            onChange={e => handleChange("formation", e.target.value)}
          >
            <option value="">All Formations</option>
            {availableFormations.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </FilterGroup>

        <FilterGroup label="Rank">
          <select
            className={selectClass}
            value={filters.rank}
            onChange={e => handleChange("rank", e.target.value)}
          >
            <option value="">All Ranks</option>
            {RANKS.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </FilterGroup>

        <FilterGroup label="Sex">
          <select
            className={selectClass}
            value={filters.sex}
            onChange={e => handleChange("sex", e.target.value)}
          >
            <option value="">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </FilterGroup>

        {hasAnyFilter && (
          <button
            onClick={() => onFilterChange({ zone: showZone ? "" : filters.zone, formation: "", rank: "", sex: "" })}
            className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}
