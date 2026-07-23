import { useState, useCallback, useEffect, useRef } from "react";
import useAllStaffStore from "../../stores/shq-store/allStaffStore";
import { useStaffStats } from "../../hooks/useStaffStats";
import { getFormationsByZone } from "../../selectors/staffStats";
import KPICards from "../../components/dashboard/KPICards";
import StrengthByZoneChart from "../../components/dashboard/StrengthByZoneChart";
import StrengthByFormationChart from "../../components/dashboard/StrengthByFormationChart";
import RankPyramidChart from "../../components/dashboard/RankPyramidChart";
import SexDistributionChart from "../../components/dashboard/SexDistributionChart";
import SexRatioByFormationChart from "../../components/dashboard/SexRatioByFormationChart";
import DashboardFilters from "../../components/dashboard/DashboardFilters";
import Breadcrumb from "../../components/dashboard/Breadcrumb";

export default function StaffStrengthDashboard() {
  const staffList = useAllStaffStore(s => s.staffList);
  const loading = useAllStaffStore(s => s.loading);
  const fetchAllStaff = useAllStaffStore(s => s.fetchAllStaff);

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

  const stats = useStaffStats(filters);

  const availableFormations = filters.zone
    ? getFormationsByZone(staffList, filters.zone)
    : (stats.byFormation.map(f => f.formation) || []);

  const handleNavigate = useCallback((level) => {
    if (level === "national") setFilters({ zone: "", formation: "", rank: "", sex: "" });
    if (level === "zone") setFilters(prev => ({ ...prev, formation: "" }));
  }, []);

  const handleZoneClick = useCallback((zone) => {
    setFilters(prev => ({ ...prev, zone, formation: "" }));
  }, []);

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
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-bold text-nis-primary">
            Staff Strength Analytics
          </h1>
          <Breadcrumb
            zone={filters.zone}
            formation={filters.formation}
            onNavigate={handleNavigate}
          />
        </div>
      </div>

      <DashboardFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        availableFormations={availableFormations}
      />

      <KPICards
        total={stats.total}
        formations={stats.byFormation.length}
        zones={stats.byZone.length}
        sexDist={stats.sexDist}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StrengthByZoneChart
          data={stats.byZone}
          onZoneClick={handleZoneClick}
        />
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
