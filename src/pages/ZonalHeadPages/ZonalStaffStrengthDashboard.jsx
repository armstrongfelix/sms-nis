import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import useZonalStaffStore from "../../stores/zonal-store/zonalStaffStore";
import { useZonalStaffStats } from "../../hooks/useZonalStaffStats";
import KPICards from "../../components/dashboard/KPICards";
import StrengthByFormationChart from "../../components/dashboard/StrengthByFormationChart";
import RankPyramidChart from "../../components/dashboard/RankPyramidChart";
import SexDistributionChart from "../../components/dashboard/SexDistributionChart";
import SexRatioByFormationChart from "../../components/dashboard/SexRatioByFormationChart";
import StrengthByRankChart from "../../components/dashboard/StrengthByRankChart";
import DashboardFilters from "../../components/dashboard/DashboardFilters";

export default function ZonalStaffStrengthDashboard() {
  const { adminData } = useAuth();
  const staffList = useZonalStaffStore(s => s.staffList);
  const loading = useZonalStaffStore(s => s.loading);
  const fetchAllStaff = useZonalStaffStore(s => s.fetchAllStaff);

  const fetched = useRef(false);
  useEffect(() => {
    if (!fetched.current && !staffList?.length) {
      fetched.current = true;
      fetchAllStaff();
    }
  }, [fetchAllStaff, staffList?.length]);

  const [filters, setFilters] = useState({
    zone: "",
    formation: "",
    rank: "",
    sex: "",
  });

  const stats = useZonalStaffStats(filters);

  const handleFormationClick = useCallback((formation) => {
    setFilters(prev => ({ ...prev, formation }));
  }, []);

  const handleFilterChange = useCallback((next) => {
    setFilters(next);
  }, []);

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
          {adminData?.zone} — Staff Strength Analytics
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          {stats.total} staff
        </p>
      </div>

      <DashboardFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        availableFormations={stats.byFormation.map(f => f.formation)}
        showZone={false}
      />

      <KPICards
        total={stats.total}
        sexDist={stats.sexDist}
      />

      <StrengthByRankChart data={stats.rankDist} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StrengthByFormationChart
          data={stats.byFormation}
          onFormationClick={handleFormationClick}
        />
        <RankPyramidChart data={stats.rankBySex} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SexDistributionChart data={stats.sexDist} />
        <SexRatioByFormationChart data={stats.sexRatioByFormation} />
      </div>
    </div>
  );
}
