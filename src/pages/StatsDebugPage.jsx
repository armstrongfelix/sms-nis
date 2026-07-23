import { useEffect } from "react";
import useAllStaffStore from "../stores/shq-store/allStaffStore";
import { useStaffStats } from "../hooks/useStaffStats";
import KPICards from "../components/dashboard/KPICards";
import StrengthByZoneChart from "../components/dashboard/StrengthByZoneChart";
import StrengthByFormationChart from "../components/dashboard/StrengthByFormationChart";
import RankPyramidChart from "../components/dashboard/RankPyramidChart";
import SexDistributionChart from "../components/dashboard/SexDistributionChart";
import SexRatioByFormationChart from "../components/dashboard/SexRatioByFormationChart";

export default function StatsDebugPage() {
  const staffList = useAllStaffStore((s) => s.staffList);
  const loading = useAllStaffStore((s) => s.loading);
  const fetchAllStaff = useAllStaffStore((s) => s.fetchAllStaff);

  useEffect(() => {
    fetchAllStaff();
  }, [fetchAllStaff]);

  const stats = useStaffStats();

  if (loading) return <div className="p-6">Loading staff data...</div>;
  if (!staffList?.length)
    return <div className="p-6">No staff records found. Seed data first.</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-nis-primary">Step 3 — Charts</h1>
      <p className="text-sm text-gray-500">{staffList.length} records loaded</p>

      <KPICards
        total={stats.total}
        formations={stats.byFormation.length}
        zones={stats.byZone.length}
        sexDist={stats.sexDist}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StrengthByZoneChart data={stats.byZone} />
        <StrengthByFormationChart data={stats.byFormation} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RankPyramidChart data={stats.rankBySex} />
        <SexDistributionChart data={stats.sexDist} />
      </div>

      <SexRatioByFormationChart data={stats.sexRatioByFormation} />

      <hr className="border-gray-200" />
      <h2 className="text-lg font-semibold text-nis-primary">
        Selector outputs (for verification)
      </h2>

      <Section title="getTotalStrength">
        <pre>{JSON.stringify(stats.total, null, 2)}</pre>
      </Section>

      <Section title="getCountByZone (top 5)">
        <pre>{JSON.stringify(stats.byZone.slice(0, 5), null, 2)}</pre>
      </Section>

      <Section title="getCountByFormation (top 5)">
        <pre>{JSON.stringify(stats.byFormation.slice(0, 5), null, 2)}</pre>
      </Section>

      <Section title="getRankDistribution">
        <pre>{JSON.stringify(stats.rankDist, null, 2)}</pre>
      </Section>

      <Section title="getSexDistribution">
        <pre>{JSON.stringify(stats.sexDist, null, 2)}</pre>
      </Section>

      <Section title="getRankBySex (rank pyramid data)">
        <pre>{JSON.stringify(stats.rankBySex, null, 2)}</pre>
      </Section>

      <Section title="getSexRatioByFormation (top 5)">
        <pre>
          {JSON.stringify(stats.sexRatioByFormation.slice(0, 5), null, 2)}
        </pre>
      </Section>

      <Section title="Sample staff record (1st)">
        <pre>{JSON.stringify(staffList[0], null, 2)}</pre>
      </Section>

      <Section title="Unique zones in data">
        <pre>
          {JSON.stringify([...new Set(staffList.map((s) => s.zone))], null, 2)}
        </pre>
      </Section>

      <Section title="Unique formations (count)">
        <pre>
          {[...new Set(staffList.map((s) => s.formation))].length} unique
          formations
        </pre>
      </Section>

      <Section title="Unique ranks in data">
        <pre>
          {JSON.stringify([...new Set(staffList.map((s) => s.rank))], null, 2)}
        </pre>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <h2 className="text-sm font-semibold text-nis-primary mb-2">{title}</h2>
      <div className="text-xs font-mono bg-gray-50 p-3 rounded-lg overflow-auto max-h-64">
        {children}
      </div>
    </div>
  );
}
