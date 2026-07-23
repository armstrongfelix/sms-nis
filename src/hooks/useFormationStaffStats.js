import { useMemo } from "react";
import useFormationStaffStore from "../stores/formation-store/formationStaffStore";
import * as stats from "../selectors/staffStats";

export function useFormationStaffStats(filters = {}) {
  const staffList = useFormationStaffStore(s => s.staffList);
  const loading = useFormationStaffStore(s => s.loading);

  return useMemo(() => ({
    total: stats.getTotalStrength(staffList, filters),
    rankDist: stats.getRankDistribution(staffList, filters),
    sexDist: stats.getSexDistribution(staffList, filters),
    rankBySex: stats.getRankBySex(staffList, filters),
    loading,
  }), [staffList, loading, filters]);
}
