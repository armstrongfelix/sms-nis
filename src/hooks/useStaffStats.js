import { useMemo } from "react";
import useAllStaffStore from "../stores/shq-store/allStaffStore";
import * as stats from "../selectors/staffStats";

export function useStaffStats(filters = {}) {
  const staffList = useAllStaffStore(s => s.staffList);
  const loading = useAllStaffStore(s => s.loading);

  return useMemo(() => ({
    total: stats.getTotalStrength(staffList, filters),
    byZone: stats.getCountByZone(staffList, filters),
    byFormation: stats.getCountByFormation(staffList, filters),
    rankDist: stats.getRankDistribution(staffList, filters),
    sexDist: stats.getSexDistribution(staffList, filters),
    rankBySex: stats.getRankBySex(staffList, filters),
    sexRatioByFormation: stats.getSexRatioByFormation(staffList),
    formationsByZone: filters.zone
      ? stats.getFormationsByZone(staffList, filters.zone)
      : [],
    loading,
  }), [staffList, loading, filters]);
}
