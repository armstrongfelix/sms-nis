import { useMemo } from "react";
import useZonalStaffStore from "../stores/zonal-store/zonalStaffStore";
import * as stats from "../selectors/staffStats";

export function useZonalStaffStats(filters = {}) {
  const staffList = useZonalStaffStore(s => s.staffList);
  const loading = useZonalStaffStore(s => s.loading);

  return useMemo(() => ({
    total: stats.getTotalStrength(staffList, filters),
    byZone: stats.getCountByZone(staffList, filters),
    byFormation: stats.getCountByFormation(staffList, filters),
    rankDist: stats.getRankDistribution(staffList, filters),
    sexDist: stats.getSexDistribution(staffList, filters),
    rankBySex: stats.getRankBySex(staffList, filters),
    sexRatioByFormation: stats.getSexRatioByFormation(staffList),
    loading,
  }), [staffList, loading, filters]);
}
