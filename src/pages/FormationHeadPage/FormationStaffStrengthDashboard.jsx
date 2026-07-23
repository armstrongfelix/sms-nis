import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import useFormationStaffStore from "../../stores/formation-store/formationStaffStore";
import { useFormationStaffStats } from "../../hooks/useFormationStaffStats";
import KPICards from "../../components/dashboard/KPICards";
import RankPyramidChart from "../../components/dashboard/RankPyramidChart";
import SexDistributionChart from "../../components/dashboard/SexDistributionChart";
import StrengthByRankChart from "../../components/dashboard/StrengthByRankChart";
import { RANKS } from "../../selectors/staffStats";

const selectClass = [
  "px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white",
  "focus:outline-none focus:ring-2 focus:ring-nis-primary/30 focus:border-nis-primary",
  "hover:border-gray-400 transition-colors duration-200",
].join(" ");

export default function FormationStaffStrengthDashboard() {
  const { adminData } = useAuth();
  const staffList = useFormationStaffStore(s => s.staffList);
  const loading = useFormationStaffStore(s => s.loading);
  const fetchAllStaff = useFormationStaffStore(s => s.fetchAllStaff);

  const fetched = useRef(false);
  useEffect(() => {
    if (!fetched.current && !staffList?.length) {
      fetched.current = true;
      fetchAllStaff();
    }
  }, [fetchAllStaff, staffList?.length]);

  const [filters, setFilters] = useState({ rank: "", sex: "" });

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value || "" }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ rank: "", sex: "" });
  }, []);

  const stats = useFormationStaffStats(filters);
  const hasAnyFilter = filters.rank || filters.sex;

  if (loading && !staffList?.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">Loading staff data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-nis-primary">
          {adminData?.formation} — Staff Strength Analytics
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          {stats.total} staff in {adminData?.formation}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap items-end gap-3">
          <FilterGroup label="Rank">
            <select
              className={selectClass}
              value={filters.rank}
              onChange={e => handleFilterChange("rank", e.target.value)}
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
              onChange={e => handleFilterChange("sex", e.target.value)}
            >
              <option value="">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </FilterGroup>

          {hasAnyFilter && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <KPICards
        total={stats.total}
        sexDist={stats.sexDist}
      />

      <StrengthByRankChart data={stats.rankDist} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RankPyramidChart data={stats.rankBySex} />
        <SexDistributionChart data={stats.sexDist} />
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
